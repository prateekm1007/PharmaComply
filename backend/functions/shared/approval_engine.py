"""
PharmaComply – Approval Engine
Centralized business logic for all approval actions.
No DB queries done here – callers inject DB client.
"""

from datetime import datetime, timedelta

class ApprovalEngine:
    from .fraud_alerts import raise_fraud_alert
    """
    Enforces:
    - cooldown windows
    - velocity limit (anti abuse)
    - dual control enforcement
    """

    COOLDOWN_RULES = [
        (80, timedelta(minutes=120)),
        (60, timedelta(minutes=30)),
        (50, timedelta(minutes=10)),
    ]

    MAX_VELOCITY_PER_HOUR = 5

    def __init__(self, db_client, logger):
        self.db = db_client
        self.log = logger

    # ------------------------------
    # public API
    # ------------------------------

    async def approve(self, reset_id: str, admin_id: str, comment: str):
        req = await self._fetch_reset(reset_id)

        self._enforce_self_approval(req, admin_id)
        self._enforce_status_valid(req)
        self._enforce_cooldown(req)
        self._enforce_velocity(admin_id, req)
        self._enforce_dual_control(req, admin_id)

        await self._record_approval(reset_id, admin_id, comment)

        return await self._fetch_reset(reset_id)

    async def deny(self, reset_id: str, admin_id: str, comment: str):
        req = await self._fetch_reset(reset_id)

        self._enforce_status_valid(req)

        await self._record_denial(reset_id, admin_id, comment)

        return await self._fetch_reset(reset_id)

    # ------------------------------
    # rule checks
    # ------------------------------

    def _enforce_self_approval(self, req, admin_id):
        if req["requested_by_id"] == admin_id:
            raise PermissionError("self_approval_forbidden")

    def _enforce_dual_control(self, req, admin_id):
        if not req["requires_dual_control"]:
            return
        
        if req.get("first_approver_id") == admin_id:
            raise PermissionError("already_approved_by_you")

    def _enforce_status_valid(self, req):
        if req["status"] not in ("pending", "awaiting_second"):
            raise PermissionError("invalid_status")

    def _enforce_cooldown(self, req):
        cooldown_until = req.get("cooldown_until")
        if cooldown_until and datetime.utcnow() < cooldown_until:
            raise PermissionError("cooldown_active")

    async def _enforce_velocity(self, admin_id, req):
        rows = await self.db.fetch(
            """
            SELECT COUNT(*) AS c
            FROM approval_audit_log
            WHERE approver_id = %s
            AND created_at > NOW() - INTERVAL '1 hour'
            """,
            (admin_id,)
        )
        if rows[0]["c"] >= self.MAX_VELOCITY_PER_HOUR:
            raise PermissionError("velocity_limit_reached")

    # ------------------------------
    # db operations
    # ------------------------------

    async def _record_approval(self, reset_id, admin_id, comment):
        await self.db.execute(
            """
            INSERT INTO approval_audit_log(reset_id, approver_id, action, comment)
            VALUES (%s, %s, 'approve', %s)
            """,
            (reset_id, admin_id, comment)
        )

    async def _record_denial(self, reset_id, admin_id, comment):
        await self.db.execute(
            """
            INSERT INTO approval_audit_log(reset_id, approver_id, action, comment)
            VALUES (%s, %s, 'deny', %s)
            """,
            (reset_id, admin_id, comment)
        )

    async def _fetch_reset(self, reset_id):
        rows = await self.db.fetch(
            "SELECT * FROM usage_resets WHERE id = %s",
            (reset_id,)
        )
        if not rows:
            raise ValueError("reset_not_found")
        return rows[0]

CREATE OR REPLACE FUNCTION get_audit_chain(p_reset_id UUID)
RETURNS TABLE (
    id UUID,
    reset_id UUID,
    approver_id UUID,
    action VARCHAR,
    comment TEXT,
    integrity_hash VARCHAR,
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        id,
        reset_id,
        approver_id,
        action,
        comment,
        integrity_hash,
        created_at
    FROM approval_audit_log
    WHERE reset_id = p_reset_id
    ORDER BY created_at ASC;  -- canonical ordering
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

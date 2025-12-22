"""
GET /api/admin/case/:id/export
Returns: binary PDF
"""

import io, json
from shared.supabase_client import get_supabase_client
from shared.auth import require_role
from reportlab.pdfgen import canvas

@require_role("admin")
async def handler(event, context):
    db = get_supabase_client()
    case_id = event["path"].split("/")[-2]

    # get case record
    case = db.client.table("incident_cases").select("*").eq("id", case_id).single().execute().data

    # audit + timeline aggregation
    timeline = (
        db.client.table("incident_case_timeline")
        .select("*")
        .eq("case_id", case_id)
        .order("created_at", desc=True)
        .execute()
        .data
    )

    # PDF render
    buffer = io.BytesIO()
    pdf = canvas.Canvas(buffer)

    pdf.drawString(50, 800, f"Case Export – {case_id}")
    pdf.drawString(50, 780, f"Status: {case['status']}")
    pdf.drawString(50, 760, "Timeline:")

    y = 740
    for t in timeline:
        pdf.drawString(60, y, f"{t['created_at']} – {t['event']}")
        y -= 15
        if y < 40:
            pdf.showPage()
            y = 800
    
    pdf.save()
    buffer.seek(0)

    return {
      "statusCode": 200,
      "headers": {
         "Content-Type": "application/pdf",
         "Content-Disposition": f"attachment; filename=\"case_{case_id}.pdf\""
      },
      "body": buffer.getvalue()
    }

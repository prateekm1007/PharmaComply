import json
from shared.verify_session import verify_session

async def handler(event, context):
    try:
        user = verify_session(event)

        return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({ "user": user })
        }

    except Exception:
        return {
            "statusCode": 401,
            "body": json.dumps({"error": "unauthenticated"})
        }

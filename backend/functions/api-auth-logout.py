import json

async def handler(event, context):
    # Clear cookie client-side
    return {
        "statusCode": 200,
        "headers": {
            "Set-Cookie": "sb:token=deleted; Path=/; Max-Age=0",
            "Content-Type": "application/json"
        },
        "body": json.dumps({"success": True})
    }

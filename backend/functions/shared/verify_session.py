from supabase import create_client
import os

def verify_session(event):
    """
    Extract session cookie, validate using Supabase.
    Returns user dict OR raises exception.
    """
    cookie_header = event.get("headers", {}).get("cookie")
    if not cookie_header:
        raise Exception("unauthenticated")

    supabase = create_client(
        os.environ.get("SUPABASE_URL"),
        os.environ.get("SUPABASE_SERVICE_KEY")
    )

    session = supabase.auth.get_user(cookie_header)
    if not session or not session.user:
        raise Exception("invalid_session")

    user_metadata = session.user.user_metadata or {}
    return {
        "id": session.user.id,
        "email": session.user.email,
        "role": user_metadata.get("role", "user")
    }

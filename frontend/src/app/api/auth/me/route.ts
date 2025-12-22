import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { supabase } from "../../../../lib/supabase"

export async function GET() {
  const supa = supabase.auth
  const { data } = await supa.getSession()

  const session = data.session
  if (!session) return NextResponse.json({ user: null })

  const role = session.user?.user_metadata?.role || null
  return NextResponse.json({
    user: {
      id: session.user.id,
      role,
      email: session.user.email,
    },
  })
}

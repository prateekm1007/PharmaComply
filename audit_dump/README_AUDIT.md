PharmaComply – Audit Evidence Pack

This directory contains a frozen snapshot of all security-relevant code:

1. ALL_MIGRATIONS.sql
   - Database schema
   - RLS policies
   - Audit log immutability rules

2. edge_functions.tar.gz
   - Supabase Edge Functions
   - service_role enforcement
   - approval, locking, fraud logic

3. admin_ui.tar.gz
   - Admin-only UI
   - No client-side permission inference
   - Server-authoritative flags only

Trust boundaries:
- Clients NEVER write privileged fields
- All high-risk actions executed via Edge Functions
- Postgres RLS is enforced at all times

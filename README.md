# PharmaComply

PharmaComply is a governance-first compliance system designed for regulated environments
(healthcare, pharma, fintech) where insider abuse, unilateral actions, and audit gaps are unacceptable.

## What This Is
- Dual-control approval system
- Server-authoritative governance
- RLS-enforced org isolation
- Immutable audit logs
- Presence/view locks to prevent race conditions
- SOC-2 style control alignment

## What This Is NOT
- A consumer app
- A chat-based AI system
- Client-trusted authorization

## Trust Boundaries
- Clients: zero trust
- Supabase RLS: data boundary
- Edge Functions: process boundary
- service_role keys: never exposed to client

## Core Components
- `/supabase/migrations` – schema + RLS
- `/supabase/functions` – privileged workflows
- `/frontend/src/app/admin` – role-gated admin UI

## Audit Status
- Independent architecture review: PASS
- Controls validated: RLS, dual control, race mitigation, audit integrity

## Intended Buyers
- Regulated SaaS companies
- Internal compliance tooling teams
- Health / Pharma infrastructure providers

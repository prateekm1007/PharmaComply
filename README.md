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

## Governed Health Systems Stack (Design + Enforcement)

Includes:
- Runtime governance enforcement
- Read-only compliance monitoring
- Multi-framework audit exports
- AI-assisted governance review (advisory only)

## Independent Governance Review Scope (Buyer & Auditor Reference)

This repository is intentionally structured to enable **focused, low-friction technical diligence** for regulated environments.

The review surface is explicitly scoped to governance correctness, enforcement boundaries, and liability containment. This prevents scope creep and ensures reviewers focus only on systems that materially affect compliance risk.

### Authoritative Enforcement Layer (Must Review)

The following paths constitute the **runtime governance enforcement layer** and are authoritative:

supabase/
- Database migrations (RLS, dual-control, approval logs)
- Server-authoritative Edge Functions
- Privilege isolation and audit logging
- Read-only compliance monitoring structures

These components enforce governance constraints and generate audit evidence.

### Non-Authoritative Interfaces (Context Only)

frontend/
- Admin UI and dashboards
- Read-only consumption of server-returned flags
- No client-side authorization or privileged mutation

These components do not confer authority and should not be treated as enforcement logic.

### Advisory Tooling (Explicitly Non-Authoritative)

tools/
- AI-assisted governance gap review scripts
- Offline, human-in-the-loop analysis only
- Clearly labeled as non-deterministic and not suitable for audit reliance

These tools are provided to accelerate internal review and adoption, not to replace audits or compliance processes.

### Documentation & Evidence (Non-Certifying)

README.md  
LICENSE_AND_DISCLAIMERS.md  
evidence/

Documentation and evidence mappings are provided for transparency and audit preparation. No certification, compliance guarantee, or regulatory approval is implied.

### Out of Scope (Do Not Review)

The following are intentionally excluded from diligence scope:
- Feature completeness
- Product roadmap
- UI/UX polish
- Performance or scalability tuning
- External system integrations

This is a **governance and liability review**, not a feature or product evaluation.

### Reviewer Instruction (Canonical)

> Please limit your review to the paths listed above. Treat `supabase/` as the authoritative enforcement layer, `tools/` as advisory-only, and all documentation as non-certifying.

This scoping is deliberate and designed to make diligence predictable, efficient, and regulator-safe.

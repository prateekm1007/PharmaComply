#!/bin/bash
supabase db remote execute <<SQL
UPDATE incident_cases
SET status='investigating'
WHERE id IN (
  SELECT id FROM incident_cases_overdue WHERE overdue = TRUE
);
SQL

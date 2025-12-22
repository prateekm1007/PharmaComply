-- Enables audit hash chaining for approval_audit_log

ALTER TABLE approval_audit_log
ADD COLUMN prev_hash TEXT,
ADD COLUMN integrity_hash TEXT;

-- compute hash based on row + previous hash
CREATE OR REPLACE FUNCTION compute_audit_hash()
RETURNS TRIGGER AS $$
DECLARE
  last_hash TEXT;
BEGIN
  SELECT integrity_hash INTO last_hash
  FROM approval_audit_log
  ORDER BY created_at DESC
  LIMIT 1;

  NEW.prev_hash := last_hash;

  NEW.integrity_hash := encode(
    digest(
      concat(
        COALESCE(last_hash,''),'|',
        NEW.approver_id,'|',
        NEW.action,'|',
        NEW.reset_request_id,'|',
        NEW.created_at
    ), 'sha256'), 'hex');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_audit_hash ON approval_audit_log;

CREATE TRIGGER trg_audit_hash
BEFORE INSERT ON approval_audit_log
FOR EACH ROW EXECUTE FUNCTION compute_audit_hash();

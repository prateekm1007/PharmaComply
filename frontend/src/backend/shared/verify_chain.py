import hashlib

def verify_chain(records):
    """
    records: sorted list of audit rows from get_audit_chain
    returns: (True/False, failing_index)
    """

    for i in range(1, len(records)):
        prev = records[i - 1]
        current = records[i]

        expected_hash = hashlib.sha256(
            f"{prev['id']}|{prev['approver_id']}|{prev['action']}|{prev['comment']}|{prev['created_at']}|{prev['integrity_hash']}".encode()
        ).hexdigest()

        if expected_hash != current["integrity_hash"]:
            return False, i

    return True, None

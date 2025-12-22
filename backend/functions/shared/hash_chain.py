import hashlib
import json

def compute_record_hash(record, prev_hash):
    payload = json.dumps(record, sort_keys=True)
    chain_input = f"{payload}{prev_hash}".encode()
    return hashlib.sha256(chain_input).hexdigest()

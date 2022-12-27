import random
import string

def generate_id() -> str:
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k = 10))

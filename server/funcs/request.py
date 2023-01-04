from state.index import requests
from types.request import Request, RequestType
from types.input import MetaData, MoveInput
from utils.index import generate_id
from funcs.events import send_event
from funcs.games import send_move
from funcs.bot import process_move_request

def is_request_valid(request: Request) -> bool:
    return True

def add_request(request: Request) -> bool:
    if not is_request_valid(request):
        return False

    id = generate_id()
    requests[id] = request
    return True

def process_requests(metadata: MetaData) -> bool:
    for request in requests.values():
        request_type = request.request_type
        if request_type == RequestType.BOT_MOVE:
            process_move_request(request)
            pass
        else:
            pass

        
    return True
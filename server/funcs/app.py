from types.input import MetaData, TickInput
from funcs.request import process_requests
from funcs.tournaments import process_tournaments
from funcs.events import send_event
from types.event import TickEvent
from state.index import block

def process_state(metadata: MetaData, input: TickInput) -> bool:

    #run tournaments
    process_tournaments(metadata)

    #process requests
    process_requests(metadata)

    #send event of tick
    send_event(
        metadata, 
        TickEvent(
            timestamp=metadata.timestamp,
            address=metadata.sender,
            random = input.random,
        )
    )

    #update block in state.index to current block
    global block
    block = metadata.block_number


    return True
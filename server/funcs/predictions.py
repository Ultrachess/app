from types.input import MetaData, BetInput
from types.event import PredictionEvent
from state.index import predictions




def can_make_prediction(metadata: MetaData, input: BetInput) -> bool:
    sender = metadata.sender
    timestamp = metadata.timestamp

    return True

def bet(metadata: MetaData, input: BetInput) -> bool:
    sender = metadata.sender
    timestamp = metadata.timestamp

    if not can_make_prediction(metadata, input):
        return False

    predictions
    return True

def on_event(event: PredictionEvent):
    pass
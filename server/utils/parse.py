import struct
from types.input import MetaData, AdvanceStateData, InspectElementData, Input, InputPackingOrder

def parse_advance_state(data: dict) -> AdvanceStateData | None:
    payload = bytes.fromhex(data["payload"][2:])
    sender = data["metadata"]["msg_sender"]
    epoch_index = data["metadata"]["epoch_index"]
    input_index = data["metadata"]["input_index"]
    block_number = data["metadata"]["block_number"]
    timestamp = data["metadata"]["timestamp"]
    metadata = MetaData(sender, epoch_index, input_index, block_number, timestamp)
    return AdvanceStateData(metadata, payload)

def parse_inspect_state(data: dict) -> InspectElementData | None:
    return 

def parse_payload(payload: bytes) -> Input:
    type = int(payload[0])
    order = InputPackingOrder[type]
    obj = struct.unpack(order, payload[1:])
    return Input(type=type, order=order, *obj)
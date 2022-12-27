import struct
import inspect
from types.event import Event

def pack_event(event: Event) -> bytes:
    vals = []
    for (attr, val) in inspect.getmembers(event):
        if not attr.startswith('_') and "order" not in attr:
            if not inspect.ismethod(val):
                vals.append(val) 

    return struct.pack(event.order, vals)
import requests
import json
from utils.packing import pack_event
from types.event import Event
from utils.network import rollup_server

def send_notice(event: Event) -> bool:
    hex_str = "0x"+str(pack_event(event).hex())
    return requests.post(rollup_server + "/notice", json={"payload": hex_str})

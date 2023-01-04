import requests
import json
from utils.packing import pack_event
from types.event import Event
from utils.network import rollup_server
from funcs.predictions import on_event


def send_report(event: Event) -> bool:
    hex_str = "0x"+str(pack_event(event).hex())
    return requests.post(rollup_server + "/report", json={"payload": hex_str})



def send_notice(event: Event) -> bool:
    hex_str = "0x"+str(pack_event(event).hex())
    return requests.post(rollup_server + "/notice", json={"payload": hex_str})



def send_event(event: Event) -> bool:
    if  not event.success:
        return send_report(event)
    on_event(event)

    return send_notice(event)



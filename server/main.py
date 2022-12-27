from os import environ
from utils.parse import parse_advance_state, parse_inspect_state, parse_payload
from funcs.input import process_input
from funcs.app import process_state
import requests

rollup_server = environ["ROLLUP_HTTP_SERVER_URL"]

def reject_input(payload):
    requests.post(rollup_server + "/report", json={"payload": payload})
    return "reject"

def handle_advance(data):
    parsed = parse_advance_state(data)
    metadata = parsed.metadata
    input = parse_payload(parsed.payload)

    if not process_input(metadata, input):
        reject_input("Problem in processing input. Rejecting")

    if not process_state(metadata, input):
        reject_input("Problem in processing application state. Rejecting")

    return "accept"

def handle_inspect(data):
    return "accept"

handlers = {  
    "advance_state": handle_advance,
    "inspect_state": handle_inspect,
}

finish = {"status": "accept"} 

while True:
    #logger.info("Sending finish")
    response = requests.post(rollup_server + "/finish", json=finish)
    #logger.info(f"Received finish status {response.status_code}")
    if response.status_code == 202:
        logger.info("No pending rollup request, trying again")
    else:
        rollup_request = response.json()
        #logger.info("rollup request: ")
        #logger.info(rollup_request)
        if "data" in rollup_request and "metadata" in rollup_request["data"]:
            metadata = rollup_request["data"]["metadata"]
        else: metadata = None
        if metadata != None and metadata["epoch_index"] == 0 and metadata["input_index"] == 0:
            rollup_address = metadata["msg_sender"]
            logger.info(f"Captured rollup address: {rollup_address}")
        else:
            handler = handlers[rollup_request["request_type"]]
            finish["status"] = handler(rollup_request["data"])

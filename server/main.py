# Copyright 2022 Cartesi Pte. Ltd.
#
# SPDX-License-Identifier: Apache-2.0
# Licensed under the Apache License, Version 2.0 (the "License"); you may not use
# this file except in compliance with the License. You may obtain a copy of the
# License at http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software distributed
# under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
# CONDITIONS OF ANY KIND, either express or implied. See the License for the
# specific language governing permissions and limitations under the License.

from os import environ
from deps import *
import logging
import requests
import json
import sys
import string
import traceback
from eth_abi import decode_abi
from times import set_timestamp

logging.basicConfig(level="INFO")
logger = logging.getLogger(__name__)

rollup_server = environ["ROLLUP_HTTP_SERVER_URL"]
rollup_address = "0xF119CC4Ed90379e5E0CC2e5Dd1c8F8750BAfC812"
#rollup_address = environ["ROLLUP_ADDRESS"]
#rollup_address = "0xD8b2ab0d99827bB51697b976AcE3508B2Ad9Be9d"

logger.info(f"HTTP rollup_server url is {rollup_server}")

lastProcessedBlock = 0

def format_to_input(index, sender, operation, value, success, timeStamp):
    data_set = {
        "index": index,
        "sender": sender, 
        "operation": operation,
        "value": value, 
        "success": success,
        "timestamp": timeStamp
    }
    json_dump = json.dumps(data_set)
    return json_dump

def convert_to_hex(s_input):
    return "0x"+str(s_input.encode("utf-8").hex())

def send_notice_info(actionId, timestamp, success, value):
    data_set = {
        "actionId": actionId,
        "timestamp": timestamp, 
        "success": success,
        "value": value
    }
    json_object = json.dumps(data_set)
    logger.info("Sending notice : "+ json_object)
    hex_string = convert_to_hex(json_object)
    response = requests.post(rollup_server + "/notice", json={"payload": hex_string})
    logger.info(f"Received notice status {response.status_code} body {response.content}")
    #add action to ActionManager
    logger.info("processing action id "+ str(actionId))
    actionManager.process(actionId, data_set)
    logger.info("New PayLoad Added: "+ hex_string)
    logger.info("Adding notice")


def send_notice_deposit(index, address, amount, token):
    data_set = {
        "index": index,
        "sender": address, 
        "operation": "deposit",
        "amount": amount, 
        "token": token,
    }
    json_object = json.dumps(data_set)
    logger.info("Sending notice : "+ json_object)
    hex_string = convert_to_hex(json_object)
    response = requests.post(rollup_server + "/notice", json={"payload": hex_string})
    logger.info(f"Received notice status {response.status_code} body {response.content}")
    logger.info("New PayLoad Added: "+ hex_string)
    logger.info("Adding notice")

def send_notice(index, sender, operation, value, success, timeStamp):
    json_object = format_to_input(index, sender, operation, value, success, timeStamp)
    logger.info("Sending notice : "+ json_object)
    hex_string = convert_to_hex(json_object)
    response = requests.post(rollup_server + "/notice", json={"payload": hex_string})
    logger.info(f"Received notice status {response.status_code} body {response.content}")
    logger.info("New PayLoad Added: "+ hex_string)
    logger.info("Adding notice")

def get_state_hex():
    data_set = {
        "game": matchMaker.getState(),
        "bots": botFactory.getState(), 
        "accounts": accountManager.getState(),
        "elo": eloManager.getState(),
        "tournaments" : tournamentManager.getStringState(),
        "lastProcessedBlock": str(lastProcessedBlock),
        "lastStepTimestamp": str(botManager.last_step_timestamp),
        "actionList": actionManager.actionList()
    }
    json_object = json.dumps(data_set)
    logger.info("Inspect element return: " + json_object)
    hex_string = convert_to_hex(json_object)
    #logger.info("Inspect element return: "+ hex_string)
    return hex_string

def send_notice_state():
    data_set = {
        "game": matchMaker.getState(),
        "bots": botFactory.getState(), 
        "accounts": accountManager.getState(),
        "elo": eloManager.getState()
    }
    json_object = json.dumps(data_set)
    logger.info("Sending notice : "+ json_object)
    hex_string = convert_to_hex(json_object)
    response = requests.post(rollup_server + "/notice", json={"payload": hex_string})
    logger.info(f"Received notice status {response.status_code} body {response.content}")
    logger.info("New PayLoad Added: "+ hex_string)
    logger.info("Adding notice")

def reject_input(msg, payload):
    logger.error(msg)
    response = requests.post(rollup_server + "/report", json={"payload": payload})
    logger.info(f"Received report status {response.status_code} body {response.content}")
    return "reject"

def handle_advance(data):

    return "accept"

def handle_inspect(data):
    #logger.info(f"Received inspect request data")
    #logger.info("Adding report")
    try:
        content = (bytes.fromhex(data["payload"][2:]).decode("utf-8"))
        
        s_json = json.loads(content)
        fetchType = s_json["type"]
        fetchValue = s_json["value"]
        if fetchType == "state":
            payload = get_state_hex()
        elif fetchType == "action":
            logger.info("Recieved action request: "+ fetchValue)
            payload = actionManager.result(fetchValue)
        report = {"payload": payload}
        response = requests.post(rollup_server + "/report", json=report)
        #logger.info(f"Received report status {response.status_code}")
        return "accept"
    except:
        report = {"payload": "error"}
        response = requests.post(rollup_server + "/report", json=report)
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

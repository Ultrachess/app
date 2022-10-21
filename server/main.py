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
        "lastProcessedBlock": str(lastProcessedBlock),
        "lastStepTimestamp": str(betManager.last_step_timestamp)
        "actionList": actionManager.actionList()
    }
    json_object = json.dumps(data_set)
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
    metadata = data["metadata"]
    actionId = int(str(data["payload"][:10]), 16)
    payload = data["payload"][10:]
    depositPayload = data["payload"][2:]
    sender = metadata["msg_sender"]
    epochIndex = metadata["epoch_index"]
    inputIndex = metadata["input_index"]
    blockNumber = metadata["block_number"] 
    timeStamp = metadata["timestamp"]

    logger.info("data:"+ str(data))
    logger.info(f"metadata: {metadata}")
    #logger.info(f"payload: {payload}")
    logger.info(f"sender: {sender}")
    logger.info(f"epochIndex: {epochIndex}")
    logger.info(f"inputIndex: {inputIndex}")
    logger.info(f"blockNumber: {blockNumber}")
    logger.info(f"timeStamp: {timeStamp}")
    
    #Extract operands
    content = None
    s_json = None
    operator = None
    value = None
    depositAmount = None
    depositAddress = None
    depositTokenAddress = None

    logger.info("rollup address")
    logger.info(rollup_address)

    try:
        if sender.lower() == rollup_address.lower():
            logger.info("is from rollup address")
            #Is from rollup contract
            binary = bytes.fromhex(depositPayload)
            try:
                decoded = decode_abi(['bytes32', 'address', 'address', 'uint256', 'bytes'], binary)
            except Exception as e:
                msg = "Payload does not conform to ERC20 deposit ABI"
                logger.error(f"{msg}\n{traceback.format_exc()}")
                return reject_input(msg, data["payload"])
            
            # Check if the header matches the Keccak256-encoded string "ERC20_Transfer"
            input_header = decoded[0]
            if input_header != ERC20_TRANSFER_HEADER:
                return reject_input(f"Input header is not from an ERC20 transfer", data["payload"])

            depositAddress = decoded[1]
            depositTokenAddress = decoded[2]
            depositAmount = decoded[3]
            
        else:
            #Is user input
            content = (bytes.fromhex(payload).decode("utf-8"))
            logger.info(content)
            s_json = json.loads(content)
            operator = s_json["op"]
            value = s_json["value"]
            #logger.info(f"operator: {operator}")
            #logger.info(f"value: {value}")
    except Exception: 
        traceback.print_exc()
        #Is uploading bot binary
        operator = "createBot"

    #set timestamp
    matchMaker.setTimestamp(timeStamp)

     #Handle operator
    success = False
    if depositAmount != None:
        #Deposit money to player
        accountManager.deposit(depositAddress, depositAmount, depositTokenAddress)
    elif operator == "create":
        temp = matchMaker.create(sender, timeStamp, value)
        logger.info(temp)
        success = temp["success"]
        value = temp["value"]
    elif operator == "join":
        success = matchMaker.join(sender, timeStamp, value)
    elif operator == "resign":
        success = matchMaker.resign(sender, value)
    elif operator == "move":
        success = matchMaker.sendMove(sender, timeStamp, value)
    elif operator == "undo":
        game = matchMaker.getByPlayer(sender)
        success = game.undo()
    elif operator == "createBot":
        binary = bytes.fromhex(payload)
        success = botFactory.create(sender, binary, timeStamp)
    elif operator == "releaseFunds":
        accountManager.release(sender, value)
    elif operator == "botStep":
        botManager.step(sender, timeStamp, value, botFactory, matchMaker)
    elif operator == "manageBot":
        botManager.manage(sender, value, botFactory)
    elif operator == "bet":
        betManager.bet(sender, timeStamp, value)
    
    #Send notice on state change
    send_notice_info(actionId, timeStamp, success, value)

    #Set new state
    result = matchMaker.getStringState()
    logger.info("Here is the game state: " + result)
    logger.info("Here is the bots state: " )
    logger.info(botFactory.bots)
    logger.info("Here is the accounting state: " )
    logger.info(accountManager.accounts)
    logger.info("Here is the elo state: " )
    logger.info(eloManager.getStringState())

    lastProcessedBlock = blockNumber

    #logger.info(f"Received advance request data {data}")
    #send_notice_state()
    ##response = requests.post(rollup_server + "/notice", json=notice)
    ##logger.info(f"Received notice status {response.status_code} body {response.content}")
    return "accept"

def handle_inspect(data):
    #logger.info(f"Received inspect request data")
    #logger.info("Adding report")
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

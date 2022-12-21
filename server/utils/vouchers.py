import requests
from utils.logging import logger
from utils.network import rollup_server
from eth_abi import encode_abi

TRANSFER_FUNCTION_SELECTOR = b'\xa9\x05\x9c\xbb'

def transfer_voucher(erc20: str, address: str, amount: str):
    transfer_payload = TRANSFER_FUNCTION_SELECTOR + encode_abi(['address','uint256'], [address, amount])
    voucher = {"address": erc20, "payload": "0x" + transfer_payload.hex()}
    logger.info(f"Issuing voucher {voucher}")
    response = requests.post(rollup_server + "/voucher", json=voucher)
    logger.info(f"Received voucher status {response.status_code} body {response.content}")
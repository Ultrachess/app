from deps import *
from eth_abi import encode_abi
import logging
import requests

logging.basicConfig(level="INFO")
logger = logging.getLogger(__name__)

TRANSFER_FUNCTION_SELECTOR = b'\xb4\x83\xaf\xd3\xf4\xca\xed\xc6\xee\xbfD$o\xe5N8\xc9^1y\xa5\xec\x9e\xa8\x17@\xec\xa5\xb4\x82\xd1.'

class AccountBalanceManager:
    def __init__(self):
        self.accounts = {"0x" : {}}
    
    def getBalance(self, account, token):
        lowered_account = account.lower()
        if not lowered_account in self.accounts:
            self.accounts[lowered_account] = {}
        if not token in self.accounts[lowered_account]:
            self.accounts[lowered_account][token] = 0
        return self.accounts[lowered_account][token]

    def setBalance(self, account, balance, token):
        lowered_account = account.lower()
        if not lowered_account in self.accounts:
            self.accounts[lowered_account] = {}
        self.accounts[lowered_account][token] = balance

    def deposit(self, account, value, token):
        prev = self.getBalance(account, token)
        new = prev + value
        logger.info("prev:" + str(prev) + " new:"+str(new)+ " value:"+str(value) + " token:"+str(token))
        self.setBalance(account, new, token)

    def withdraw(self, account, value, token):
        prev = self.getBalance(account, token)
        if value > prev:
            return False
        new = prev - value
        self.setBalance(account, new, token)
        return True
    
    def release(self, account, token, rollup_server):
        #Fetch balance
        amount = self.getBalance(account, token)
        # Encode a transfer function call that returns the amount back to the depositor
        # Encode a transfer function call that returns the amount back to the depositor
        transfer_payload = TRANSFER_FUNCTION_SELECTOR + encode_abi(['address','uint256'], [account, amount])
        # Post voucher executing the transfer on the ERC-20 contract: "I don't want your money"!
        voucher = {"address": token, "payload": "0x" + transfer_payload.hex()}
        logger.info(f"Issuing voucher {voucher}")
        response = requests.post(rollup_server + "/voucher", json=voucher)
        logger.info(f"Received voucher status {response.status_code} body {response.content}")
        #Withdraw balance
        self.withdraw(account, amount, token)
        return True

    def getStringState(self):
        return str(self.accounts)

    def getState(self):
        return self.accounts
    
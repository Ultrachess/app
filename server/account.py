from deps import *
from eth_abi import encode_abi
import logging

logging.basicConfig(level="INFO")
logger = logging.getLogger(__name__)

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
    
    def release(self, account, token):
        #Fetch balance
        amount = self.getBalance(account, token)
        # Encode a transfer function call that returns the amount back to the depositor
        transfer_payload = encode_abi(['bytes','address','uint256'], [TRANSFER_FUNCTION_SELECTOR, acount, amount])
        # Encode voucher to execute the transfer on the ERC-20 contract
        encodedVoucher = encode_abi(['address', 'bytes'], [token, transfer_payload])
        # Post voucher returning the deposited amount back to the depositor: "I don't want your money"!
        logger.info("Issuing voucher")
        voucher = {"address": depositor, "payload": "0x" + encodedVoucher.hex()}
        response = requests.post(rollup_server + "/voucher", json=voucher)
        logger.info(f"Received voucher status {response.status_code} body {response.content}")
        #Withdraw balance
        self.withdraw(account, amount, token)

    def getStringState(self):
        return str(self.accounts)

    def getState(self):
        return self.accounts
    
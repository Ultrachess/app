#!/usr/bin/python
import json
from multiprocessing.connection import wait

import subprocess


# Python program showing 
# a use of input()

#Define The user interface

header = """
=========================================================================
========== 💰 Cartesi x Locus 🧾 ======
========== ✨ Simply Chess  DApp😊 =======
=========================================================================
======================== Multiple chess session =========================

>>---> Press ctrl + c finish you moves input."""


def main():
    #Get user inputs
    print(header)
    account_index = input("Enter account index: ")
    print(account_index)
    op = input("Enter the operation: ")
    print(op)
    value = input("Enter the first value: ")
    print(value)
    s_input = format_to_input(op,value)
    print("This is Operation Info String : "+ s_input)
    h_input = convert_to_hex(s_input)
    print("Operation Info in Hex: " + h_input)
    call_docker(account_index, h_input)
    print("Is this the result you were waiting for?")

def format_to_input(op,val):
    data_set = {"op": op, "value": val}
    json_dump = json.dumps(data_set)
    return json_dump

def convert_to_hex(s_input):
    return "0x"+str(s_input.encode("utf-8").hex())

def call_docker(account_index, h_input):
    subprocess.call("docker exec chessapp_hardhat_1 npx hardhat --network localhost chessApp:addInput --input "+h_input+" --account-index "+account_index, shell=True)



main()



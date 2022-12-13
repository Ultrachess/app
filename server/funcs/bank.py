from types.account import Account
from types.user import BaseUser

def deposit(users: dict[str, BaseUser], id: str, token: str, amount: int):
    new_account = users[id] 
    for i in range(new_account.balances):
        balance = new_account.balances[i]
        if balance.token == token:
            new_account.balances[i] += amount
            return new_account
    return new_account
    

from types.account import Account

def deposit(account: Account, token: str, amount: int):
    new_account = account 
    for i in range(new_account.balances):
        balance = new_account.balances[i]
        if balance.token == token:
            new_account.balances[i] += amount
            return new_account
    return new_account
    

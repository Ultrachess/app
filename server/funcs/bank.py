from types.event import DepositFundsEvent, TransferFundsEvent, WithdrawFundsEvent
from funcs.accounts import get_user, set_user
from state.index import users

def deposit(timestamp: int, id: str, token: str, amount: int) -> DepositFundsEvent:
    new_account = get_user(id)
    for i in range(new_account.account.balances):
        balance = new_account.account.balances[i]
        if balance.token == token:
            new_account.account.balances[i].amount += amount
    set_user(id, new_account)

    return DepositFundsEvent(
        success=True,
        timestamp=timestamp,
        user=id,
        token=token,
        amount=amount
    )
    
def transfer(timestamp: int, id: str, destination: str, token: str, amount: int) -> TransferFundsEvent:
    user = get_user(id)
    completed = False
    for i in range(user.account.balances):
        balance = user.account.balances[i]
        if balance.token == token and balance.amount >= amount:
            user.account.balances[i].amount -= amount
            completed = True

    dest = get_user(destination)
    if completed:
        for i in range(dest.account.balances):
            balance = dest.account.balances[i]
            if balance.token == token:
                dest.account.balances[i].amount += amount

    set_user(id, user)
    set_user(id, dest)

    return TransferFundsEvent(
        success=True,
        timestamp=timestamp,
        user=id,
        destination=destination,
        token=token,
        amount=amount
    )


def withdraw(timestamp: int, id: str, token: str, amount: int) -> WithdrawFundsEvent:
    user = get_user(id)
    for i in range(user.account.balances):
        balance = user.account.balances[i]
        if balance.token == token:
            user.account.balances[i].amount -= amount
    set_user(id, user)

    return WithdrawFundsEvent(
        success=True,
        user=id,
        token=token,
        amount=amount
    )

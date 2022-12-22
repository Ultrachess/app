from types.event import DepositFundsEvent, TransferFundsEvent, WithdrawFundsEvent
from types.account import Balance
from funcs.accounts import get_user, set_user
from utils.vouchers import transfer_voucher

def get_balance(id: str, token: str) -> int:
    user = get_user(id)
    if token not in user.account.balances:
        return 0

    return user.account.balances[token].amount

def deposit(timestamp: int, id: str, token: str, amount: int) -> DepositFundsEvent:
    user = get_user(id)
    if not token in user.account.balances:
        user.account.balances[token] = Balance(token, amount)

    user.account.balances[token].amount += amount
    set_user(id, user)

    return DepositFundsEvent(
        success=True,
        timestamp=timestamp,
        user=id,
        token=token,
        amount=amount
    )
    
def transfer(timestamp: int, id: str, destination: str, token: str, amount: int) -> TransferFundsEvent:
    user = get_user(id)
    dest = get_user(destination)
    
    if not token in user.account.balances:
        return TransferFundsEvent(success=False)

    if user.account.balances[token].amount >= amount:
        return TransferFundsEvent(success=False)
    
    user.account.balances[token].amount -= amount
    dest.account.balances[token].amount += amount

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
    if not token in user.account.balances:
        return WithdrawFundsEvent(success=False)

    if user.account.balances[token].amount < amount:
        return WithdrawFundsEvent(success=False)

    user.account.balances[token].amount -= amount
    set_user(id, user)
    transfer_voucher(token, id, amount)

    return WithdrawFundsEvent(
        success=True,
        timestamp=timestamp,
        user=id,
        token=token,
        amount=amount
    )

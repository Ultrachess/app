from dataclasses import dataclass

@dataclass
class Balance:
    token: str
    amount: int
    
@dataclass
class Account:
    balance: list[Balance]

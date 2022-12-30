from dataclasses import dataclass
from event import Event
from enum import Enum

class Condition(Enum):
    greater = 0
    less = 1
    equal = 2

@dataclass
class Prediction:
    condition: Condition
    attr: int
    event: Event

@dataclass
class Bet:
    user: str
    prediction: Prediction
    amount: int
    token: str
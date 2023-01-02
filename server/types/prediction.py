from dataclasses import dataclass
from event import EventType
from enum import Enum

class Condition(Enum):
    greater = 0
    less = 1
    equal = 2

@dataclass
class BasePrediction:
    event_type: EventType

@dataclass
class GameEndPrediction:
    event_type = EventType.GAME_END
    game_id: str
    score1: int

Prediction = GameEndPrediction
    
@dataclass
class Bet:
    id: str
    user: str
    prediction: Prediction
    amount: int
    token: str

@dataclass
class BettingPool:
    token: str
    amount: int
    bets: list[str]

@dataclass
class Pot:
    token: str
    amount: int
    pools: list[BettingPool]
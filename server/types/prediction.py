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
    id: str
    token: str
    amount: int = 0
    bets: list[str] = []

@dataclass
class Pot:
    id: str
    token: str
    amount: int = 0
    pools: list[str] = []
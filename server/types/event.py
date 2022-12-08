from dataclasses import dataclass
from stats import ComputeResources

@dataclass
class BaseEvent:
    timestamp: int
    compute: ComputeResources

@dataclass
class CreateGameEvent(BaseEvent):
    sender: int
    id: str

@dataclass
class JoinGameEvent(BaseEvent):
    sender: int
    id: str

@dataclass
class MoveEvent(BaseEvent):
    sender: str
    uci: str

Event = CreateGameEvent | JoinGameEvent 



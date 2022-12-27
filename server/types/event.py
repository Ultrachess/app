from dataclasses import dataclass
from types.stats import ComputeResources, EngineMoveStatistics
from types.struct import StructBinary

@dataclass
class BaseEvent(StructBinary):
    success: bool
    timestamp: int
    compute: ComputeResources

@dataclass
class CreateGameEvent(BaseEvent):
    creator: int
    game: str

@dataclass
class JoinGameEvent(BaseEvent):
    user: int
    game: str

@dataclass
class MoveEvent(BaseEvent):
    sender: str
    uci: str

@dataclass
class BotMoveEvent(MoveEvent):
    stats: EngineMoveStatistics

@dataclass
class ResignGameEvent(BaseEvent):
    user: str
    game: str

@dataclass
class GameEndEvent(BaseEvent):
    game: str

@dataclass
class EloEvent(BaseEvent):
    user: str
    game: str
    prev: int
    now: int

@dataclass
class DeployBotEvent(BaseEvent):
    creator: str
    bot_id: str

@dataclass
class DepositFundsEvent(BaseEvent):
    user: str
    token: str
    amount: int

@dataclass
class TransferFundsEvent(BaseEvent):
    user: str
    destination: str
    token: str
    amount: int

@dataclass
class WithdrawFundsEvent(BaseEvent):
    user: str
    token: str
    amount: int

Event = CreateGameEvent | JoinGameEvent 



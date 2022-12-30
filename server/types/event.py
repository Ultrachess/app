from dataclasses import dataclass
from types.stats import ComputeResources, EngineMoveStatistics
from types.struct import StructBinary
from enum import Enum

class EventType(Enum):
    MOVE = 0
    CREATE_GAME = 1
    JOIN_GAME = 2
    RESIGN_GAME = 3
    DEPLOY_BOT = 4
    UPDATE_BOT = 5
    DEPOSIT = 6
    WITHDRAW = 7
    BET = 8
    CREATE_TOURNAMENT = 9
    JOIN_TOURNAMENT= 10
    BOT_MOVE = 11
    GAME_END = 12
    ELO_EVENT = 13
    TOURNAMENT_END = 14
    TRANSFER = 15


@dataclass
class BaseEvent(StructBinary):
    type: int
    success: bool
    timestamp: int
    compute: ComputeResources

@dataclass
class CreateGameEvent(BaseEvent):
    type = EventType.CREATE_GAME
    creator: int
    game: str

@dataclass
class JoinGameEvent(BaseEvent):
    type = EventType.JOIN_GAME
    user: int
    game: str

@dataclass
class MoveEvent(BaseEvent):
    type = EventType.MOVE
    sender: str
    uci: str

@dataclass
class BotMoveEvent(MoveEvent):
    type = EventType.BOT_MOVE
    stats: EngineMoveStatistics

@dataclass
class ResignGameEvent(BaseEvent):
    type = EventType.RESIGN_GAME
    user: str
    game: str

@dataclass
class GameEndEvent(BaseEvent):
    type = EventType.GAME_END
    game: str

@dataclass
class EloEvent(BaseEvent):
    type = EventType.ELO_EVENT
    user: str
    game: str
    prev: int
    now: int

@dataclass
class DeployBotEvent(BaseEvent):
    type = EventType.DEPLOY_BOT
    creator: str
    bot_id: str

@dataclass
class DepositFundsEvent(BaseEvent):
    type = EventType.DEPOSIT
    user: str
    token: str
    amount: int

@dataclass
class TransferFundsEvent(BaseEvent):
    type = EventType.TRANSFER
    user: str
    destination: str
    token: str
    amount: int

@dataclass
class WithdrawFundsEvent(BaseEvent):
    type = EventType.WITHDRAW
    user: str
    token: str
    amount: int

@dataclass
class BetEvent(BaseEvent):
    type = EventType.BET
    user: str
    amount: int
    token: str
    condition: int
    attr: int

Event = CreateGameEvent | JoinGameEvent 



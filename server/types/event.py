from dataclasses import dataclass
from types.stats import ComputeResources, EngineMoveStatistics
from types.struct import StructBinary
from types.request import RequestType
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
    PAYOUT = 16
    TICK = 17
    BOT_MOVE_REQUEST = 18


@dataclass
class BaseEvent(StructBinary):
    type: EventType
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
    game_id: str
    score1: int

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
    bet_id: str
    pot_id: str
    pool_id: str

@dataclass
class PayoutEvent(BaseEvent):
    type = EventType.PAYOUT
    user: str
    amount: int
    token: str
    pot_id: str
    pool_id: str
    bet_id: str

@dataclass
class CreateTournamentEvent(BaseEvent):
    type = EventType.CREATE_TOURNAMENT
    creator: str
    tournament_id: str

@dataclass
class JoinTournamentEvent(BaseEvent):
    type = EventType.JOIN_TOURNAMENT
    user: str
    tournament_id: str

@dataclass
class TournamentEndEvent(BaseEvent):
    type = EventType.TOURNAMENT_END
    tournament_id: str
    winner: str

@dataclass
class BotMoveRequestEvent(BaseEvent):
    type = EventType.BOT_MOVE_REQUEST
    request_type: RequestType

@dataclass
class TickEvent(BaseEvent):
    type = EventType.TICK
    address: str
    random: int

@dataclass
class UpdateBotEvent(BaseEvent):
    type = EventType.UPDATE_BOT
    sender: str

    owner: str
    bot_id: str
    
    auto_enabled: bool
    wager_token: str
    wager_amount: int
    lowest_elo: int
    highest_elo: int

    time_limit: int
    depth_limit: int
    nodes_limit: int


Event = CreateGameEvent | JoinGameEvent | MoveEvent | ResignGameEvent | DeployBotEvent | DepositFundsEvent | WithdrawFundsEvent | BetEvent | EloEvent | GameEndEvent | BotMoveEvent | TransferFundsEvent



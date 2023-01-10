from dataclasses import dataclass
from enum import Enum


class InspectType(Enum):
    USER = 0
    GAME = 1
    BOT = 2
    TOURNAMENT = 3
    BET = 4
    POOL = 5
    POT = 6
    REQUEST = 7
    USERS = 8
    GAMES = 9
    BOTS = 10
    TOURNAMENTS = 11
    BETS = 12
    POOLS = 13
    POTS = 14
    REQUESTS = 13
    BLOCK = 14

    

InspectPackingOrder = [
    "abc",
    "abc",
    "abc",
    "abc",
    "abc",
]


@dataclass
class BaseInspect:
    type: InspectType
    order: str

@dataclass
class ListInspect(BaseInspect):
    type = InspectType.USERS,
    index: int
    range: int



@dataclass
class UserInspect(BaseInspect):
    type = InspectType.USER,
    user: int

@dataclass
class UsersInspect(ListInspect):
    type = InspectType.USERS



@dataclass
class GameInspect(BaseInspect):
    type = InspectType.GAME,
    game: str

@dataclass
class GamesInspect(ListInspect):
    type = InspectType.GAMES,



@dataclass
class BotInspect(BaseInspect):
    type = InspectType.BOT,
    bot: str

@dataclass
class BotsInspect(ListInspect):
    type = InspectType.BOTS,



@dataclass
class TournamentInspect(BaseInspect):
    type = InspectType.TOURNAMENT,
    tournament: str

@dataclass
class TournamentsInspect(ListInspect):
    type = InspectType.TOURNAMENTS,



@dataclass
class BetInspect(BaseInspect):
    type = InspectType.BET,
    bet: str

@dataclass
class BetsInspect(ListInspect):
    type = InspectType.BETS,



@dataclass
class PoolInspect(BaseInspect):
    type = InspectType.POOL,
    pool: str

@dataclass
class PoolsInspect(ListInspect):
    type = InspectType.POOLS,



@dataclass
class PotInspect(BaseInspect):
    type = InspectType.POT,
    pot: str

@dataclass
class PotsInspect(ListInspect):
    type = InspectType.POTS,



@dataclass
class RequestInspect(BaseInspect):
    type = InspectType.REQUEST,
    request: str

@dataclass
class RequestsInspect(ListInspect):
    type = InspectType.REQUESTS,



@dataclass
class BlockInspect(BaseInspect):
    type = InspectType.BLOCK,




Inspect = UserInspect | GamesInspect | BotsInspect | TournamentsInspect | BetsInspect | PoolsInspect | PotsInspect | RequestsInspect | BlockInspect



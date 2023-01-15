from enum import Enum
from dataclasses import dataclass
from types.game import Match
from types.input import CreateGameInput

class TournamentType(Enum):
    Knockout = "Knockout"
    RoundRobin = "RoundRobin"
    DoubleRoundRobin = "DoubleRoundRobin"
    Swiss = "Swiss"

@dataclass
class Tournament:
    id: str
    owner: str
    type: TournamentType
    participants: list[str]
    rounds: list[list[Match]]
    games_per_match: int
    game_info: CreateGameInput
    entrance_fee: int = 0
    entrance_token: str = "ETH"
    over: bool = False


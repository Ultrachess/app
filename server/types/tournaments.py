from enum import Enum
from dataclasses import dataclass
from types.game import Match

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

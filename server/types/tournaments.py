from enum import Enum

class TournamentType(Enum):
    Knockout = "Knockout"
    RoundRobin = "RoundRobin"
    DoubleRoundRobin = "DoubleRoundRobin"
    Swiss = "Swiss"
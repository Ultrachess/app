import chess.engine
import chess.pgn
from dataclasses import dataclass

@dataclass
class Game:
    id: str
    players: list[str]
    score: list[int]
    wager: int
    token: str
    betting_duration: int
    created: int
    root: chess.pgn.Game
    state: chess.pgn.Game

@dataclass
class Match:
    games: list[str]

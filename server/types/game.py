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
    bet_duration: int
    created: int
    root: chess.pgn.Game = chess.pgn.Game()
    state: chess.pgn.Game = root

@dataclass
class Match:
    p1: str
    p2: str
    game_count: int
    games: list[str]

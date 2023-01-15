import chess.engine
import chess.pgn
from dataclasses import dataclass

@dataclass
class Game:
    id: str
    p1: str
    p2: str
    score1: float = 0
    score2: float = 0
    wager: int = 0
    token: str = "ETH"
    bet_duration: int = 0
    created: int = 0
    root: chess.pgn.Game = chess.pgn.Game()
    state: chess.pgn.Game = root

@dataclass
class Match:
    p1: str
    p2: str
    game_count: int
    games: list[str]

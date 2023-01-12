from dataclasses import dataclass
from types.user import BaseUser
from types.preferences import BotMatchMakingPreferences, BotMovePreferences
import chess.engine

@dataclass
class Bot(BaseUser):
    owner: str
    engine: chess.engine.SimpleEngine
    bytecode: str
    move_preferences: BotMovePreferences
    matchmaking_preferences: BotMatchMakingPreferences



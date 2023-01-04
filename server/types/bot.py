from dataclasses import dataclass
from types.user import BaseUser
from types.preferences import BotPreferences
import chess.engine

@dataclass
class Bot(BaseUser):
    owner: str
    engine: chess.engine.SimpleEngine
    bytecode: str
    preferences: BotPreferences


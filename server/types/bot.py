from dataclasses import dataclass
from types.user import BaseUser
from types.preferences import BotPreferences

@dataclass
class Bot(BaseUser):
    owner: str
    bytecode: str
    preferences: BotPreferences


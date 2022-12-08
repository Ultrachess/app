from dataclasses import dataclass
from user import BaseUser
from preferences import BotPreferences

@dataclass
class Bot(BaseUser):
    owner: str
    bytecode: str
    preferences: BotPreferences


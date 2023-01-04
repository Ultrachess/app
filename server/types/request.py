from dataclasses import dataclass
from enum import Enum

class RequestType(Enum):
    BOT_MOVE = 0

@dataclass
class BaseRequest:
    type: RequestType

@dataclass
class BotMoveRequest(BaseRequest):
    type = RequestType.BOT_MOVE
    bot_id: str
    game_id: str

Request = BotMoveRequest
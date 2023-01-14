from dataclasses import dataclass
from enum import Enum

class RequestType(Enum):
    BOT_MOVE = 0
    BOT_SEARCH_MATCH = 1

@dataclass
class BaseRequest:
    type: RequestType

@dataclass
class BotMoveRequest(BaseRequest):
    type = RequestType.BOT_MOVE
    bot_id: str
    game_id: str

@dataclass
class BotSearchMatchRequest(BaseRequest):
    type = RequestType.BOT_SEARCH_MATCH
    bot_id: str

Request = BotMoveRequest
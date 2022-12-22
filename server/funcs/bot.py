from state.index import bots
from types.bot import Bot
from types.input import DeployBotInput
from types.event import DeployBotEvent

def get_bot(id: str) -> Bot:
    if id in bots:
        return bots[id]

def create_bot(bots: dict[str, Bot], input: DeployBotInput) -> bool:
    return True

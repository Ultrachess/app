from state.index import bots
from types.bot import Bot
from types.input import DeployBotInput
from types.event import DeployBotEvent

def get_bot(id: str) -> Bot:
    if id in bots:
        return bots[id]

def create_bot(bots: dict[str, Bot], input: DeployBotInput) -> bool:
    #generate random string from rand
    #check if string is in bots
    #if not, add to bots
    #return true
    #else return false
    

    
    
    if id in bots:
        return False
    
    return True

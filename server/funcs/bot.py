import chess.engine
import subprocess
from state.index import bots, games
from types.bot import Bot
from types.input import DeployBotInput, MetaData, MoveInput
from types.event import DeployBotEvent
from types.request import BotMoveRequest
from funcs.games import send_move
from utils.constants import MAX_BOT_TIME

def get_bot(id: str) -> Bot:
    if id in bots:
        return bots[id]

def process_move_request(metadata: MetaData, request: BotMoveRequest) -> bool:
    #get bot
    bot = get_bot(request.bot_id)
    #get game
    game = games[request.game_id]
    #get move
    board = game.state.board()
    uci = bot.engine.play(board, chess.engine.Limit(time=MAX_BOT_TIME)).move.uci()
    #send move
    send_move(
        MetaData(
            timestamp=metadata.timestamp,
            sender=bot.id
        ), 
        MoveInput(
            game_id=request.game_id, 
            move=uci
        )
    )
    #return true
    pass

def create_bot(bots: dict[str, Bot], input: DeployBotInput) -> bool:
    #generate random string from rand
    #check if string is in bots
    #if not, add to bots
    #return true
    #else return false
    

    
    
    if id in bots:
        return False
    
    return True

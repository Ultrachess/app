import chess.engine
import subprocess
from state.index import bots, games
from types.bot import Bot
from types.input import DeployBotInput, MetaData, MoveInput, UpdateBotInput
from types.event import DeployBotEvent, UpdateBotEvent
from types.request import BotMoveRequest
from types.stats import EngineMoveStatistics
from funcs.games import send_move
from funcs.events import send_event
from utils.index import generate_id
from utils.constants import MAX_BOT_TIME

#fetch bot from state
def get_bot(id: str) -> Bot:
    if id in bots:
        return bots[id]

#process bot move request
def process_move_request(metadata: MetaData, request: BotMoveRequest) -> bool:
    #get bot
    bot = get_bot(request.bot_id)
    #get game
    game = games[request.game_id]
    #get move
    board = game.state.board()
    result = bot.engine.play(board, chess.engine.Limit(time=MAX_BOT_TIME), info=chess.engine.INFO_ALL)
    uci = result.move.uci()
    info = result.info
    #send move
    send_move(
        MetaData(
            timestamp=metadata.timestamp,
            sender=bot.id
        ), 
        MoveInput(
            game_id=request.game_id, 
            move=uci
        ),
        EngineMoveStatistics(
            depth= info["depth"] if "depth" in info else 0,
            seldepth= info["seldepth"] if "seldepth" in info else 0,
            time= info["time"] if "time" in info else 0,
            nodes= info["nodes"] if "nodes" in info else 0,
            pv= info["pv"] if "pv" in info else [],
            score= info["score"] if "score" in info else 0,
            nps= info["nps"] if "nps" in info else 0,
            tbhits= info["tbhits"] if "tbhits" in info else 0,
            sbhits= info["sbhits"] if "sbhits" in info else 0,
            cpuload= info["cpuload"] if "cpuload" in info else 0,
        )
    )
    #return true
    pass

#update bot
def update_bot(metadata: MetaData, input: UpdateBotInput) -> bool:
    #get input and id
    sender = metadata.sender
    timestamp = metadata.timestamp
    
    id = input.id
    new_owner = input.new_owner
    auto_enabled = input.auto_enabled
    wager_token = input.wager_token
    wager_amount = input.wager_amount
    lowest_elo = input.lowest_elo
    highest_elo = input.highest_elo
    time_limit = input.time_limit
    depth_limit = input.depth_limit
    nodes_limit = input.nodes_limit

    #update bot
    bot = get_bot(id)

    bot.owner = new_owner

    bot.matchmaking_preferences.auto_enabled = auto_enabled
    bot.matchmaking_preferences.wager_token = wager_token
    bot.matchmaking_preferences.wager_amount = wager_amount
    bot.matchmaking_preferences.lowest_elo = lowest_elo
    bot.matchmaking_preferences.highest_elo = highest_elo

    bot.move_preferences.time_limit = time_limit
    bot.move_preferences.depth_limit = depth_limit
    bot.move_preferences.nodes_limit = nodes_limit
    global bots
    bots[id] = bot


    send_event(
        UpdateBotEvent(
            sender=sender,
            timestamp=timestamp,
            bot_id=id,
            new_owner=new_owner,
            auto_enabled=auto_enabled,
            wager_token=wager_token,
            wager_amount=wager_amount,
            lowest_elo=lowest_elo,
            highest_elo=highest_elo,
            time_limit=time_limit,
            depth_limit=depth_limit,
            nodes_limit=nodes_limit
        )
    )

#create bot
def create_bot(metadata: MetaData, input: DeployBotInput) -> bool:
    #get input and id
    sender = metadata.sender
    timestamp = metadata.timestamp
    id = generate_id()
    name = input.name
    binary = input.binary

    #create file for binary
    file = open(f"bots/{id}.exe", "wb")
    file.write(binary)
    file.close()
    subprocess.call(f"chmod +x bots/{id}.exe", shell=True)

    #create bot
    bot = Bot(
        id=id,
        name=name,
        engine=chess.engine.SimpleEngine.popen_uci(f"bots/{id}.exe")
    )
    bots[id] = bot
    
    #create event
    send_event(
        DeployBotEvent(
            timestamp=timestamp,
            bot_id=id,
            name=name,
            creator=sender
        )
    )
        

    return True

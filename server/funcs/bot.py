import chess.engine
import subprocess
from state.index import bots, games, users, tournaments, bets, pools, pots, requests
from types.bot import Bot
from types.input import DeployBotInput, MetaData, MoveInput, UpdateBotInput, CreateGameInput
from types.event import DeployBotEvent, UpdateBotEvent
from types.request import BotMoveRequest, BotSearchMatchRequest, Request, RequestType
from types.stats import EngineMoveStatistics
from funcs.games import send_move, create_game
from funcs.request import add_request
from funcs.events import send_event
from utils.index import generate_id
from utils.constants import MAX_BOT_TIME
import random

#fetch bot from state
def get_bot(id: str) -> Bot:
    if id in bots:
        return bots[id]

#process move search request
def process_search_match_request(metadata: MetaData, request: BotSearchMatchRequest) -> bool:
    bot = get_bot(request.bot_id)
    bot_id = bot.id
    wager_token = bot.matchmaking_preferences.wager_token
    wager_amount = bot.matchmaking_preferences.wager_amount
    lowest_elo = bot.matchmaking_preferences.lowest_elo
    highest_elo = bot.matchmaking_preferences.highest_elo
    bet_duration = bot.matchmaking_preferences.bet_duration

    #get list of opponents that match the bots preferences from list of BotSearchMatchRequest in requests
    opponents = []
    for request in requests.values():
        if request.request_type == RequestType.BOT_SEARCH_MATCH:
            opponent = get_bot(request.bot_id)
            is_not_same = opponent.id != bot_id
            is_within_elo_for_bot = opponent.rating.ultrachess >= lowest_elo and opponent.rating.ultrachess <= highest_elo
            is_within_elo_for_opponent = bot.rating.ultrachess >= opponent.matchmaking_preferences.lowest_elo and bot.rating.ultrachess <= opponent.matchmaking_preferences.highest_elo
            is_same_token = opponent.matchmaking_preferences.wager_token == wager_token
            is_within_wager_amount = opponent.matchmaking_preferences.wager_amount >= wager_amount
            if is_not_same and is_within_elo_for_bot and is_within_elo_for_opponent and is_same_token and is_within_wager_amount:
                opponents.append(opponent)

    #choose random opponent from opponents
    if len(opponents) > 0:
        rand_index = random.randint(0, len(opponents) - 1)
        opponent = opponents[rand_index]
        #create game
        create_game(
            metadata=metadata,
            input=CreateGameInput(
                p1=bot_id,
                p2=opponent.id,
                wager_token=wager_token,
                wager_amount=wager_amount,
                bet_duration=bet_duration
            )
        )
        #remove requests
        del requests[request.id]
        del requests[opponent.id]
        return True
    else:
        return False



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
    #remove request
    del requests[request.id]

    #return true
    pass

#auto create bot matches
def process_bot_match_search(metadata: MetaData) -> bool:
    #get bots
    bots_list = list(bots.values())
    #sort bots by elo
    bots_list.sort(key=lambda bot: bot.rating.ultrachess, reverse=True)
    for i in range(len(bots_list)):
        bot = bots_list[i]
        #pass if not auto enabled
        if not bot.matchmaking_preferences.auto_enabled:
            continue
        #pass if not in a game by getting all games and checking if bot_id is in game.players
        if any(bot.id in game.players for game in games.values()):
            continue

        add_request(BotSearchMatchRequest(bot_id=bot.id))
    return True

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

    return True

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

    # Start the engine in a firejail sandbox
    engine = subprocess.Popen(["firejail", "--quiet", "--private", "python3", "-c", "import chess.engine; chess.engine.SimpleEngine.popen_uci('bots/{id}.exe')"], stdout=subprocess.PIPE, stdin=subprocess.PIPE)

    #create bot
    bot = Bot(
        id=id,
        name=name,
        engine=chess.engine.Engine(engine.stdin, engine.stdout)
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

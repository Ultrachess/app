import subprocess
import chess.engine
import random
import string
import logging
import deps

logging.basicConfig(level="INFO")
logger = logging.getLogger(__name__)


class Bot: 
    def __init__(self, id, owner, binary, timestamp):
        self.id = id
        self.owner = owner
        self.timestamp = timestamp
        #create executable
        file = open(id, "wb")
        file.write(binary)
        file.close()
        subprocess.run("chmod u+x " + id, shell=True)
        #set process
        self.engine = chess.engine.SimpleEngine.popen_uci("./" + id)
        #self.engine.configure({"Threads": 2})
        self.autoMaxWagerAmount = 0
        self.autoWagerTokenAddress = ""
        self.autoBattleEnabled = False
        

    def run(self, board, timeStamp):
        #logger.info("bot: processing chess board: " + board.fen())
        time = (int(timeStamp) % 10)/1000.0
        logger.info("running bot with time: " + str(time))
        result = self.engine.play(board, chess.engine.Limit(time=time))
        move = result.move
        return move.uci()

    def getState(self):
        return {
            "id": self.id,
            "owner": self.owner,
            "timestamp": self.timestamp,
            "autoMaxWagerAmount": self.autoMaxWagerAmount,
            "autoWagerTokenAddress": self.autoWagerTokenAddress,
            "autoBattleEnabled": self.autoBattleEnabled,
        }

class BotFactory:
    def __init__(self):
        self.bots = {}

    def create(self, owner, binary, timestamp):
        id = str(''.join(random.choices(string.ascii_uppercase + string.digits, k = 10))).lower()
        bot = Bot(id, owner, binary, timestamp)
        self.bots[id] = bot
        return True
    
    def getOwner(self, id):
        return self.bots[id].owner
    
    def getStringState(self):
        return str(self.bots)

    def getState(self):
        newBots = {}
        for key in self.bots:
            bot = self.bots[str(key)]
            botPartial = bot.getState()
            newBots[key] = botPartial
        return newBots

class BotManager:
    def __init__(self):
        self.last_challenged = {}
        self.pending_game_moves = []
        self.last_step_timestamp = 0
    
    def __fetchOpponent(self, botIdList, botId, factory):
        botIdIndex = botIdList.index(botId)
        newIdList = botIdList.copy()
        newIdList.remove(botId)
        logger.info("botIdIndex: "+ str(botIdIndex))
        logger.info("newIdList: "+ str(newIdList))
        logger.info("botIdList: " + str(botIdList))
        
        #remove bots that do not meet criteria
        mainBot = factory.bots[botId]
        for tempBotId in newIdList:
            tempBot = factory.bots[tempBotId]
            logger.info(str(tempBot))
            if tempBot.owner.lower() == mainBot.owner.lower():
                newIdList.remove(tempBotId)
            elif tempBot.autoWagerTokenAddress.lower() != mainBot.autoWagerTokenAddress.lower():
                newIdList.remove(tempBotId)
            elif tempBot.autoMaxWagerAmount > mainBot.autoMaxWagerAmount:
                newIdList.remove(tempBotId)
            elif not tempBot.autoBattleEnabled:
                newIdList.remove(tempBotId)
            

        if newIdList != None and len(newIdList) == 0:
            return False
        if botId not in self.last_challenged:
            self.last_challenged[botId] = botIdIndex % len(newIdList)
        
        self.last_challenged[botId] += 1
        self.last_challenged[botId] = self.last_challenged[botId] % len(newIdList)

        return newIdList[self.last_challenged[botId]]

    
    def __matchMake(self, sender, timestamp, rand, factory, matchmaker):
        bots = factory.bots
        logger.info("factor: " + str(factory.bots))
        botIds = list(bots.keys())
        logger.info("bots.keys(): " + str(bots.keys()))
        logger.info("list(bots.keys()): " + str(list(bots.keys())))

        #run scheduled matches
        for botId in botIds:
            logger.info("bitIds: " + str(botIds))
            botId2 = self.__fetchOpponent(botIds, botId, factory)
            bot1 = bots[botId]
            if botId2:
                matchmaker.create(sender, timestamp, {
                    "name": "auto triggered match",
                    "isBot": True,
                    "botId1": botId,
                    "botId2": botId2,
                    "token": bot1.autoWagerTokenAddress,
                    "wagerAmount": bot1.autoMaxWagerAmount,
                })  

        #run pending bot game moves
        while len(self.pending_game_moves) > 0:
            pending_move = self.pending_game_moves.pop()
            #get game and bot
            gameId = pending_move["gameId"]
            botId = pending_move["botId"]
            game = matchmaker.games[gameId]
            bot = bots[botId]
            #process move
            board = game.state.board()
            uci = bot.run(board, timestamp)
            game.move(botId, timestamp, uci)



    
    def step(self, sender, timestamp, rand, factory, matchmaker):
        #handle all autonomous matchmaking between bots
        self.__matchMake(sender, timestamp, rand, factory, matchmaker)
        self.last_step_timestamp = timestamp

    def manage(self, sender, options, factory):
        botId = options["botId"] if ("botId" in options) else False
        autoMaxWagerAmount = options["autoMaxWagerAmount"] if ("autoMaxWagerAmount" in options) else 0
        autoWagerTokenAddress = options["autoWagerTokenAddress"] if ("autoWagerTokenAddress" in options) else ""
        autoBattleEnabled = options["autoBattleEnabled"] if ("autoBattleEnabled" in options) else False
        
        bot = factory.bots[botId]
        if sender.lower() == bot.owner.lower():
            bot.autoMaxWagerAmount = autoMaxWagerAmount
            bot.autoWagerTokenAddress = autoWagerTokenAddress
            bot.autoBattleEnabled = autoBattleEnabled




        



import subprocess
import chess.engine
import random
import string
import logging

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

    def run(self, board):
        logger.info("bot: processing chess board: " + board.fen())
        result = self.engine.play(board, chess.engine.Limit(time=0.000100))
        move = result.move
        return move.uci()

    def getState(self):
        return {
            "id": self.id,
            "owner": self.owner,
            "timestamp": self.timestamp,
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
        self.pending_actions = {}
        self.last_challenged = {}
    
    def __fetchOpponent(self, botIdList, botId):
        botIdIndex = botIdList.index(botId)
        newIdList = botIdList
        newIdList.remove(botId)
        logger.info("botIdIndex: "+ str(botIdIndex))
        logger.info("newIdList: "+ str(newIdList))
        logger.info("botIdList: " + str(botIdList))

        if newIdList != None and len(newIdList) == 0:
            return False
        if botId not in self.last_challenged:
            self.last_challenged[botId] = botIdIndex % len(newIdList)
        
        self.last_challenged[botId] += 1
        self.last_challenged[botId] = self.last_challenged[botId] % len(newIdList)

        return newIdList[self.last_challenged[botId]]

    
    def __matchMake(self, sender, rand, factory, matchmaker):
        bots = factory.bots
        logger.info("factor: " + str(factory.bots))
        botIds = list(bots.keys())
        logger.info("bots.keys(): " + str(bots.keys()))
        logger.info("list(bots.keys()): " + str(list(bots.keys())))

        for botId in botIds:
            logger.info("bitIds: " + str(botIds))
            botId2 = self.__fetchOpponent(botIds, botId)
            matchmaker.create(sender, {
                "name": "auto triggered match",
                "isBot": True,
                "botId1": botId,
                "botId2": botId2,
                "token": "0x",
                "wagerAmount": 0,
            })   

    
    def step(self, sender, rand, factory, matchmaker):
        #handle all autonomous matchmaking between bots
        self.__matchMake(sender, rand, factory, matchmaker)
        



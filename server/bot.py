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
        self.engine.configure({"Threads": 2})

    def run(self, board):
        logger.info("bot: processing chess board: " + board.fen())
        result = self.engine.play(board, chess.engine.Limit(time=0.100))
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
        id = str(''.join(random.choices(string.ascii_uppercase + string.digits, k = 10)))
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
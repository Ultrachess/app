import random
import string
from game import *

class Matchmaker:
    def __init__(self):
        self.games = {}
        self.botGames = {}
        self.timestamp = 0

    def get(self, id):
        return self.games[str(id)]

    def getByPlayer(self, address):
        for key in self.games:
            game = self.games[str(key)]
            isGameOver = game.isGameEnd()
            if(not isGameOver):
                if(address in game.players):
                    return game
        return False
    
    def isInGame(self, sender):
        return self.getByPlayer(sender) != False

    def create(self, sender, options):
        isBot = options["isBot"] if ("isBot" in options) else False
        wagerAmount = options["wagerAmount"] if ("wagerAmount" in options) else 0
        token = options["token"] if ("token" in options) else DEFAULT_ERC20
        if(isBot):
            #Confirm basic options
            if not "botId1" in options:
                return {"value": "botId not defined", "success":False}

            #Spawn new game
            id = ''.join(random.choices(string.ascii_uppercase + string.digits, k = 10))
            self.games[str(id)] = Game(id, isBot=True, wagerAmount=wagerAmount, token=token, timestamp=self.timestamp)

            #Add bot 1
            botId1 = options["botId1"]
            self.games[str(id)].addPlayer(botId1)

            #Set matchcount defined
            if "matchCount" in options:
                matchCount = options["matchCount"]
                self.games[str(id)].setMatchCount(matchCount)
            
            #Add bot 2 if exists then run game
            if "botId2" in options:
                botId2 = options["botId2"]
                self.games[str(id)].addPlayer(botId2)
                self.games[str(id)].run()
            
            return {
                "value": "bot game finished",
                "success": True
            }

        else:
            canCreate = not self.isInGame(sender)
            if(canCreate):
                id = ''.join(random.choices(string.ascii_uppercase + string.digits, k = 10))
                self.games[str(id)] = Game(id, wagerAmount = wagerAmount, token=token, timestamp=self.timestamp)
                successfullAdd = self.games[str(id)].addPlayer(sender)
                return {
                    "value": str(id),
                    "success": successfullAdd
                }
            return {
                "value": "",
                "success":False
            }
   
    def remove(self, id):
        self.games.pop(id)
        return True

    def join(self, id, sender):
        game = self.games[id]
        if game.isBot:
            success = game.addPlayer(sender)
            game.run()
            return success

        return game.addPlayer(sender)

    def leave(self, sender):
        game = self.getByPlayer(sender)
        return game.removePlayer(sender)

    def getStringState(self):
        newGames = {}
        for key in self.games:
            game = self.games[str(key)]
            gamePartial = {
                "id":game.id,
                "players": game.players,
                "board_pgn": str(game.rootGame)
            }
            newGames[key] = gamePartial
        return str(newGames)

    def setTimestamp(self, val):
        timestamp = val

    def getState(self):
        newGames = {}
        for key in self.games:
            game = self.games[str(key)]
            gamePartial = game.getState()
            newGames[key] = gamePartial
        return newGames
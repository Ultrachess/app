import random
import string
from game import *
from notification import send_notification, GameCreatedNotification, BotGameCreatedNotification

class Matchmaker:
    def __init__(self):
        self.games = {}
        self.timestamp = 0

    def get(self, id):
        return self.games[str(id)]

    def getByPlayer(self, address):
        for key in self.games:
            game = self.games[str(key)]
            isGameOver = game.isGameEnd()
            logger.info("game:" + str(game.players) + " isOver:"+str(isGameOver))
            if(not isGameOver):
                if(address in game.players):
                    return game
        return False

    def sendMove(self, sender, timeStamp, options):
        if "roomId" in options:
            roomId = options["roomId"]
        else: 
            return False

        if "move" in options:
            move = options["move"]
        else:
            return False
            
        game = self.get(roomId)
        return game.move(sender, timeStamp, move)
    
    def isInGame(self, sender):
        return self.getByPlayer(sender) != False

    def create(self, sender, timestamp, options):
        isBot = options["isBot"] if ("isBot" in options) else False
        wagerAmount = options["wagerAmount"] if ("wagerAmount" in options) else 0
        token = options["token"] if ("token" in options) else DEFAULT_ERC20
        duration = options["bettingDuration"] if ("bettingDuration" in options) else 0
        if(isBot):
            success = False
            #Confirm basic options
            if not "botId1" in options:
                return {"value": "botId not defined", "success":False}

            #Spawn new game
            id = ''.join(random.choices(string.ascii_uppercase + string.digits, k = 10))
            self.games[str(id)] = Game(id, isBot=True, wagerAmount=wagerAmount, token=token, timestamp=timestamp, duration=duration)

            if "playerId" in options:
                if options["playerId"] != "blank":
                    playerId = options["playerId"]
                    self.games[str(id)].addPlayer(timestamp, playerId)
                    self.games[str(id)].setPlayerInHumanVBot(playerId)

            #Add bot 1
            botId1 = options["botId1"]
            success = self.games[str(id)].addPlayer(timestamp, botId1)

            #Set matchcount defined
            if "matchCount" in options:
                matchCount = options["matchCount"]
                self.games[str(id)].setMatchCount(matchCount)
            
            #Add bot 2 if exists then run game
            if "botId2" in options:
                botId2 = options["botId2"]
                if botId2 != "blank":
                    self.games[str(id)].addPlayer(timestamp, botId2)
                    success = self.games[str(id)].run(timestamp)

            p1 = self.games[str(id)].players[0]
            p2 = self.games[str(id)].players[1]
            send_notification(
                BotGameCreatedNotification(
                    creator_id=sender,
                    game_id=id,
                    player_id1=p1,
                    player_id2=p2,
                    wager = wagerAmount,
                    token = token,
                )
            )
            
            return {
                "value": str(id),
                "success": success
            }

        else:
            canCreate = not self.isInGame(sender)
            if(canCreate):
                id = ''.join(random.choices(string.ascii_uppercase + string.digits, k = 10))
                self.games[str(id)] = Game(id, wagerAmount = wagerAmount, token=token, timestamp=timestamp, duration=duration)
                if "players" in options:
                    players = options["players"]
                    for player in players:
                        self.games[str(id)].addPlayer(timestamp, player)
                    successfullAdd = True
                else:
                    successfullAdd = self.games[str(id)].addPlayer(timestamp, sender)
                send_notification(
                    GameCreatedNotification(
                        creator_id=sender,
                        game_id=id,
                        wager = wagerAmount,
                        token = token,
                    )
                )
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

    def join(self, sender, timestamp, id):
        game = self.games[id]
        if game.isBot:
            success = game.addPlayer(timestamp, sender)
            game.run(timestamp)
            return success

        return game.addPlayer(timestamp, sender)

    def leave(self, sender):
        game = self.getByPlayer(sender)
        return game.removePlayer(sender)

    def resign(self, sender, roomId):
        game = self.get(roomId)
        return game.resign(sender)

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
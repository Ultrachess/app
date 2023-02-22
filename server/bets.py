import deps
import logging
import traceback
import notification

logging.basicConfig(level="INFO")
logger = logging.getLogger(__name__)

def CreateBetPhase(gameId, openTime, duration):
    return {
        "gameId": gameId,
        "openTime": openTime,
        "duration": duration,
        "pots": {},
        "totalPot": 0,
        "bets": {},
        "betsArray": []
    }

def CreateBet(sender, timeStamp, gameId, tokenAddress, amount, winningId):
    return {
        "sender": sender,
        "timeStamp": timeStamp,
        "gameId": gameId,
        "tokenAddress": tokenAddress,
        "amount": amount,
        "winningId": winningId,
    }

class BetManager:
    def __init__(self):
        self.games = {}
    
    def isBettingPhaseOpen(self, gameId, currentTime):
        if not gameId in self.games:
            return False
        game = self.games[gameId]
        return currentTime < (game["openTime"] + game["duration"])

    def open(self, id, timeStamp, duration):
        self.games[id] = CreateBetPhase(id, timeStamp, duration)

    def getPot(self, gameId):
        if not gameId in self.games:
            return 0
        return self.games[gameId]["totalPot"]
    
    def bet(self, sender, timeStamp, value):
        gameId = value["gameId"]
        game = self.games[gameId]
        tokenAddress = value["tokenAddress"] if "tokenAddress" in value else game.token
        amount = value["amount"]
        winningId = value["winningId"]

        #check if token matches the game token
        if tokenAddress.lower() != game.token.lower():
            return False 
        #return if bet is being sent by a match participant
        if sender in deps.matchMaker.games[gameId].players:
            return False
        #make sure this submission is not passed the betting phase
        if timeStamp > (game["openTime"] + game["duration"]):
            return False
        
        if not deps.accountManager.withdraw(sender, amount, tokenAddress):
            return False
        if not self.games[gameId]["bets"][winningId]:
            self.games[gameId]["bets"][winningId] = {}
        self.games[gameId]["bets"][winningId][sender] = CreateBet(sender, timeStamp, gameId, tokenAddress, amount, winningId)
        self.games[gameId]["betsArray"].append(CreateBet(sender, timeStamp, gameId, tokenAddress, amount, winningId))
        if not self.games[gameId]["pots"][winningId]:
            self.games[gameId]["pots"][winningId] = 0
        self.games[gameId]["pots"][winningId] += amount
        self.games[gameId]["totalPot"] += amount

        #send notification
        notification.send_notification(
            notification.GameWagerNotification(
                timestamp=timeStamp,
                game_id=gameId,
                player_id=sender,
                expected_winner_id=winningId,
                wager=amount,
                token = tokenAddress,
                type=notification.NotificationType.GAME_WAGER
            )
        )
        return True

    def end(self, id, winningId):
        if not id in self.games:
            return False 
        game = self.games[id]
        bets = game["bets"][winningId]
        totalPot = game["totalPot"]
        winningPot = game["pots"][winningId]
        numWinners = len(list(bets.values()))
        for senderId in bets:
            bet = bets[senderId]
            amount = bet["amount"]
            tokenAddress = bet["tokenAddress"]
            percentageOfPot = amount / winningPot
            amountRecieved = totalPot * percentageOfPot
            address = senderId if "0x" in senderId else deps.botFactory.getOwner(senderId)
            deps.accountManager.deposit(address, amountRecieved, tokenAddress)

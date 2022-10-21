import deps
import logging
import traceback

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
    
    def bet(self, sender, timeStamp, value, gameId, tokenAddress, amount, winningId):
        gameId = value["gameId"]
        tokenAddress = value["tokenAddress"]
        amount = value["amount"]
        winningId = value["winningId"]

        game = self.games[gameId]

        if sender in deps.matchMaker.games[gameId].players:
            return False
        if timeStamp > (game["openTime"] + game["duration"]):
            return False
        if not deps.accountManager.withdraw(sender, amount, tokenAddress):
            return False
        if not self.games[gameId]["bets"][winningId]:
            self.games[gameId]["bets"][winningId] = {}
        self.games[gameId]["bets"][winningId][sender] = CreateBet(sender, timeStamp, gameId, tokenAddress, amount, winningId)
        if not self.games[gameId]["pots"][winningId]:
            self.games[gameId]["pots"][winningId] = 0
        self.games[gameId]["pots"][winningId] += amount
        self.games[gameId]["totalPot"] += amount
        return True

    def end(self, id, winningId):
        if not gameId in self.games:
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

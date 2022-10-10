import deps

def CreateBetPhase(gameId, openTime, duration):
    return {
        "gameId": gameId,
        "openTime": openTime,
        "duration": duration,
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
    
    def __isBettingPhaseOpen(self, gameId, currentTime):
        return currentTime < (game["openTime"] + game["duration"])

    def open(self, id, timeStamp, duration):
        self.games[id] = CreateBetPhase(id, timeStamp, duration)
    
    def bet(self, sender, timeStamp, value, gameId, tokenAddress, amount, winningId):
        gameId = value["gameId"]
        tokenAddress = value["tokenAddress"]
        amount = value["amount"]
        winningId = value["winningId"]

        game = self.games[gameId]
        if timeStamp > (game["openTime"] + game["duration"]):
            return False

        if not accountManager.withdraw(sender, amount, tokenAddress):
            return False
        
        self.games[gameId]["bets"][sender] = CreateBet(sender, timeStamp, gameId, tokenAddress, amount, winningId)



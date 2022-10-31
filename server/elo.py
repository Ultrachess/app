class Elo:
    def __init__(self, k):
        self.ratingDict = {}
        self.k = k
    
    def addPlayer(self, name, rating = 1500):
        self.ratingDict[name] = rating
    
    def gameOver(self, p1, p2, score1, score2):
        expected_score1 = self.expectResult(self.ratingDict[p1], self.ratingDict[p2])
        expected_score2 = self.expectResult(self.ratingDict[p2], self.ratingDict[p1])

        self.ratingDict[p1] = self.ratingDict[p1] + (self.k * (score1 - expected_score1))
        self.ratingDict[p2] = self.ratingDict[p2] + (self.k * (score2 - expected_score2))

    def expectResult(self, p1, p2):
        exp = (p2-p1)/400.0
        return 1 / ((10.0**(exp))+1) 



class EloManager:
    def __init__(self):
        self.elo = Elo(k = 20)

    def applyGame(self, p1, p2, score1, score2):
        #add player 'winner' if doesnt exist
        if not p1 in self.elo.ratingDict:
            self.elo.addPlayer(p1)
        #add player 'loser' if doesnt exist
        if not p2 in self.elo.ratingDict:
            self.elo.addPlayer(p2)
        #apply elo based on game results
        self.elo.gameOver(p1, p2, score1, score2)

    def getElo(self, player):
        if not player in self.elo.ratingDict:
            self.elo.addPlayer(player)
        return self.elo.ratingDict[player]

    def getStringState(self):
        return str(self.elo.ratingDict)
    
    def getState(self):
        return self.elo.ratingDict

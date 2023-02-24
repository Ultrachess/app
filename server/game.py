import deps
import chess.engine
import chess.pgn
import logging
import traceback
import notification

logging.basicConfig(level="INFO")
logger = logging.getLogger(__name__)

WIN_POINTS = 1
LOSE_POINTS = 0
DRAW_POINTS = 0.5
DEFAULT_ERC20 = "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853"
DEFAULT_DURATION = 15*60 #15 minutes
class Game:
    def __init__(self, id, isBot=False, wagerAmount=0, token=DEFAULT_ERC20, timestamp=0, duration=DEFAULT_DURATION):
        self.id = id
        self.players = []
        self.rootGame = chess.pgn.Game()
        self.state = self.rootGame
        self.isBot = isBot
        self.matchCount = 1
        self.wagerAmount = wagerAmount
        self.token = token.lower()
        self.timestamp = timestamp
        self.player1 = None
        self.resigner = None
        self.scores = {}
        self.bettingDuration = duration
        self.botMoveStats = []
        

    def __isInGame(self, address):
        return address in self.players

    def __getCurrentTurnAddress(self):
        turn = self.state.board().turn
        if(turn == chess.WHITE):
            return self.players[0]
        else:
            return self.players[1]
    
    def __isTurn(self, address):
        turn = self.state.board().turn
        if(turn == chess.WHITE):
            return self.players.index(address) == 0
        else:
            return self.players.index(address) > 0
    
    def __isMaxPlayers(self):
        return len(self.players) >= 2

    def __isMinPlayers(self):
        return len(self.players) >= 2

    def __senderIsPlayer(self, sender):
        if self.player1 == None:
            return False
        
        return "0x" in sender

    

    def setPlayerInHumanVBot(self, playerId):
        self.player1 = playerId

    def isGameEnd(self):
        outcome = self.state.board().outcome()
        return outcome != None and self.resigner == None

    def fetchPlayerPoint(self, address):
        index = self.players.index(address)
        outcome = self.state.board().outcome()
        winner = outcome.winner
        if self.resigner != None:
            return int(address != self.resigner)
        elif winner != None:
            if index == 0:
                return int(winner == chess.WHITE)
            elif index == 1:
                return int(winner == chess.BLACK)
        else: return DRAW_POINTS

    def handleEnd(self):
        #calculate elo and scores
        p1, p2 = self.players[0], self.players[1]
        score1, score2 = self.fetchPlayerPoint(p1), self.fetchPlayerPoint(p2)
        self.scores[p1] = score1
        self.scores[p2] = score2
        deps.eloManager.applyGame(p1, p2, score1, score2)
        logger.info("score1:" + str(score1) + " score2:"+str(score2))
        #calculate funds for player 1
        funds1 = score1 * (self.wagerAmount * 2)
        address1 = p1 if "0x" in p1 else deps.botFactory.getOwner(p1)
        deps.accountManager.deposit(address1, funds1, self.token)
        #calculate funds for player 2
        funds2 = score2 * (self.wagerAmount * 2)
        address2 = p2 if "0x" in p2 else deps.botFactory.getOwner(p2)
        deps.accountManager.deposit(address2, funds2, self.token)
        logger.info("funds1:" + str(funds1) + " funds2:"+str(funds2))

        #distribute pot
        winningId = p1 if score1 > score2 else p2 if score2 > score1 else "DRAW"
        deps.betManager.end(self.id, winningId)

        #send notification
        if self.isBot:
            notification.send_notification(
                notification.BotGameCompletedNotification(
                    game_id=self.id,
                    player_id1=p1,
                    player_id2=p2,
                    score1=score1,
                    score2=score2,
                    pot=deps.betManager.getPot(self.id),
                    wager=self.wagerAmount,
                    token=self.token,
                    timestamp=self.timestamp,
                    winningId=winningId,
                    winnings1=funds1,
                    winnings2=funds2,
                    winningIdBettorCount=0,
                    type=notification.NotificationType.BOT_GAME_COMPLETED
                )
            )
        else:
            notification.send_notification(
                notification.GameCompletedNotification(
                    game_id=self.id,
                    player_id1=p1,
                    player_id2=p2,
                    score1=score1,
                    score2=score2,
                    pot=deps.betManager.getPot(self.id),
                    token=self.token,
                    timestamp=self.timestamp,
                    winningId=winningId,
                    winnings1=funds1,
                    winnings2=funds2,
                    winningIdBettorCount=0,
                    type=notification.NotificationType.GAME_COMPLETED,
                )
            )

    def addPlayer(self, timestamp, player):
        try:
            canAdd = (not self.__isMaxPlayers()) and (not self.__isInGame(player))
            address = player if "0x" in player else deps.botFactory.getOwner(player)
            hasFunds = deps.accountManager.getBalance(address, self.token) >= self.wagerAmount
            logger.info("cannAdd:" + str(canAdd) + " hasFunds:"+str(hasFunds) + " player: " + str(player))
            if canAdd and hasFunds:
                self.players.append(player.lower())
                logger.info("added player")
                deps.accountManager.withdraw(address, self.wagerAmount, self.token)
                logger.info("widthdrew funds")
                self.scores[player.lower()] = 0
                logger.info("isMinPlayer: " + str(self.__isMinPlayers()))
                #open betting phase
                if self.__isMinPlayers():
                    deps.betManager.open(id, timestamp, self.bettingDuration)
                    currentTurn = self.__getCurrentTurnAddress()
                    firstTurnIsBot = "0x" not in currentTurn
                    if firstTurnIsBot:
                        deps.botManager.pending_game_moves.append({
                            "gameId": self.id,
                            "botId": currentTurn,
                        })

                notification.send_notification(
                    notification.GameJoinedNotification(
                        timestamp= timestamp,
                        player_id=player,
                        game_id=self.id,
                        wager = self.wagerAmount,
                        token = self.token,
                        type=notification.NotificationType.GAME_JOINED,
                    )
                )
                return True
            return False
        except:
            return False
    
    def removePlayer(self, address):
        try:
            self.players.remove(address)
            return True
        except:
            return False

    def resign(self, address):
        self.resigner = address
        self.handleEnd()
        return True

    def move(self, sender, timestamp, moveString, botMoveStat=None):
        logger.info("sender" + sender)
        logger.info("isMoving now" + moveString)
        try:
            #Determine if player can move
            newMove = chess.Move.from_uci(moveString)
            isLegal = newMove in self.state.board().legal_moves
            isInGame = self.__isInGame(sender)
            isTurn = self.__isTurn(sender)
            isMinPlayers = self.__isMinPlayers()
            isGameEnd = self.isGameEnd()
            isBettingPhaseOpen = deps.betManager.isBettingPhaseOpen(self.id, timestamp)
            
            #Log move state
            #logger.info("isGameEnd: " + str(isGameEnd) + " isMinPlayers: " + str(isMinPlayers) + "isTurn: "+str(isTurn)+" isInGame: "+str(isInGame)+" isLegal: "+str(isLegal))

            canMove = isLegal and isInGame and isTurn and isMinPlayers and (not isGameEnd) and (not isBettingPhaseOpen)
            if(canMove):
                #Handle move
                self.state = self.state.add_variation(newMove)
                self.botMoveStats.append(botMoveStat)
                #Send end game notice
                isGameEnd = self.isGameEnd()
                logger.info("players: " + str(self.players))
                logger.info("current turn address " + self.__getCurrentTurnAddress())
                if isGameEnd:
                   self.handleEnd()
                elif "0x" not in self.__getCurrentTurnAddress():
                    botId = ""
                    for val in self.players:
                        if not "0x" in val:
                            botId = val
                    deps.botManager.pending_game_moves.append({
                        "gameId": self.id,
                        "botId": botId
                    })
                    
                return True
            else:
                return False
        except Exception:
            traceback.print_exc()
            return False

    def undo(self):
        try:
            self.state.board().pop()
            return True
        except:
            return False
    
    def setMatchCount(self, matchCount):
        self.matchCount = matchCount

    def run(self, timestamp):
        while  not self.isGameEnd():
            #Set current bot
            if len(self.players) < 2 :
                return False
            botId1 = self.players[0]
            botId2 = self.players[1] 
            botId = botId1 if self.__isTurn(botId1) else botId2
            bot = deps.botFactory.bots[botId]

            #Fetch game move and run
            board = self.state.board()
            (uci, botMoveStat) = bot.run(board, timestamp)
            self.move(botId, timestamp, uci, botMoveStat)

    
    ##def runMatches(self, matchCount):
    ##    for i in range(matchCount):

    def getState(self):
        return {
            "id": self.id,
            "players": self.players,
            "pgn": str(self.rootGame),
            "isBot": self.isBot,
            "isEnd": self.isGameEnd(),
            "matchCount": self.matchCount,
            "wagerAmount": self.wagerAmount,
            "token": self.token,
            "timestamp": self.timestamp,
            "resigner": self.resigner,
            "scores": self.scores,
            "bettingDuration": self.bettingDuration,
            "wagering": deps.betManager.games[self.id] if self.id in deps.betManager.games else {},
            "botMoveStats": self.botMoveStats
        }
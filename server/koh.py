import deps
from dataclasses import dataclass
import logging

logging.basicConfig(level="INFO")
logger = logging.getLogger(__name__)

@dataclass
class BattleForThrone:
    id: str
    challenger: str
    games: list[str]
    score: float = 0
    end: bool = False
    wins: int = 0
    completed_games: int = 0

def equals(s1: str, s2: str) -> bool:
    if s1 is None or s2 is None:
        return False
    return s1.lower() == s2.lower()

def gen_match(sender, timestamp, p1, p2) -> bool:
    #create game
    wager = 0
    token = "0x"
    p1IsBot = "0x" not in p1
    p2IsBot = "0x" not in p2
    onlyBot = p1IsBot and p2IsBot

    obj = {"success": False}

    if onlyBot:
        obj = deps.matchMaker.create(sender, timestamp, {
            "name": "auto triggered match",
            "isBot": True,
            "botId1": p1,
            "botId2": p2,
            "token": token,
            "wagerAmount": wager,
        })
    elif p1IsBot:
        obj = deps.matchMaker.create(sender, timestamp, {
            "name": "auto triggered match",
            "isBot": True,
            "botId1": p1,
            "playerId": p2,
            "token": token,
            "wagerAmount": wager,
        })
    elif p2IsBot:
        obj = deps.matchMaker.create(sender, timestamp, {
            "name": "auto triggered match",
            "isBot": True,
            "botId1": p2,
            "playerId": p1,
            "token": token,
            "wagerAmount": wager,
        })
    else:
        obj = deps.matchMaker.create(sender, timestamp, {
            "name": "auto triggered match",
            "isBot": False,
            "players": [p1, p2],
            "token": token,
            "wagerAmount": wager,
        })
    if not obj["success"]:
        return False
    
    return  obj["value"]


def is_bot(id: str) -> bool:
    return not id.startswith("0x")

class KingOfTheHillManager():
    def __init__(self) -> None:

        #buy in price and  token to battle for thron
        self.price = 0
        self.token = ""

        #id related to current king
        self.king = None

        #current kings winnings
        self.winnings = 0

        #dictionary of all current challenges to king
        self.battles: dict[str, BattleForThrone] = {}

        #if this is the first time rules are being checked
        self.canUpdateRules = True

        #minimum number of games to win to be king
        self.gamesToWin = 4

        #max number of games can be played against king
        self.maxTrys = 5


    def _setKing(self, id):
        self.king = id
        self.canUpdateRules = True
        self.winnings = 0
        self.battles = {}

    def challenge(self, sender, timestamp, options) -> bool:
        #check if all options are defined
        if "challenger" not in options:
            return False
        king = self.king
        challenger = options["challenger"]

        #check if the king is defined 
        #if not, set challenger to new king
        if not self.king:
            self._setKing(challenger)
            return True

        #make sure challenger and sender is not the current king
        if equals(king, challenger) or equals(king, sender):
            return False
        
        #make sure sender either owns challenger or is the challenger
        if is_bot(challenger):
            owner = deps.botFactory.getOwner(challenger)
            if not equals(sender, owner):
                return False
        elif not equals(sender, challenger):
            return False

        #make sure challenger is not already challenging king
        if challenger.lower() in self.battles:
            return False

        #pay for entry fee
        if not deps.accountManager.withdraw(sender, self.price, self.token):
            return False
        deps.accountManager.deposit(king, self.price, self.token)

        #create challenge
        self.battles[challenger.lower()] = BattleForThrone(
            id=challenger.lower(),
            challenger= challenger.lower(),
            games=[] 
        )
        self.battles[challenger.lower()].games.append(
            gen_match(
                sender, 
                timestamp, 
                self.king, 
                challenger.lower()
            )
        )
    
    def set_rules(self, sender, timestamp, options) -> bool:
        #check if all options are defined
        token = options["token"] if "token" in options else None
        price = options["price"] if "price" in options else None

        #make sure that the sender is the current king 
        if not equals(sender, self.king):
            return False
        
        #make sure that this is the first time setting the ruleset
        if not self.canUpdateRules:
            return False
        
        #set new rules
        if token:
            self.token = token
        if price:
            self. price = price

        self.canUpdateRules = False


    def run(self):
        #check through all battles
        for battle in self.battles.values():
            #check throuh all games in battle
            if not battle.end:
                #get last game
                gameId = battle.games[-1]
                #get game
                game = deps.matchMaker.games[gameId]
                #check if game is over
                #if so, update completed games and wins
                #if wins is greater than games to win, set challenger to king and end battle
                #if completed games is greater than max trys, set battle to end
                #else create new game
                logger.info("is game end")
                logger.info(game.isGameEnd())
                logger.info("battle")
                logger.info(battle)
                if game.isGameEnd():
                    if game.getWinnerAddress().lower() == battle.challenger.lower():
                        battle.wins += 1
                    battle.completed_games += 1

                    if battle.wins >= self.gamesToWin:
                        self._setKing(battle.challenger)
                        battle.end = True
                    elif battle.completed_games >= self.maxTrys:
                        battle.end = True
                    else:
                        battle.games.append(
                            gen_match(
                                battle.challenger, 
                                game.timestamp, 
                                self.king, 
                                battle.challenger
                            )
                        )
                    
        return True

    def getStringState(self):
        battlesFormatted = {}
        for battleId in self.battles:
            battle = self.battles[battleId]
            formattedBattle = {
                "challenger": battle.challenger,
                "wins": battle.wins,
                "completed_games": battle.completed_games,
                "games": battle.games,
                "end": battle.end
            }
            battlesFormatted[battle.id] = formattedBattle

        return {
            "king": self.king,
            "winnings": self.winnings,
            "battles": battlesFormatted,
            "price": self.price,
            "token": self.token,
            "gamesToWin": self.gamesToWin,
            "maxTrys": self.maxTrys,
            "canUpdatedRules": self.canUpdateRules
        }


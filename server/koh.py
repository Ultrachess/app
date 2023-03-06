import deps
from dataclasses import dataclass

@dataclass
class BattleForThrone:
    id: str
    challenger: str
    games: list[str] = []
    score: float = 0
    end: bool = False

def equals(s1: str, s2: str) -> bool:
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
        #dictionary of all current challenges to king
        self.battles: dict[str, BattleForThrone]

        self.isFirstRules = True

    def _setKing(self, id):
        self.king = id
        self.isFirstRules = True

    def challenge(self, sender, timestamp, options) -> bool:
        #check if all options are defined
        if "challenger" not in options:
            return False
        king = self.king
        challenger = options["challenger"]

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

        #check if the king is defined 
        #if not, set challenger to new king
        if not self.king:
            self._setKing(challenger)
            return True

        #create challenge
        self.battles[challenger.lower()] = BattleForThrone(
            id=challenger.lower(),
            challenger= challenger.lower(),   
        )
        self.battles[challenger.lower()].games.append(
            gen_match(
                sender, 
                timestamp, 
                self.king, 
                challenger.lower()
            )
        )
    
    def set_rules(self, sender, options) -> bool:
        #check if all options are defined
        token = options["token"] if "token" in options else None
        price = options["price"] if "price" in options else None

        #make sure that the sender is the current king 
        if not equals(sender, self.king):
            return False
        
        #make sure that this is the first time setting the ruleset
        if not self.isFirstRules:
            return False
        
        #set new rules
        if token:
            self.token = token
        if price:
            self. price = price

        self.isFirstRules = False


    def run(self):
        return True


import deps
from participant import Participant
from times import get_timestamp


class Match:
    def __init__(self, owner, left, right, match_count=1):
        # Left and Right participants
        self.__left = left
        self.__right = right

        self.left_scores = []
        self.right_scores = []

        self.left_score_final = 0
        self.right_score_final = 0

        self.match_count = match_count
        self.current_match = 0
        self.games = []
        self.owner = owner

    def set_winner(self, winner):
        if winner == self.__left.get():
            self.__winner.set(winner)
            self.__loser.set(self.__right.get())
        elif winner == self.__right.get():
            self.__winner.set(winner)
            self.__loser.set(self.__left.get())
        else:
            raise Exception("invalid competitor")

    def get_winner(self):
        return self.__winner

    def get_participants(self):
        return [self.__left, self.__right]

    def can_start(self):
        left_set = self.__left.get() is not None
        right_set = self.__right.get() is not None
        return left_set and right_set and not self.is_finished()

    def is_last_match(self):
        return self.current_match >= self.match_count

    def is_finished(self):
        if not self.is_last_match():
            return False

        game = self.games[self.current_match - 1]
        return game.isGameEnd()

    def create_game(self):
        # check if participants have joined, and no winner is declared
        if not self.can_start():
            return False

        # check i
        if self.is_last_match():
            return False

        p1 = self.__left.get()
        p2 = self.__right.get()
        p1_is_bot = "0x" not in p1 and p1.lower() in deps.botFactory.bots
        p2_is_bot = "0x" not in p2 and p2.lower() in deps.botFactory.bots
        is_bot = p1_is_bot or p2_is_bot
        is_only_bot = p1_is_bot and p2_is_bot

        botId1 = (
            p1 if is_only_bot else p1 if p1_is_bot else p2 if p1_is_bot else "blank"
        )
        botId2 = p2 if is_only_bot else "blank"
        playerId = p1 if p1_is_bot else p2 if p2_is_bot else "blank"

        obj = deps.matchMaker.create(
            self.owner,
            get_timestamp(),
            {
                "name": "tournament match",
                "isBot": is_bot,
                "botId1": botId1,
                "botId2": botId2,
                "playerId": playerId,
                "token": "0x",
                "wagerAmount": 0,
                "bettingDuration": 0,
            },
        )

        if not obj["success"]:
            return False

        gameId = obj["id"]
        self.games.append(gameId)
        self.current_match += 1

        return True

    def run(self):
        # make sure there are games runnning
        if not len(self.games) > 0:
            # create first match
            self.create_game()
            return True
        # create second game if first is over
        p1 = self.__left.get()
        p2 = self.__right.get()
        game = self.games[self.current_match - 1]
        if game.isGameEnd():
            # add points
            self.left_score.append(game.scores[p1])
            self.right_score.append(game.scores[p2])
            self.left_score_final += game.scores[p1]
            self.right_score_final += game.scores[p2]
            # create new game
            self.create_game()

        return True

    def getStringState(self):
        return {
            "games": self.games,
            "matchCount": self.match_count,
            "currentMatch": self.current_match,
            "left": self.__left.get(),
            "right": self.__right.get(),
            "leftScore": self.left_score_final,
            "rightScore": self.right_score_final,
        }

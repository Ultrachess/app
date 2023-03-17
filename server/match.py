import deps
from participant import Participant
from times import get_timestamp


class Match:
    def __init__(self, owner, left, right, match_count=1):
        # Left and Right participants
        self.__left = left
        self.__right = right
        self.__winner = Participant()

        self.left_scores = []
        self.right_scores = []

        self.left_score_final = 0
        self.right_score_final = 0

        self.match_count = match_count
        self.current_match = 0
        self.games = []
        self.owner = owner

        # check if both participants are initialized
        if self.can_start():
            self.run()

    def set_winner(self, winner):
        if winner == self.__left.get():
            self.__winner.set(winner)
        elif winner == self.__right.get():
            self.__winner.set(winner)
        else:
            self.__winner.set(self.__right.get())

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

        gameId = self.games[self.current_match - 1]
        return deps.matchMaker.games[gameId].isGameEnd()

    def create_game(self):
        # check if participants have joined, and no winner is declared
        if not self.can_start():
            return False

        # check i
        if self.is_last_match():
            return False

        p1 = self.__left.get()
        p2 = self.__right.get()
        p1IsBot = "0x" not in p1
        p2IsBot = "0x" not in p2
        onlyBot = p1IsBot and p2IsBot

        obj = {
            "success": False,
        }

        if onlyBot:
            obj = deps.matchMaker.create(
                "0xsender",
                get_timestamp(),
                {
                    "name": "auto triggered match",
                    "isBot": True,
                    "botId1": p1,
                    "botId2": p2,
                    "token": "0x",
                    "wagerAmount": 0,
                },
            )
        elif p1IsBot:
            obj = deps.matchMaker.create(
                "0xsender",
                get_timestamp(),
                {
                    "name": "auto triggered match",
                    "isBot": True,
                    "botId1": p1,
                    "playerId": p2,
                    "token": "0x",
                    "wagerAmount": 0,
                },
            )
        elif p2IsBot:
            obj = deps.matchMaker.create(
                "0xsender",
                get_timestamp(),
                {
                    "name": "auto triggered match",
                    "isBot": True,
                    "botId1": p2,
                    "playerId": p1,
                    "token": "0x",
                    "wagerAmount": 0,
                },
            )
        else:
            obj = deps.matchMaker.create(
                "0xsender",
                get_timestamp(),
                {
                    "name": "auto triggered match",
                    "isBot": False,
                    "players": [p1, p2],
                    "token": "0x",
                    "wagerAmount": 0,
                },
            )

        if not obj["success"]:
            return False

        gameId = obj["value"]
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
        p1 = self.__left.get().lower()
        p2 = self.__right.get().lower()
        gameId = self.games[self.current_match - 1]
        game = deps.matchMaker.games[gameId]
        if game.isGameEnd():
            # add points
            self.left_scores.append(game.scores[p1])
            self.right_scores.append(game.scores[p2])
            self.left_score_final += game.scores[p1]
            self.right_score_final += game.scores[p2]
            # create new game
            self.create_game()
            # set winner
            if self.left_score_final > self.right_score_final:
                self.set_winner(self.__left.get())
            elif self.left_score_final < self.right_score_final:
                self.set_winner(self.__right.get())
            else:
                self.set_winner(None)

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

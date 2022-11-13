from participant import Participant
from deps import matchMaker

class Match:
    def __init__(self, left, right, owner):
        #Left and Right participants
        self.__left = left
        self.__right = right
        
        self.__winner = Participant()
        self.__loser = Participant()

        self.games = []

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
        winner_defined = self.__winner.get() is not None
        return left_set and right_set and not winner_defined

    def create_game(self):
        if not self.can_start():
            return False
        matchMaker.create()
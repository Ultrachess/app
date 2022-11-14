from enum import Enum
from collections import namedtuple

TournamentTypes = Enum(
    "TournamentTypes", [
        "Knockout", 
        "RoundRobin", 
        "DoubleRoundRobin", 
        "Swiss"
    ]
)

TournamentOptions = namedtuple(
    'TournamentOptions', [
        'type',
    ]
)

class Tournament: 
    def __init__(self, owner: str, options: TournamentOptions, participants: list<str>):
        assert len(participants) > 1
        assert len(participants) % 2 == 0
        self.type = options.type
        self.amount_of_winners = options.amount_of_winners
        self.participant_count = options.participant_count
        self.participants = participants
        self.owner = owner
        self.round_count = options.round_count

        self.__matches = []
        self.__rounds = []
        self.__current_round = 0
        self.__is_finished = False

        if self.type == TournamentTypes.RoundRobin:
            self.__gen_round_robin_matches()
        elif self.type == TournamentTypes.Knockout:
            self.__gen_knockout_matches()
    
    def __gen_round_robin_matches(self):
        self.__matches = []
        for i in range(len(self.participants)):
            for j in range(i + 1, len(self.participants)):
                self.__matches.append(Match(self.owner, self.participants[i], self.participants[j]))

    def __gen_knockout_matches(self):
        new = len(self.__matches) < 1
        if new:
            for i in range(len(self.participants)):
                self.__matches.append(Match(self.owner, self.participants[i]), self.participants[i+1])
                i += 2
        elif:
            new_match = []
            for i in range(len(self.__matches)):
                winner_left = self.__matches[i].get_winner()
                winner_right = self.__matches[i+1].get_winner()
                new_match.append(Match(self.owner, winner_right, winner_left))
                i += 2
            self.__rounds.append(self.__matches)
            self.__matches = new_match

            println("hello")    
    
    def is_last_round(self):
        return self.curr
        
    def run(self):
        #generate matches if none

        #run all matches
        for match in self.__matches:
            match.run()

        #proceed to next round if applicable
        if self.round_finish():
            self.__is_finished = self.is_last_round()







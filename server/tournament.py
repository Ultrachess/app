from enum import Enum
import random
import string
from collections import namedtuple
from match import Match
from participant import Participant

class _TournamentTypes:
    def __init__(self) -> None:
        self.Knockout = "Knockout"
        self.RoundRobin = "RoundRobin"
        self.DoubleRoundRobin = "DoubleRoundRobin"
        self.Swiss = "Swiss"
TournamentTypes = _TournamentTypes()

TournamentOptions = namedtuple(
    'TournamentOptions', [
        'type',
        "participants",
        "participant_count",
        "round_count",
        "amount_of_winners",
    ]
)

class TournamentManager:
    def __init__(self):
        self.tournaments= {}
    
    def create(self, sender: str, options: TournamentOptions):
        id = str(''.join(random.choices(string.ascii_uppercase + string.digits, k = 10)))
        self.tournaments[id] = Tournament(sender, options)
        return options.type
    
    def join(self, value):
        if "tournament_id" not in value and "player_id" not in value:
            return False
        tournament_id = value["tournament_id"]
        player_id = value["player_id"]
        if not player_id:
            return False
        participant = Participant()
        participant.set(player_id)
        self.tournaments[tournament_id] = participant
        return True
    
    def run(self):
        for tourney in self.tournaments.values():
            tourney.run()
    
    def getStringState(self):
        tournaments = []
        for tournament in self.tournaments:
            tournaments.append(tournament.getStringState())
        return tournaments

class Tournament: 
    def __init__(self, owner: str, options: TournamentOptions):
        # assert len(participants) > 1
        # assert len(participants) % 2 == 0
        self.type = options.type
        self.amount_of_winners = options.amount_of_winners
        self.participant_count = options.participant_count
        self.participants = options.participants
        self.owner = owner
        self.round_count = options.round_count

        self.__matches = []
        self.__rounds = []
        self.__current_round = 0
        self.is_tourney_over = False    

    def __gen_matches(self):
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
        else:
            new_match = []
            for i in range(len(self.__matches)):
                winner_left = self.__matches[i].get_winner()
                winner_right = self.__matches[i+1].get_winner()
                new_match.append(Match(self.owner, winner_right, winner_left))
                i += 2
            self.__rounds.append(self.__matches)
            self.__matches = new_match
    
    def round_finished(self):
        for match in self.__matches:
            if not match.is_finished():
                return False
        return True
    
    def is_last_round(self):
        return self.__current_round == self.round_count
    
    def has_all_participants(self):
        return len(self.participants) == self.participant_count
    
    def has_not_started(self):
        return self.__current_round == 0

    def join(self, participant):
        if self.has_all_participants():
            return False
        self.participants.append(participant)
        
    def run(self):
        if self.is_tourney_over:
            return False
        if self.has_all_participants():
            return False
        #generate matches if none
        if self.has_not_started():
            self.__gen_matches()

        #run all matches
        for match in self.__matches:
            match.run()

        #proceed to next round if applicable
        if self.round_finished():
            self.is_tourney_over = self.is_last_round()
            if not self.is_tourney_over:
                self.__gen_matches()
        
        return True

    def getStringState(self):
        roundsFormatted = []
        for matches in self.__rounds:
            matchesFormatted = []
            for match in round:
                matchesFormatted.append(match.getStringState())
            roundsFormatted.append(matchesFormatted)

        return {
            "type": self.type,
            "rounds": self.round_count,
            "amountOfWinners": self.amount_of_winners,
            "participantCount": self.participant_count,
            "owner": self.owner,
            "currentRound": self.__current_round,
            "matches": roundsFormatted,
            "isOver": self.is_tourney_over,
            "isRoundOver": self.round_finished()
        }






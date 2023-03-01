from enum import Enum
import random
import string
from collections import namedtuple
from match import Match
from participant import Participant
import logging

logging.basicConfig(level="INFO")
logger = logging.getLogger(__name__)

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
        self.tournaments[id] = Tournament(sender, options, id)
        return id
    
    def join(self, sender, options):
        if "tournament_id" not in options or "participant_id" not in options:
            return False
        is_bot = options["is_bot"] if "is_bot" in options else False
        player_to_add = options["bot_id"] if "bot_id" in options and options["bot_id"] != "blank" else sender
        if "tournament_id" not in options:
            return False
        is_bot = options["is_bot"]
        tournament_id = options["tournament_id"]
        
        participant = Participant()
        participant.set(player_to_add)
        self.tournaments[tournament_id] = participant
        return True
    
    def run(self):
        for tourney in self.tournaments.values():
            tourney.run()
    
    def getStringState(self):
        tournaments = []
        for tournamentId in self.tournaments:
            tournament = self.tournaments[tournamentId]
            tournaments.append(tournament.getStringState())
        return tournaments

class Tournament: 
    def __init__(self, owner: str, options: TournamentOptions, id: str):
        # assert len(participants) > 1
        # assert len(participants) % 2 == 0
        self.id = id
        self.type = options["type"]
        self.amount_of_winners = options["amount_of_winners"]
        self.participant_count = options["participant_count"]
        
        #Initialize participants
        self.participants = []
        for i in range(self.participant_count):
            initialized_participant_id = options["participants"][i] if i < len(options["participants"]) else None
            if initialized_participant_id is not None:
                self.participants.append(Participant(initialized_participant_id))
            else:
                self.participants.append(Participant())
        self.owner = owner
        self.round_count = options["round_count"]

        self.__matches = []
        self.__rounds = []
        self.__current_round = 0
        self.is_tourney_over = False    

    def __gen_matches(self):
        logger.info("attempting to generate matches")
        logger.info("knockout Type: " + TournamentTypes.Knockout)
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
        logger.info("generating knockout matches")
        new = len(self.__matches) < 1
        if new:
            logger.info("is new tournament")
            i = 0
            while i < len(self.participants):
                newMatch = Match(self.owner, self.participants[i], self.participants[i+1])
                logger.info(str(newMatch.getStringState()))
                self.__matches.append(newMatch)
                i += 2
        else:
            new_match = []
            i = 0
            while i < len(self.participants):
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
        for participant in self.participants:
            if not participant.is_initialized():
                return False
        return True
    
    def has_not_started(self):
        return self.__current_round == 0

    def join(self, participant_id: str):
        if self.has_all_participants():
            return False
        for i in range(len(self.participants)):
            if not self.participants[i].is_initialized():
                self.participants[i].set(participant_id)
                return True
        
    def run(self):
        if self.is_tourney_over:
            logger.info("tournament is over, returning")
            return False
        if not self.has_all_participants():
            logger.info("tournament does not have enough participants")
            return False
        #generate matches if none
        if self.has_not_started():
            logger.info("generating matches because tournament has not started")
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
            for match in matches:
                matchesFormatted.append(match.getStringState())
            roundsFormatted.append(matchesFormatted)
        
        participantsFormatted = []
        for participant in self.participants:
            participantsFormatted.append(participant.get())

        return {
            "id": self.id,
            "type": self.type,
            "rounds": self.round_count,
            "amountOfWinners": self.amount_of_winners,
            "participantCount": self.participant_count,
            "participants": participantsFormatted,
            "owner": self.owner,
            "currentRound": self.__current_round,
            "matches": roundsFormatted,
            "isOver": self.is_tourney_over,
            "isRoundOver": self.round_finished()
        }






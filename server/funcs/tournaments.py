from server.types.game import Match
from server.types.event import CreateTournamentEvent
from server.state.index import games, tournaments
from server.utils.index import generate_id
from server.funcs.games import is_game_over
from server.funcs.events import send_notice
from server.types.input import CreateTournamentInput, JoinTournamentInput
from types.tournaments import Tournament, TournamentType
from types.input import MetaData


def is_knockout_round_over(matches: list[list[Match]]) -> bool:
    current_round = len(matches) - 1
    round = matches[current_round]
    for match in round:
        for game_id in match.games:
            game = games[game_id]
            if not is_game_over(game):
                return False
    return True


def is_enough_participants(participants: list[str], participant_count: int) -> bool:
    if len(participants) < participant_count:
        return False
    return True


def is_knockout_tournament_input_valid(input: CreateTournamentInput) -> bool:
    participant_count = input.participant_count
    round_count = input.round_count
    winner_count = input.winner_count
    if participant_count < 2:
            return False
    if winner_count < 1:
        return False
    if winner_count > participant_count:
        return False
    if winner_count > participant_count:
        return False
    if round_count < 1:
        return False
    if round_count > participant_count:
        return False
    return True


def create_knockout_tournament(metadata:MetaData, input: CreateTournamentInput) -> bool:
    timestamp = metadata.timestamp
    sender = metadata.sender

    tourney_type = input.tourney_type
    participants = input.participants
    participant_count = input.participant_count
    
    if not is_enough_participants(input.participants, input.participant_count):
        return False
    if not is_knockout_tournament_input_valid(input):
        return False

    participants = input.participants
    participant_count = len(participants)
    round_count = 1
    matches = []
    for i in range(round_count):
        matches.append([])
        for j in range(participant_count):
            matches[i].append(Match(participants[j], participants[j+1]))
            j += 2
    
    id = generate_id()           
    tournaments[id] = Tournament(
        id=id,
        owner=sender,
        type=tourney_type,
        participants=participants,
        rounds=matches,
    )

    send_notice(
        CreateTournamentEvent(
            timestamp=timestamp,
            creator=sender,
            tournament=id,
            rounds=matches,
        )
    )

    return True


def create_tournament(metadata: MetaData, input: CreateTournamentInput) -> bool:
    tourney_type = input.tourney_type
    if tourney_type == TournamentType.Knockout:
        return create_knockout_tournament(metadata, input)
    elif tourney_type == TournamentType.RoundRobin:
        pass
    elif tourney_type == TournamentType.Swiss:
        pass
    elif tourney_type == TournamentType.DoubleRoundRobin:
        pass
    return False


def join_tournament(metadata: MetaData, input: JoinTournamentInput) -> bool:
    return True
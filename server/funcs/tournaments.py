from server.types.game import Match
from server.types.event import CreateTournamentEvent
from server.state.index import games, tournaments
from server.utils.index import generate_id
from server.funcs.games import is_game_over, create_game
from server.funcs.events import send_event
from server.types.input import CreateTournamentInput, JoinTournamentInput, CreateGameInput
from types.tournaments import Tournament, TournamentType
from types.input import MetaData

def has_started(tournament: Tournament) -> bool:
    return len(tournament.rounds) > 0

def get_current_round(tournament: Tournament) -> list[Match]:
    round_count = len(tournament.rounds)
    return tournament.rounds[round_count - 1]

def is_round_over(matches: list[list[Match]]) -> bool:
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

def is_tournament_input_valid(input: CreateTournamentInput) -> bool:
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
    games_per_match = input.game_count
    game_info = input.game_info
    
    if not is_enough_participants(input.participants, input.participant_count):
        return False
    if not is_tournament_input_valid(input):
        return False

    participants = input.participants
    participant_count = len(participants)
    round_count = 1
    matches = []
    for i in range(round_count):
        matches.append([])
        for j in range(participant_count):
            matches[i].append(Match(participants[j], participants[j+1], game_count, []))
            j += 2
    
    id = generate_id()           
    tournaments[id] = Tournament(
        id=id,
        owner=sender,
        type=tourney_type,
        participants=participants,
        rounds=matches,
        games_per_match=games_per_match,
        game_info=game_info
    )

    send_event(
        CreateTournamentEvent(
            timestamp=timestamp,
            creator=sender,
            tournament_id=id,
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

def create_new_rounds(tournament_id: str) -> bool:
    tournament = tournaments[tournament_id]
    current_round = get_current_round(tournament)
    matches = []
    for match in current_round:
        if match.winner == "":
            return False
        matches.append(Match(match.winner, "", tournament.games_per_match, []))
    tournament.rounds.append(matches)
    
    return True

def create_match_games(metadata: MetaData) -> bool:
    #loop through all matches within tournaments
    for tournament_id in tournaments:
        tournament = tournaments[tournament_id]
        current_round = get_current_round(tournament)
        
        if is_round_over(current_round):
            return create_new_rounds(tournament_id)

        round: list[Match] = tournament.rounds[current_round]
        for match in round:
            current_game_count = len(match.games)
            is_last_game = current_game_count == match.game_count
            is_current_game_done = is_game_over(games[match.games[current_game_count - 1]]) if current_game_count > 0 else True
            has_players = match.p1 != "" and match.p2 != ""
            if has_players and not is_last_game and is_current_game_done:
                pass
            
            game_id = create_game(
                metadata,
                tournament.game_info
            )
            match.games.append(game_id)


    return True

def process_tournaments(metadata: MetaData) -> bool:
    create_match_games(metadata)
    return True
import chess.engine
import chess.pgn
from types.game import Game
from types.input import MetaData, CreateGameInput, JoinGameInput, MoveInput, ResignGameInput
from types.event import CreateGameEvent, JoinGameEvent, MoveEvent, ResignGameEvent
from utils.index import generate_id
from state.index import games
from funcs.bank import get_balance, transfer
from funcs.bot import get_bot
from funcs.ratings import process_elo
from funcs.events import send_notice
from utils.constants import BETTING_POOL_ADDRESS


def is_game_over(game: Game) -> bool:
    return game.state.board().outcome() != None

def create_game(metadata: MetaData, input: CreateGameInput) -> int | bool:
    timestamp = metadata.timestamp
    sender = metadata.sender

    id = generate_id()
    p1, p2, token, wager, bet_duration = input.p1, input.p2, input.token, input.wager, input.bet_duration
    players = [p1, p2] if p1 and p2 else [p1] if p1 else []
    game = Game(
        id=id, 
        players=players, 
        score=[0, 0], 
        wager=wager, 
        token=token, 
        bet_duration=bet_duration, 
        created=timestamp
    )
    games[id] = game
    
    send_notice(
        CreateGameEvent(
            timestamp=timestamp,
            creator=sender,
            game=id
        )
    )

    return id

def join_game(metadata: MetaData, input: JoinGameInput) -> JoinGameEvent | bool:
    sender = metadata.sender
    timestamp = metadata.timestamp
    id = input.id
    
    if not id in games:
        return False

    game = games[id]

    is_max_players = len(game.players) >= 2
    is_in_game = sender in game.players
    address = sender if "0x" in sender else get_bot(sender).owner
    has_funds = get_balance(address, game.token) >= game.wager
    
    if not has_funds and is_max_players and is_in_game:
        return JoinGameEvent(success=False)

    transfer(timestamp, sender, BETTING_POOL_ADDRESS, game.token, game.wager)
    games[input].players.append(sender)

    send_notice(
        JoinGameEvent(
            timestamp=timestamp,
            user=sender,
            game=input.id
        )
    )
    

def send_move(metadata: MetaData, input: MoveInput) -> MoveEvent | bool:
    sender = metadata.sender
    timestamp = metadata.timestamp

    game_id, uci = input.game, input.uci
    if not game_id in games:
        return False
    game = games[game_id]

    #check is can move
    new_move = chess.Move.from_uci(uci)
    is_legal = new_move in game.state.board().legal_moves
    is_in_game = sender in game.players
    is_turn = game.players.index(sender) == 0 if game.state.board().turn==chess.WHITE else game.players.index(sender) > 0 if game.state.board().turn == chess.BLACK else False
    is_min_players = len(game.players) >= 2
    is_game_end = game.state.board().outcome() != None
    is_betting_phase_open = timestamp <= (game.bet_duration + game.created)
    can_move = is_legal and is_in_game and is_turn and is_min_players and not is_game_end and not is_betting_phase_open
    is_bot = is_bot()
    if not can_move:
        return False
    #apply move
    games[game_id].state.add_variation(new_move)

    #check if end
    is_game_end = game.state.board().outcome() != None
    if is_game_end:
        game = games[id]
        winner = game.state.board().outcome().winner
        game.score[0] = 1 if winner == chess.WHITE else 0
        game.score[1] = 1 if winner == chess.BLACK else 0
        winner_id = game.players[0] if game.score[0] else game.players[1]
        process_elo(game, game.players[0], game.players[1], game.score[0], game.score[1])
        transfer(timestamp, BETTING_POOL_ADDRESS, winner_id, game.token, game.wager)

    send_notice(
        MoveEvent(
            timestamp=timestamp,
            sender=sender,
            uci=uci
        )
    )
    

def resign_game(metadata: MetaData, input: ResignGameInput) -> bool:
    return True

    
    

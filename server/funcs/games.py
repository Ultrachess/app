from types.game import Game
from types.input import CreateGameInput, JoinGameInput, MoveInput
from types.event import CreateGameEvent, JoinGameEvent, MoveEvent
from utils.index import generate_id
from state.index import games
from funcs.bank import get_balance
from funcs.bot import get_bot

def handle_game_end(id: str):
    game = games[id]
    return

def create_game(sender: str, timestamp: int, input: CreateGameInput) -> CreateGameEvent:
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
    return CreateGameEvent(
        timestamp=timestamp,
        creator=sender,
        game=id
    )

def join_game(sender: str, timestamp: int, input: JoinGameInput) -> JoinGameEvent | bool:
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

    games[input].players.append(sender)
    return JoinGameEvent(
        timestamp=timestamp,
        user=sender,
        game=input.id
    )

def send_move(sender: str, timestamp: int, input: MoveInput) -> MoveEvent | bool:
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
        handle_game_end(game_id)
    return MoveEvent(
        timestamp=timestamp,
        sender=sender,
        uci=uci
    )

    
    

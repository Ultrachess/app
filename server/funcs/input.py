from types.input import Input, MetaData, InputType
from funcs.games import send_move, create_game, join_game, resign_game
from funcs.bot import create_bot, update_bot
from funcs.bank import deposit, withdraw
from funcs.prediction import bet
from funcs.tournaments import create_tournament, join_tournament

def process_input(metadata: MetaData, input: Input) -> bool:

    sender = metadata.sender
    epoch_index = metadata.epoch_index
    input_index = metadata.input_index
    block_number = metadata.block_number
    timestamp = metadata.timestamp

    if input.type == InputType.MOVE:
        return send_move(sender, timestamp, input)
    elif input.type == InputType.CREATE_GAME:
        return create_game(sender, timestamp, input)
    elif input.type == InputType.JOIN_GAME:
        return join_game(sender, timestamp, input)
    elif input.type == InputType.RESIGN_GAME:
        return resign_game(metadata, input)
    elif input.type == InputType.DEPLOY_BOT:
        return create_bot(metadata, input)
    elif input.type == InputType.UPDATE_BOT:
        return update_bot(metadata, input)
    elif input.type == InputType.DEPOSIT:
        return deposit(metadata, input)
    elif input.type == InputType.WITHDRAW:
        return withdraw(metadata, input)
    elif input.type == InputType.BET:
        return bet(metadata, input)
    elif input.type == InputType.CREATE_TOURNAMENT:
        return create_tournament(metadata, input)
    elif input.type == InputType.JOIN_TOURNAMENT:
        return join_tournament(metadata, input)

    return False
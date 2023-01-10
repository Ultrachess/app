from types.inspect import Inspect, InspectType


#create all inspect functions
def process_inspect_game(inspect: Inspect) -> Inspect | None:
    return None

def process_inspect_games(inspect: Inspect) -> Inspect | None:
    return None

def process_inspect_user(inspect: Inspect) -> Inspect | None:
    return None

def process_inspect_users(inspect: Inspect) -> Inspect | None:
    return None

def process_inspect_bot(inspect: Inspect) -> Inspect | None:
    return None

def process_inspect_bots(inspect: Inspect) -> Inspect | None:
    return None

def process_inspect_tournament(inspect: Inspect) -> Inspect | None:
    return None

def process_inspect_tournaments(inspect: Inspect) -> Inspect | None:
    return None

def process_inspect_bet(inspect: Inspect) -> Inspect | None:
    return None

def process_inspect_bets(inspect: Inspect) -> Inspect | None:
    return None

def process_inspect_pool(inspect: Inspect) -> Inspect | None:
    return None

def process_inspect_pools(inspect: Inspect) -> Inspect | None:
    return None

def process_inspect_pot(inspect: Inspect) -> Inspect | None:
    return None

def process_inspect_pots(inspect: Inspect) -> Inspect | None:
    return None

def process_inspect_request(inspect: Inspect) -> Inspect | None:
    return None

def process_inspect_requests(inspect: Inspect) -> Inspect | None:
    return None

def process_inspect_block(inspect: Inspect) -> Inspect | None:
    return None

def process_inspect(inspect: Inspect) -> Inspect | None:
    if inspect.type == InspectType.GAME:
        return process_inspect_game(inspect)
    elif inspect.type == InspectType.GAMES:
        return process_inspect_games(inspect)
    elif inspect.type == InspectType.USER:
        return process_inspect_user(inspect)
    elif inspect.type == InspectType.USERS:
        return process_inspect_users(inspect)
    elif inspect.type == InspectType.BOT:
        return process_inspect_bot(inspect)
    elif inspect.type == InspectType.BOTS:
        return process_inspect_bots(inspect)
    elif inspect.type == InspectType.TOURNAMENT:
        return process_inspect_tournament(inspect)
    elif inspect.type == InspectType.TOURNAMENTS:
        return process_inspect_tournaments(inspect)
    elif inspect.type == InspectType.BET:
        return process_inspect_bet(inspect)
    elif inspect.type == InspectType.BETS:
        return process_inspect_bets(inspect)
    elif inspect.type == InspectType.POOL:
        return process_inspect_pool(inspect)
    elif inspect.type == InspectType.POOLS:
        return process_inspect_pools(inspect)
    elif inspect.type == InspectType.POT:
        return process_inspect_pot(inspect)
    elif inspect.type == InspectType.POTS:
        return process_inspect_pots(inspect)
    elif inspect.type == InspectType.REQUEST:
        return process_inspect_request(inspect)
    elif inspect.type == InspectType.REQUESTS:
        return process_inspect_requests(inspect)
    elif inspect.type == InspectType.BLOCK:
        return process_inspect_block(inspect)
    return None
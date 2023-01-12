from types.inspect import Inspect, InspectType, GameInspect, GamesInspect, UserInspect, UsersInspect, BotInspect, BotsInspect, TournamentInspect, TournamentsInspect, BetInspect, BetsInspect, PoolInspect, PoolsInspect, PotInspect, PotsInspect, RequestInspect, RequestsInspect, BlockInspect
from types.game import Game
from types.user import User
from types.bot import Bot
from types.tournaments import Tournament
from types.prediction import Bet, BettingPool, Pot
from types.request import Request
from state.index import block, games, users, bots, tournaments, bets, pools, pots, requests
from utils.constants import BETTING_POOL_ADDRESS

def get_range(obj: dict, index: int, range: int) -> list[str]:
    arr = []
    vals = obj.values()
    for i in range(index, index + range):
        arr.append(vals[i])
    return arr

#create all inspect functions
def process_inspect_game(inspect: GameInspect) -> Game | None:
    game = inspect.game
    if game in games:
        return games[inspect.game]
    
    return None

def process_inspect_games(inspect: GamesInspect) -> list[Game] | None:
    return get_range(games, inspect.index, inspect.range)

def process_inspect_user(inspect: UserInspect) -> User | None:
    user = inspect.user
    if user in users:
        return users[user]
    return None

def process_inspect_users(inspect: UsersInspect) -> list[str]:
    users = get_range(users, inspect.index, inspect.range)
    #remove users with id including BETTING_POOL
    return [user for user in users if not user.id.startswith(BETTING_POOL_ADDRESS)]


def process_inspect_bot(inspect: BotInspect) -> Inspect | None:
    bot = inspect.bot
    if bot in bots:
        return bots[bot]
    return None

def process_inspect_bots(inspect: BotsInspect) -> list[str]:
    return get_range(bots, inspect.index, inspect.range)

def process_inspect_tournament(inspect: TournamentInspect) -> Tournament | None:
    tournament = inspect.tournament
    if tournament in tournaments:
        return tournaments[tournament]
    return None

def process_inspect_tournaments(inspect: TournamentsInspect) -> list[str]:
    return get_range(tournaments, inspect.index, inspect.range)

def process_inspect_bet(inspect: BetInspect) -> Bet | None:
    bet = inspect.bet
    if bet in bets:
        return bets[bet]
    return None

def process_inspect_bets(inspect: BetsInspect) -> Inspect | None:
    return get_range(bets, inspect.index, inspect.range)

def process_inspect_pool(inspect: PoolInspect) -> Inspect | None:
    pool = inspect.pool
    if pool in pools:
        return pools[pool]
    return None

def process_inspect_pools(inspect: PoolsInspect) -> Inspect | None:
    return get_range(pools, inspect.index, inspect.range)

def process_inspect_pot(inspect: PotInspect) -> Pot | None:
    pot = inspect.pot
    if pot in pots:
        return pots[pot]
    return None

def process_inspect_pots(inspect: PotsInspect) -> Inspect | None:
    return get_range(pots, inspect.index, inspect.range)

def process_inspect_request(inspect: RequestInspect) -> Request | None:
    request = inspect.request
    if request in requests:
        return requests[request]
    return None

def process_inspect_requests(inspect: RequestsInspect) -> list[str] | None:
    return get_range(requests, inspect.index, inspect.range)

def process_inspect_block(inspect: BlockInspect) -> int:
    return block

def process_inspect(inspect: Inspect):
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
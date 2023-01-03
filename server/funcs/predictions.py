from types.input import MetaData, BetInput
from types.event import Event, EventType
from types.prediction import Bet, Condition, BettingPool, Pot
from state.index import bets, games, pools, pots
from utils.constants import BETTING_POOL_ADDRESS
from utils.index import generate_id
from funcs.bank import get_balance, transfer


#make a prediction
def bet(metadata: MetaData, input: BetInput) -> bool:
    sender = metadata.sender
    timestamp = metadata.timestamp
    
    #get pot and betting pool ids based on event type and determine if the user can bet
    can_bet = False
    pot_id = ""
    betting_pool_id = ""
    event_type = input.prediction.event_type
    if event_type == EventType.MOVE:
        pass
    elif event_type == EventType.CREATE_GAME:
        pass
    elif event_type == EventType.JOIN_GAME:
        pass
    elif event_type == EventType.BOT_MOVE:
        pass
    elif event_type == EventType.RESIGN_GAME:
        pass
    elif event_type == EventType.GAME_END:
        game_id = input.prediction.game_id
        game = games[game_id]
        within_time = timestamp <= game.created + game.bet_duration
        in_game = sender in game.players
        can_bet = within_time and not in_game
        pot_id = BETTING_POOL_ADDRESS + input.prediction.game_id
        betting_pool_id = pot_id + str(input.prediction.score1)
    elif event_type == EventType.ELO_EVENT:
        pass
    elif event_type == EventType.DEPLOY_BOT:
        pass
    elif event_type == EventType.DEPOSIT:
        pass
    elif event_type == EventType.WITHDRAW:
        pass
    elif event_type == EventType.TRANSFER:
        pass 

    has_funds = get_balance(sender, input.token) >= input.amount

    if not can_bet or not has_funds:
        return False

    #transfer funds to betting pool
    if not transfer(timestamp, sender, pot_id, input.token, input.amount):
        return False

    #create pot and betting pool if they don't exist
    if pot_id not in pots:
        pots[pot_id] = Pot(
            id=pot_id,
            token=input.token,
            amount=0
        )
    if betting_pool_id not in pools:
        pools[betting_pool_id] = BettingPool(
            id=betting_pool_id,
            token=input.token,
            amount=0,
            bets=[]
        )

    #add betting pool to pot if it's not already there
    if betting_pool_id not in pots[pot_id].pools:
        pots[pot_id].pools.append(betting_pool_id)

    #add bet to betting pool and bet to betting pool
    pools[betting_pool_id].amount += input.amount
    pots[pot_id].amount += input.amount
    bet_id = generate_id()
    bets[bet_id] = Bet(
        id=bet_id,
        user=sender,
        token=input.token,
        amount=input.amount,
        prediction=input.prediction
    )
    if bet_id not in pools[betting_pool_id].bets:
        pools[betting_pool_id].bets.append(bet_id)

    
    return True


#check if event was predicted by bets
#if so, return bet_id, betting_pool_id, and pot_id
def get_predicted_id(event: Event) -> tuple(str, str, str):
    #get pot and betting pool ids based on event type
    pot_id = ""
    betting_pool_id = ""
    #create lambda function to check if event matches bet
    event_matches_bet = lambda event, bet: True
    event_type = event.type
    if event_type == EventType.MOVE:
        return ("", "", "")
    elif event_type == EventType.CREATE_GAME:
        return ("", "", "")
    elif event_type == EventType.JOIN_GAME:
        return ("", "", "")
    elif event_type == EventType.BOT_MOVE:
        return ("", "", "")
    elif event_type == EventType.RESIGN_GAME:
        return ("", "", "")
    elif event_type == EventType.GAME_END:
        game_id = event.game_id
        pot_id = BETTING_POOL_ADDRESS + game_id
        betting_pool_id = pot_id + str(event.score1)
        event_matches_bet = lambda event, bet: event.game_id == bet.prediction.game_id and event.score1 == bet.prediction.score1 
    elif event_type == EventType.ELO_EVENT:
        return ("", "", "")
    elif event_type == EventType.DEPLOY_BOT:
        return ("", "", "")
    elif event_type == EventType.DEPOSIT:
        return ("", "", "")
    elif event_type == EventType.WITHDRAW:
        return ("", "", "")
    elif event_type == EventType.TRANSFER:
        return ("", "", "") 
    elif event_type == EventType.PAYOUT:
        return ("", "", "")

    #check if betting pool exists
    if betting_pool_id not in pools:
        return ("", "", "")

    #check if any bets match event
    for bet_id in pools[betting_pool_id].bets:
        if event_matches_bet(event, bets[bet_id]):
            return (bet_id, betting_pool_id, pot_id)

    return ("", "", "")

def get_pool_percentage(betting_pool_id: str, bet_id: str) -> float:
    #get bet amount
    bet_amount = bets[bet_id].amount

    #get betting pool amount
    betting_pool_amount = pools[betting_pool_id].amount

    #get percentage
    percentage = float(bet_amount) / float(betting_pool_amount)

    return percentage

def apply_winning_pool(metadata: MetaData, pot_id: str, winning_pool_id: str):
    timestamp = metadata.timestamp

    for bet_id in pools[winning_pool_id].bets:

        #get percentage of bet
        percentage = get_pool_percentage(winning_pool_id, bet_id)

        #get amount to transfer
        amount = int(pots[pot_id].amount * percentage)

        #transfer funds to user
        transfer(timestamp, pots[pot_id].token, bets[bet_id].user, pots[pot_id].token, amount)

    #delete pot
    del pots[pot_id]
    #delete betting pools
    for betting_pool_id in pots[pot_id].pools:
        del pools[betting_pool_id]

def on_event(metadata: MetaData, event: Event):
    #check if event matches any bets
    #if not, return
    bet_id, betting_pool_id, pot_id = get_predicted_id(event)
    if bet_id == "" or betting_pool_id == "" or pot_id == "":
        return
    
    #set winning pool
    apply_winning_pool(pot_id, betting_pool_id)


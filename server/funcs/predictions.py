from types.input import MetaData, BetInput
from types.event import Event, EventType
from types.prediction import Bet, Condition, BettingPool, Pot
from state.index import bets, games
from utils.constants import BETTING_POOL_ADDRESS
from utils.index import generate_id
from funcs.bank import get_balance, transfer


#check if the prediction is valid
def can_make_prediction(metadata: MetaData, input: BetInput) -> bool:
    sender = metadata.sender
    timestamp = metadata.timestamp

    can = True
    event = input.prediction.event
    if event.type == EventType.MOVE:
        game = games[input.event.game]
        within_time = timestamp <= game.start + game.duration
        in_game = sender in game.players
        can = within_time and not in_game
        pass
    elif event.type == EventType.CREATE_GAME:
        game = games[event.game]
        within_time = timestamp <= game.start + game.duration
        in_game = sender in game.players
        can = within_time and not in_game
        pass
    elif input.event.type == EventType.JOIN_GAME:
        game = games[input.event.game]
        within_time = timestamp <= game.start + game.duration
        in_game = sender in game.players
        can = within_time and not in_game
        pass
    elif input.event.type == EventType.BOT_MOVE:
        game = games[input.event.game]
        within_time = timestamp <= game.start + game.duration
        in_game = sender in game.players
        can = within_time and not in_game
        pass
    elif input.event.type == EventType.RESIGN_GAME:
        pass
    elif input.event.type == EventType.GAME_END:
        game = games[input.event.game]
        within_time = timestamp <= game.start + game.duration
        in_game = sender in game.players
        can = within_time and not in_game
    elif input.event.type == EventType.ELO_EVENT:
        pass
    elif input.event.type == EventType.DEPLOY_BOT:
        pass
    elif input.event.type == EventType.DEPOSIT:
        pass
    elif input.event.type == EventType.WITHDRAW:
        pass
    elif input.event.type == EventType.TRANSFER:
        pass
    
    has_funds = get_balance(sender, input.token) >= input.amount
    can = can and has_funds

    return can


#make a prediction
def bet(metadata: MetaData, input: BetInput) -> bool:
    sender = metadata.sender
    timestamp = metadata.timestamp

    if not can_make_prediction(metadata, input):
        return False

    if not transfer(timestamp, sender, BETTING_POOL_ADDRESS, input.token, input.amount):
        return False

    id = generate_id()
    bets[id] = Bet(
        id=id,
        user=sender,
        token=input.token,
        amount=input.amount,
        prediction=input.prediction
    )
    return True


#check if event is predicted by bet
def get_object_attribute_by_index(object, index:int):
    #get list of attribute values of object which is a class as list
    #only include class attributes, not inherited attributes
    list_of_attributes = [getattr(object, attr) for attr in dir(object) if not callable(getattr(object, attr)) and not attr.startswith("__")]
    return list_of_attributes[index]


#operator function
def operator(condition: Condition, val1, val2) -> bool:
    if condition == Condition.greater:
        return val1 > val2
    elif condition == Condition.less:
        return val1 < val2
    elif condition == Condition.equal:
        return val1 == val2
    else:
        raise Exception("Invalid condition")


#check if event is predicted by bet
def event_predicted_by_bet(event: Event, bet: Bet) -> tuple(bool, int):

    #get event type
    event_type = event.type
    bet_event_type = bet.prediction.event_type

    #check if event and bet.prediction have same attributes
    if bet_event_type != event_type:
        return (False, -1)

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
        actual_game_id = event.game_id
        actual_score1 = event.score1
        predicted_game_id = bet.prediction.game_id
        predicted_score1 = bet.prediction.score1
        return actual_game_id == predicted_game_id and actual_score1 == predicted_score1
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

    return (False, -1)


#check if event

def event_in_bets(event: Event) -> bool:
    for bet in bets.values():
        is_predicted, index = event_predicted_by_bet(event, bet)
        if is_predicted:
            return True
    return False

#get Pot associated with event
def get_pot(event: Event) -> Pot:
    pot = Pot(
        token=event.token,
        amount=0,
        pools=[]
    )

    #get list of predicted bets for event and add to pot
    predicted_bets = []
    for bet in bets.values():
        if event_predicted_by_bet(event, bet):
            predicted_bets.append(bet)
    


    pools = {}
    for bet in bets.values():
        if event_predicted_by_bet(event, bet):
            #get event type
            event_type = event.type
            bet_event_type = bet.prediction.event_type
            pot.amount += bet.amount
            pot.pools.append(BettingPool(
                user=bet.user,
                amount=bet.amount,
                token=bet.token
            ))

    return pot

def on_event(event: Event):
    #check if event matches any bets
    #if not, return
    if not event_in_bets(event):
        return

    #get bett
    pass
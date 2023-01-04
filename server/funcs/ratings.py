from types.event import EloEvent
from funcs.accounts import get_user, set_user
from funcs.events import send_event

k = 1

def expected_result(elo1: float, elo2: float) -> float:
    exp = (elo2 - elo1)/400.0
    return 1 / ((10.0**(exp)) + 1)


def process_elo(game:str, p1: str, p2: str, score1: float, score2: float) -> tuple[EloEvent, EloEvent]:
    user1 = get_user(p1)
    user2 = get_user(p2)
    elo1 = user1.rating.ultrachess
    elo2 = user2.rating.ultrachess

    expected_result_1 = expected_result(
        elo1=elo1,
        elo2=elo2
    )
    expected_result_2 = expected_result(
        elo2=elo2,
        elo1=elo1
    )

    new_elo1 = elo1 + (k * (score1 - expected_result_1))
    new_elo2 = elo2 + (k * (score2 - expected_result_2))

    user1.rating.ultrachess = new_elo1
    user2.rating.ultrachess = new_elo2

    set_user(p1, user1)
    set_user(p2, user2)

    send_event(
        EloEvent(
            user=p1,
            game=game,
            prev=elo1,
            now=new_elo1
        )
    )
    send_event(
        EloEvent(
            user=p2,
            game=game,
            prev=elo2,
            now=new_elo2
        )
    )
    
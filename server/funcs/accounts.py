from state.index import users
from types.user import BaseUser

def get_user(id: str) -> BaseUser:
    if id in users:
        return users[id]

    users[id] = BaseUser(id=id)
    return users[id]

def set_user(id: str, user: BaseUser):
    users[id] = user
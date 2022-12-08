from dataclasses import dataclass
from account import Account
from country import Country
from rating import Rating

@dataclass
class BaseUser:
    id: str
    name: str
    rating: Rating
    nationality: Country
    account: Account
    verified: bool
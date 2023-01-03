from types.game import Game
from types.bot import Bot
from types.user import BaseUser
from types.tournaments import Tournament
from types.prediction import Bet, BettingPool, Pot

users: dict[str, BaseUser] = {}
games: dict[str, Game] = {}
bots: dict[str, Bot] = {}
tournaments: dict[str, Tournament] = {}
bets: dict[str, Bet] = {}
pools: dict[str, BettingPool] = {}
pots: dict[str, Pot] = {}
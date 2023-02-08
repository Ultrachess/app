from bot import BotManager, BotFactory
from matchmaker import Matchmaker
from account import AccountBalanceManager
from elo import EloManager
from actions import ActionManager
from bets import BetManager
from tournament import TournamentManager
from challenge import ChallengeManager
from marketplace import BotMarketPlaceManager
import chess.engine
import chess.pgn
import random


challengeManager = ChallengeManager()
botMarketPlace = BotMarketPlaceManager()
tournamentManager = TournamentManager()
betManager = BetManager()
#Initialize global matchmaking object
matchMaker = Matchmaker()
# Initialize global bot factory object
botFactory = BotFactory()
botManager = BotManager()
# Initialize global account balance manager object
accountManager = AccountBalanceManager()
# Initialize global elo manager
eloManager = EloManager()
# Initialize global action manager
actionManager = ActionManager()
# Default header for ERC-20 transfers coming from the Portal, which corresponds
# to the Keccak256-encoded string "ERC20_Transfer", as defined at
# https://github.com/cartesi/rollups/blob/main/onchain/rollups/contracts/facets/ERC20PortalFacet.sol.
ERC20_TRANSFER_HEADER =  b'Y\xda*\x98N\x16Z\xe4H|\x99\xe5\xd1\xdc\xa7\xe0L\x8a\x990\x1b\xe6\xbc\t)2\xcb]\x7f\x03Cx'
# Function selector to be called during the execution of a voucher, which
# corresponds to the Keccak256-encoded result of Web3.keccak(text='transfer')
TRANSFER_FUNCTION_SELECTOR = b'\xb4\x83\xaf\xd3\xf4\xca\xed\xc6\xee\xbfD$o\xe5N8\xc9^1y\xa5\xec\x9e\xa8\x17@\xec\xa5\xb4\x82\xd1.'
# CTSI erc20 address
DEFAULT_ERC20 = "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853"
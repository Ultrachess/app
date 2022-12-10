from enum import Enum
from dataclasses import dataclass
from types.prediction import Prediction
from types.tournaments import TournamentType
from types.struct import StructBinary

class InputType(Enum):
    MOVE = 0
    CREATE_GAME = 1
    JOIN_GAME = 2
    RESIGN_GAME = 3
    DEPLOY_BOT = 4
    UPDATE_BOT = 5
    DEPOSIT = 6
    WITHDRAW = 7
    BET = 8
    CREATE_TOURNAMENT = 9
    JOIN_TOURNAMENT= 10

InputPackingOrder = [
    "abc",
    "abc",
    "abc",
    "abc",
    "abc",
    "abc",
    "abc",
    "abc",
]

@dataclass
class MetaData:
    sender: str
    epoch_index: int
    input_index: int
    block_number: int
    time_stamp: str

@dataclass
class AdvanceStateData:
    metadata: MetaData
    payload: bytes

@dataclass
class InspectElementData:
    hello: str

@dataclass
class BaseInput(StructBinary):
    type: InputType

@dataclass
class MoveInput(BaseInput):
    type = 0
    order = 'krk'
    game: int
    uci: str

@dataclass
class CreateGameInput(BaseInput):
    type = 1
    player_1: str
    player_2: str
    token: str
    amount: int
    bet_duration: int

@dataclass
class JoinGameInput(BaseInput):
    type = 2
    id: str

@dataclass
class ResignGameInput(BaseInput):
    type = 3
    id: str

@dataclass
class DeployBotInput(BaseInput):
    type = 4
    name: str
    binary: bytes

@dataclass
class UpdateBotInput(BaseInput):
    type = 5
    id: str
    auto_enabled: bool
    wager_amount: int

@dataclass
class DepositInput(BaseInput):
    type = 6
    token: str
    amount: int

@dataclass
class WithdrawInput(BaseInput):
    type = 7
    token: str
    amount: int

@dataclass
class BetInput(BaseInput):
    type = 8
    id: str
    token: str
    amount: str
    prediction: Prediction

@dataclass
class CreateTournamentInput(BaseInput):
    type = 9
    tourney_type: TournamentType
    participants: list[str]
    participant_count: int
    round_count: int
    winner_count: int

@dataclass
class JoinTournamentInput(BaseInput):
    type = 10
    id: str
    user_id: str


Input = MoveInput | CreateGameInput | JoinGameInput | ResignGameInput | DeployBotInput | UpdateBotInput 


from dataclasses import dataclass
from prediction import Prediction
from tournaments import TournamentType

@dataclass
class BaseInput:
    type: int

@dataclass
class MoveInput(BaseInput):
    game: str
    uci: str

@dataclass
class CreateGameInput(BaseInput):
    player_1: str
    player_2: str
    token: str
    amount: int
    bet_duration: int

@dataclass
class JoinGameInput(BaseInput):
    id: str

@dataclass
class ResignGameInput(BaseInput):
    id: str

@dataclass
class DeployBotInput(BaseInput):
    name: str
    binary: bytes

@dataclass
class UpdateBotInput(BaseInput):
    id: str
    auto_enabled: bool
    wager_amount: int

@dataclass
class DepositInput(BaseInput):
    token: str
    amount: int

@dataclass
class WithdrawInput(BaseInput):
    token: str
    amount: int

@dataclass
class BetInput(BaseInput):
    id: str
    token: str
    amount: str
    prediction: Prediction

@dataclass
class CreateTournamentInput(BaseInput):
    tourney_type: TournamentType
    participants: list[str]
    participant_count: int
    round_count: int
    winner_count: int

@dataclass
class JoinTournamentInput(BaseInput):
    id: str
    user_id: str


Input = MoveInput | CreateGameInput | JoinGameInput | ResignGameInput | DeployBotInput | UpdateBotInput 


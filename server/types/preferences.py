from dataclasses import dataclass

@dataclass
class BotMatchMakingPreferences:
    auto_enabled: bool = False
    wager_token: str = "0x0000000000000000000000000000000000000000"
    wager_amount: int = 0
    lowest_elo: int = 0
    highest_elo: int = 4000

@dataclass
class BotMovePreferences:
    time_limit: int = 1000
    depth_limit: int = 1000
    nodes_limit: int = 1000

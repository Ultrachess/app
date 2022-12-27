from dataclasses import dataclass

@dataclass
class BotPreferences:
    auto_enabled: bool
    wager_token: str
    wager_amount: int
    lowest_elo: int
    highest_elo: int

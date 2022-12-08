from dataclasses import dataclass
from event import Event

@dataclass
class Notice:
    sender: str
    timestamp: str
    event: Event 
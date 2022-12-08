from dataclasses import dataclass

@dataclass
class Rating:
    ultrachess: int
    fide: int
    uscf: int
    ecf: int
    rcf: int
    cfc: int
    dsb: int
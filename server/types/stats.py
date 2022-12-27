from dataclasses import dataclass

@dataclass
class ComputeResources:
    cycles: int
    memory: int

@dataclass
class EngineMoveStatistics:
    depth: int
    seldepth: int
    time: int
    nodes: int
    pv: list[str]
    score: float
    nps: int
    tbhits: int
    sbhits: int
    cpuload: int
    


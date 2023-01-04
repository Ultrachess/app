from dataclasses import dataclass

@dataclass
class ComputeResources:
    cycles: int = 0
    memory: int = 0

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
    


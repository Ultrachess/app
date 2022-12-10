from dataclasses import dataclass

@dataclass
class ComputeResources:
    cycles: int
    memory: int

@dataclass
class EngineMoveStatistics:
    eval: int
    mobility: int
    r_mobility: int
    speed: int
    depth: int
    s_depth: int
    nodes: int
    tb_hits: int
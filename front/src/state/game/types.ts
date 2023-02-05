import { TransactionInfo, TransactionType } from "../../common/types";
import { NoticeInfo } from "./updater";

export enum ActionType {
    INPUT, // action will be process by L2
    TRANSACTION, // action will be process by just L1
}

export enum ActionStates {
    INITIALIZED, // pending user input
    PENDING, // transaction pending on L1
    CONFIRMED_WAITING_FOR_L2, // transaction confirmed on L1
    PROCESSED, // processed by L2
    ERROR,
}

export interface Action {
    id: number,
    type: ActionType,
    transactionInfo: TransactionInfo,
    status?: ActionStates,
    transactionHash?: string,
    timeStamp?: string,
    result?: NoticeInfo
    processedTime?: number
    initTime: number,
}

export type ActionList = {
    [actionId: string]: Action
}

export interface Bet {
    sender : string,
    timestamp : number,
    gameId : string,
    tokenAddress : string,
    amount : number,
    winningId : number,
}

export interface GameWagers {
    gameId: string,
    openTime: number,
    duration: number,
    bets: {
        [winningId: string]: {
            [playerId: string]: Bet
        }
    },
    pots: {
        [winningId: string]: {
            [playerId: string]: Number
        }
    },
    totalPot: number,
    betsArray: Bet[],
}

export interface Game {
    id: string,
    players: string[],
    pgn: string,
    isBot : boolean,
    isEnd : boolean,
    matchCount : number,
    wagerAmount : number,
    token : string,
    timestamp : number,
    resigner : string,
    scores : number[],
    bettingDuration : number,
    wagering: GameWagers
}
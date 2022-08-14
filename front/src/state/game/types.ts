import { TransactionInfo } from "../../common/types";
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


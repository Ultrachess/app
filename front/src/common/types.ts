export enum TransactionType {
    SEND_MOVE_INPUT,
    CREATE_GAME_INPUT,
    JOIN_GAME_INPUT,
    DEPLOY_BOT_INPUT,
    DEPOSIT_ERC20,
    APPROVE_ERC20,
}

export interface BaseTransactionInfo {
    type: TransactionType
}

export interface SendMoveTransactionInfo extends BaseTransactionInfo {
    type: TransactionType.SEND_MOVE_INPUT
    value: string,
}

export interface CreateGameTransactionInfo extends BaseTransactionInfo {
    type: TransactionType.CREATE_GAME_INPUT,
    name: string,
    isBot: boolean,
    botId1?: string,
    botId2?: string,
    wagerTokenAddress: string,
    wagerAmount: string,
}

export interface JoinGameTransactionInfo extends BaseTransactionInfo {
    type: TransactionType.JOIN_GAME_INPUT
    roomId: string,
}

export interface DeployBotTransactionInfo extends BaseTransactionInfo {
    type: TransactionType.DEPLOY_BOT_INPUT,
    name: string,
    binary: Uint8Array,
}

export interface DepositErc20TransactionInfo extends BaseTransactionInfo {
    type: TransactionType.DEPOSIT_ERC20,
    tokenAddress: string,
    amount: string,
}

export interface ApproveErc20Transaction extends BaseTransactionInfo {
    type: TransactionType.APPROVE_ERC20,
    tokenAddress: string,
    spender: string,
    amount: string,
}

export type TransactionInfo = 
    | SendMoveTransactionInfo
    | CreateGameTransactionInfo
    | JoinGameTransactionInfo
    | DeployBotTransactionInfo
    | DepositErc20TransactionInfo
    | ApproveErc20Transaction


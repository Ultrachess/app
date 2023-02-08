export enum TransactionType {
    SEND_MOVE_INPUT,
    CREATE_GAME_INPUT,
    JOIN_GAME_INPUT,
    RESIGN_GAME_INPUT,
    DEPLOY_BOT_INPUT,
    DEPOSIT_ERC20,
    APPROVE_ERC20,
    BOT_STEP,
    MANAGER_BOT_INPUT,
    RELEASE_FUNDS,
    BET_INPUT,
    CREATE_TOURNAMENT,
    JOIN_TOURNAMENT,
    CREATE_CHALLENGE,
    ACCEPT_CHALLENGE,
    DECLINE_CHALLENGE,
    CREATE_OFFER,
    ACCEPT_OFFER,
    DECLINE_OFFER,
}

export enum TourneyType {
    SWISS = "Swiss",
    KNOCKOUT = "Knockout",
    ROUNDROBIN = "RoundRobin",
    DOUBLEROUNDROBIN = "DoubleRoundRobin",
}

export interface BaseTransactionInfo {
    type: TransactionType
}

export interface CreateChallengeTransactionsInfo extends BaseTransactionInfo {
    type: TransactionType.CREATE_CHALLENGE,
    recipient: string,
    wager: string,
    token: string,
}

export interface AcceptChallengeTransactionsInfo extends BaseTransactionInfo {
    type: TransactionType.ACCEPT_CHALLENGE,
    challengeId: string
}

export interface DeclineChallengeTransactionsInfo extends BaseTransactionInfo {
    type: TransactionType.DECLINE_CHALLENGE,
    challengeId: string
}

export interface CreateBotOfferTransactionsInfo extends BaseTransactionInfo {
    type: TransactionType.CREATE_OFFER,
    botId: string,
    price: string,
    token: string,
}

export interface AcceptBotOfferTransactionsInfo extends BaseTransactionInfo {
    type: TransactionType.ACCEPT_OFFER,
    offerId: string
}

export interface DeclineBotOfferTransactionsInfo extends BaseTransactionInfo {
    type: TransactionType.DECLINE_OFFER,
    offerId: string
}

export interface SendMoveTransactionInfo extends BaseTransactionInfo {
    type: TransactionType.SEND_MOVE_INPUT,
    roomId: string,
    value: string,
}

export interface BotStepTransactionInfo extends BaseTransactionInfo {
    type: TransactionType.BOT_STEP,
    hash: string,
}

export interface CreateGameTransactionInfo extends BaseTransactionInfo {
    type: TransactionType.CREATE_GAME_INPUT,
    name: string,
    isBot: boolean,
    botId1?: string,
    botId2?: string,
    playerId?: string,
    wagerTokenAddress: string,
    wagerAmount: string,
    bettingDuration: string,
}

export interface ResignGameTransactionInfo extends BaseTransactionInfo {
    type: TransactionType.RESIGN_GAME_INPUT,
    roomId: string,
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

export interface ManagerBotTransactionInfo extends BaseTransactionInfo {
    type: TransactionType.MANAGER_BOT_INPUT,
    autoMaxWagerAmount: string,
    autoWagerTokenAddress: string,
    autoBattleEnabled: boolean,
    botId: string,
}

export interface DepositErc20TransactionInfo extends BaseTransactionInfo {
    type: TransactionType.DEPOSIT_ERC20,
    tokenAddress: string,
    amount: string,
}

export interface ApproveErc20TransactionInfo extends BaseTransactionInfo {
    type: TransactionType.APPROVE_ERC20,
    tokenAddress: string,
    spender: string,
    amount: string,
}

export interface BetTransactionInfo extends BaseTransactionInfo {
    type: TransactionType.BET_INPUT,
    gameId: string,
    tokenAddress: string,
    amount: string,
    winningId: string,
}

export interface ReleaseFundsTransactionInfo extends BaseTransactionInfo {
    type: TransactionType.RELEASE_FUNDS,
    tokenAddress: string,
}

export interface CreateTournamentTransactionInfo extends BaseTransactionInfo {
    type: TransactionType.CREATE_TOURNAMENT,
    tourneyType: TourneyType,
    participants: string[],
    participantCount: number,
    roundCount: number,
    amountOfWinners: number,    
}

export interface JoinTournamentTransactionInfo extends BaseTransactionInfo {
    type: TransactionType.JOIN_TOURNAMENT,
    tournamentId: string,
    isBot?: boolean,
    botId?: string,
}

export type TransactionInfo = 
    | SendMoveTransactionInfo
    | CreateGameTransactionInfo
    | JoinGameTransactionInfo
    | DeployBotTransactionInfo
    | DepositErc20TransactionInfo
    | ApproveErc20TransactionInfo
    | ResignGameTransactionInfo
    | BotStepTransactionInfo
    | ManagerBotTransactionInfo
    | ReleaseFundsTransactionInfo
    | BetTransactionInfo
    | CreateTournamentTransactionInfo
    | JoinTournamentTransactionInfo
    | CreateChallengeTransactionsInfo
    | AcceptChallengeTransactionsInfo
    | DeclineChallengeTransactionsInfo
    | CreateBotOfferTransactionsInfo
    | AcceptBotOfferTransactionsInfo
    | DeclineBotOfferTransactionsInfo


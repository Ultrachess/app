//Notifications are 

export enum NotificationType {
    GAME_CREATED = 0, //when you create a game
    GAME_JOINED = 1, //when someone joins your game
    GAME_MOVE = 2, //when someone makes a move in your game
    GAME_COMPLETED = 3, //when a game you are in is completed
    GAME_WAGER = 4, //when someone wagers on your game or wagers in a game you wagered on
    GAME_BETTING_CLOSED = 14, //when betting is close on a game you are in or a game you wagered on

    CHALLENGE_CREATED = 5, //when you challenge someone
    CHALLENGE_ACCEPTED = 6, //when you challenge someone and they accept
    CHALLENGE_DECLINED = 7, //when you challenge someone and they decline
    CHALLENGE_RECIEVED = 8, //when someone challenges you

    TOURNAMENT_CREATED = 9, //when you create a tournament
    TOURNAMENT_JOINED = 10, //when someone joins your tournament
    TOURNAMENT_COMPLETED = 11, //when a tournament you are in is completed
    TOURNAMENT_MATCH_CREATED = 12, //when a tournament you are in creates a new match
    TOURNAMENT_MATCH_COMPLETED = 13, //when a tournament you are in completes a match
    TOURNAMENT_ROUND_COMPLETED = 15, //when a tournament you are in completes a round

    BOT_CREATED = 25, //when you create a bot
    BOT_UPDATED = 26, //when you update a bot
    BOT_GAME_CREATED = 16, //when a bot that you own creates a game
    BOT_GAME_COMPLETED = 17, //when a bot that you own completes a game
    BOT_OFFER_CREATED = 22, //when a bot that you own receives an offer
    BOT_OFFER_ACCEPTED = 23, //when a request to purchase another bot is accepted
    BOT_OFFER_DECLINED = 24, //when a request to purchase another bot is declined

    DEPOSIT_FUNDS = 27, //when you deposit funds
    WITHDRAW_FUNDS = 28, //when you withdraw funds
    
    ACTION = 15, //these refer to all action calls.
}

export interface BaseNotification {
    id: number;
    timestamp: number;
    type: NotificationType;
}

export interface GameCreatedNotification extends BaseNotification {
    type: NotificationType.GAME_CREATED;
    creatorId: string;
    gameId: string;
    wager: number;
    token: string;
}

export interface GameJoinedNotification extends BaseNotification {
    type: NotificationType.GAME_JOINED;
    gameId: string; //game that was joined
    playerId: string; //player who joined you game
}

export interface GameMoveNotification extends BaseNotification {
    type: NotificationType.GAME_MOVE;
    gameId: string;
    playerId: string;
    move: string;
}

export interface GameCompletedNotification extends BaseNotification {
    type: NotificationType.GAME_COMPLETED;
    gameId: string;
    playerId1: string;
    playerId2: string;
    score1: number;
    score2: number;
    token: string;
    pot: number;
    winningId: string;
    winningIdBettorCount: number;
    winnings1: number;
    winnings2: number;
}

export interface GameWagerNotification extends BaseNotification {
    type: NotificationType.GAME_WAGER;
    gameId: string;
    playerId: string;
    expectedWinnerId: string;
    wager: number;
    token: string;
}

export interface GameBettingClosedNotification extends BaseNotification {
    type: NotificationType.GAME_BETTING_CLOSED;
    gameId: string;
    totalPot: number;
    token: string;
}

export interface ChallengeCreatedNotification extends BaseNotification {
    type: NotificationType.CHALLENGE_CREATED;
    challengeId: string;
    sender: string;
    recipient: string;
    wager: number;
    token: string;
}

export interface ChallengeAcceptedNotification extends BaseNotification {
    type: NotificationType.CHALLENGE_ACCEPTED;
    challengeId: string;
    gameId: string; //game that was created as a result of the challenge
    sender: string;
    recipient: string;
}

export interface ChallengeDeclinedNotification extends BaseNotification {
    type: NotificationType.CHALLENGE_DECLINED;
    challengeId: string;
    sender: string;
    recipient: string;
}

export interface TournamentJoinedNotification extends BaseNotification {
    type: NotificationType.TOURNAMENT_JOINED;
    tournamentId: string;
    playerId: string;
}

export interface TournamentCompletedNotification extends BaseNotification {
    type: NotificationType.TOURNAMENT_COMPLETED;
    tournamentId: string;
}

export interface TournamentMatchCreatedNotification extends BaseNotification {
    type: NotificationType.TOURNAMENT_MATCH_CREATED;
    tournamentId: string;
    matchId: string;
    playerId1: string;
    playerId2: string;
}

export interface TournamentMatchCompletedNotification extends BaseNotification {
    type: NotificationType.TOURNAMENT_MATCH_COMPLETED;
    tournamentId: string;
    matchId: string;
    playerId1: string;
    playerId2: string;
    score1: number;
    score2: number;
}

export interface TournamentRoundCompletedNotification extends BaseNotification {
    type: NotificationType.TOURNAMENT_ROUND_COMPLETED;
    tournamentId: string;
    roundNumber: number;
}

export interface BotCreatedNotification extends BaseNotification {
    type: NotificationType.BOT_CREATED;
    botId: string;
    creatorId: string;
}

export interface BotGameCreatedNotification extends BaseNotification {
    type: NotificationType.BOT_GAME_CREATED;
    gameId: string;
    playerId1: string;
    playerId2: string;
    wager: number;
    token: string;
}

export interface BotGameCompletedNotification extends BaseNotification {
    type: NotificationType.BOT_GAME_COMPLETED;
    gameId: string;
    playerId1: string;
    playerId2: string;
    score1: number;
    score2: number;
    token: string;
    wager: number;
    pot: number;
    winningId: string;
    winningIdBettorCount: number;
    winnings1: number;
    winnings2: number;
}

export interface BotOfferCreatedNotification extends BaseNotification {
    type: NotificationType.BOT_OFFER_CREATED;
    botId: string;
    offerId: string;
    sender: string;
    owner: string;
    price: number;
    token : string;
}

export interface BotOfferAcceptedNotification extends BaseNotification {
    type: NotificationType.BOT_OFFER_ACCEPTED;
    botId: string;
    offerId: string;
    sender: string;
    owner: string;
    price: number;
    token : string;
}

export interface BotOfferDeclinedNotification extends BaseNotification {
    type: NotificationType.BOT_OFFER_DECLINED;
    botId: string;
    offerId: string;
    sender: string;
    owner: string;
    price: number;
    token : string;
}

export interface DepositFundsNotification extends BaseNotification {
    type: NotificationType.DEPOSIT_FUNDS;
    sender: string;
    amount: number;
    token: string;
}

export interface WithdrawFundsNotification extends BaseNotification {
    type: NotificationType.WITHDRAW_FUNDS;
    sender: string;
    amount: number;
    token: string;
}

export interface ActionNotification extends BaseNotification {
    type: NotificationType.ACTION;
    actionId: number;
}

export type Notification = 
    GameJoinedNotification | 
    GameMoveNotification | 
    GameCompletedNotification | 
    GameWagerNotification | 
    GameBettingClosedNotification | 
    ChallengeCreatedNotification |
    ChallengeAcceptedNotification | 
    ChallengeDeclinedNotification | 
    TournamentJoinedNotification | 
    TournamentCompletedNotification | 
    TournamentMatchCreatedNotification | 
    TournamentMatchCompletedNotification | 
    TournamentRoundCompletedNotification | 
    BotGameCreatedNotification | 
    BotGameCompletedNotification | 
    BotOfferAcceptedNotification | 
    BotOfferDeclinedNotification | 
    BotOfferCreatedNotification |
    ActionNotification;



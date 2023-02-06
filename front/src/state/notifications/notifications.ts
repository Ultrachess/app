export enum NotificationType {
    GAME_JOINED = 1, //when someone joins your game
    GAME_MOVE = 2, //when someone makes a move in your game
    GAME_COMPLETED = 3, //when a game you are in is completed
    GAME_WAGER = 4, //when someone wagers on your game or wagers in a game you wagered on
    GAME_BETTING_CLOSED = 14, //when betting is close on a game you are in or a game you wagered on

    CHALLENGE_ACCEPTED = 6, //when you challenge someone and they accept
    CHALLENGE_DECLINED = 7, //when you challenge someone and they decline
    CHALLENGE_RECIEVED = 8, //when someone challenges you

    TOURNAMENT_JOINED = 10, //when someone joins your tournament
    TOURNAMENT_COMPLETED = 11, //when a tournament you are in is completed
    TOURNAMENT_MATCH_CREATED = 12, //when a tournament you are in creates a new match
    TOURNAMENT_MATCH_COMPLETED = 13, //when a tournament you are in completes a match
    TOURNAMENT_ROUND_COMPLETED = 15, //when a tournament you are in completes a round

    BOT_GAME_CREATED = 16, //when a bot that you own creates a game
    BOT_GAME_COMPLETED = 17, //when a bot that you own completes a game
    BOT_JOINED_TOURNAMENT = 18, //when a bot that you own joins a tournament
    BOT_TOURNAMENT_MATCH_COMPLETED = 19, //when a bot that you own completes a tournament match
    BOT_TOURNAMENT_ROUND_COMPLETED = 20, //when a bot that you own completes a tournament round
    BOT_TOURNAMENT_COMPLETED = 21, //when a bot that you own completes a tournament
    BOT_OFFER_RECEIVED = 22, //when a bot that you own receives an offer
    BOT_OFFER_ACCEPTED = 23, //when a request to purchase another bot is accepted
    BOT_OFFER_DECLINED = 24, //when a request to purchase another bot is declined
    
    ACTION = 15, //these refer to all action calls.
}

export interface BaseNotification {
    id: number;
    timestamp: number;
    type: NotificationType;
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
    score: number;
    opponentId: string;
    token: string;
    pot: number;
    winningId: string;
    winningIdBettorCount: number;
}

export interface GameWagerNotification extends BaseNotification {
    type: NotificationType.GAME_WAGER;
    gameId: string;
    playerId: string;
    wager: number;
    token: string;
}

export interface GameBettingClosedNotification extends BaseNotification {
    type: NotificationType.GAME_BETTING_CLOSED;
    gameId: string;
}

export interface ChallengeAcceptedNotification extends BaseNotification {
    type: NotificationType.CHALLENGE_ACCEPTED;
    challengeId: string;
    playerId: string;
    gameId: string; //game that was created as a result of the challenge
}

export interface ChallengeDeclinedNotification extends BaseNotification {
    type: NotificationType.CHALLENGE_DECLINED;
    challengeId: string;
    playerId: string;
}

export interface ChallengeRecievedNotification extends BaseNotification {
    type: NotificationType.CHALLENGE_RECIEVED;
    challengeId: string;
    playerId: string;
    wager: number;
    token: string;
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
    player1Id: string;
    player2Id: string;
}

export interface TournamentMatchCompletedNotification extends BaseNotification {
    type: NotificationType.TOURNAMENT_MATCH_COMPLETED;
    tournamentId: string;
    matchId: string;
    player1Id: string;
    player2Id: string;
    player1Score: number;
    player2Score: number;
}

export interface TournamentRoundCompletedNotification extends BaseNotification {
    type: NotificationType.TOURNAMENT_ROUND_COMPLETED;
    tournamentId: string;
    roundNumber: number;
}

export interface BotGameCreatedNotification extends BaseNotification {
    type: NotificationType.BOT_GAME_CREATED;
    gameId: string;
    botId: string;
    wager: number;
    token: string;
}

export interface BotGameCompletedNotification extends BaseNotification {
    type: NotificationType.BOT_GAME_COMPLETED;
    gameId: string;
    botId: string;
    opponentId: string;
    score: number;
    token: string;
    wager: number;
    pot: number;
    winningId: string;
    winningIdBettorCount: number;
}

export interface BotJoinedTournamentNotification extends BaseNotification {
    type: NotificationType.BOT_JOINED_TOURNAMENT;
    tournamentId: string;
    botId: string;
}

export interface BotTournamentMatchCompletedNotification extends BaseNotification {
    type: NotificationType.BOT_TOURNAMENT_MATCH_COMPLETED;
    tournamentId: string;
    matchId: string;
    botId: string;
    opponentId: string;
    score: number;
    totalScore: number;
}

export interface BotTournamentRoundCompletedNotification extends BaseNotification {
    type: NotificationType.BOT_TOURNAMENT_ROUND_COMPLETED;
    tournamentId: string;
    roundNumber: number;
    botId: string;
    totalScore: number;
}

export interface BotTournamentCompletedNotification extends BaseNotification {
    type: NotificationType.BOT_TOURNAMENT_COMPLETED;
    tournamentId: string;
    botId: string;
    placement: number;
    totalScore: number;
}

export interface BotOfferReceivedNotification extends BaseNotification {
    type: NotificationType.BOT_OFFER_RECEIVED;
    botId: string;
    offerId: string;
    from: string;
    price: number;
    token : string;
}

export interface BotOfferAcceptedNotification extends BaseNotification {
    type: NotificationType.BOT_OFFER_ACCEPTED;
    botId: string;
    offerId: string;
    acceptor: string;
    price: number;
    token : string;
}

export interface BotOfferDeclinedNotification extends BaseNotification {
    type: NotificationType.BOT_OFFER_DECLINED;
    botId: string;
    offerId: string;
    decliner: string;
    price: number;
    token : string;
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
    ChallengeAcceptedNotification | 
    ChallengeDeclinedNotification | 
    ChallengeRecievedNotification | 
    TournamentJoinedNotification | 
    TournamentCompletedNotification | 
    TournamentMatchCreatedNotification | 
    TournamentMatchCompletedNotification | 
    TournamentRoundCompletedNotification | 
    BotGameCreatedNotification | 
    BotGameCompletedNotification | 
    BotJoinedTournamentNotification | 
    BotTournamentMatchCompletedNotification | 
    BotTournamentRoundCompletedNotification | 
    BotTournamentCompletedNotification | 
    BotOfferReceivedNotification | 
    BotOfferAcceptedNotification | 
    BotOfferDeclinedNotification | 
    ActionNotification;



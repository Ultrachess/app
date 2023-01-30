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
    
    ACTION = 15, //these refer to all action calls.
}

export interface Notification {
    timestamp: number;
    type: NotificationType;
}

export interface GameJoinedNotification extends Notification {
    type: NotificationType.GAME_JOINED;
    gameId: string;
    playerId: string;
}

export interface GameMoveNotification extends Notification {
    type: NotificationType.GAME_MOVE;
    gameId: string;
    playerId: string;
    move: string;
}

export interface GameCompletedNotification extends Notification {
    type: NotificationType.GAME_COMPLETED;
    gameId: string;
}

export interface GameWagerNotification extends Notification {
    type: NotificationType.GAME_WAGER;
    gameId: string;
    playerId: string;
    wager: number;
    token: string;
}

export interface GameBettingClosedNotification extends Notification {
    type: NotificationType.GAME_BETTING_CLOSED;
    gameId: string;
}

export interface ChallengeAcceptedNotification extends Notification {
    type: NotificationType.CHALLENGE_ACCEPTED;
    challengeId: string;
    fromPlayerId: string;
    toPlayerId: string;
}

export interface ChallengeDeclinedNotification extends Notification {
    type: NotificationType.CHALLENGE_DECLINED;
    challengeId: string;
    fromPlayerId: string;
    toPlayerId: string;

}

export interface ChallengeRecievedNotification extends Notification {
    type: NotificationType.CHALLENGE_RECIEVED;
    challengeId: string;
    fromPlayerId: string;
    toPlayerId: string;
    wager: number;
    token: string;
}

export interface TournamentJoinedNotification extends Notification {
    type: NotificationType.TOURNAMENT_JOINED;
    tournamentId: string;
    playerId: string;
}

export interface TournamentCompletedNotification extends Notification {
    type: NotificationType.TOURNAMENT_COMPLETED;
    tournamentId: string;
}

export interface TournamentMatchCreatedNotification extends Notification {
    type: NotificationType.TOURNAMENT_MATCH_CREATED;
    tournamentId: string;
    matchId: string;
}

export interface TournamentMatchCompletedNotification extends Notification {
    type: NotificationType.TOURNAMENT_MATCH_COMPLETED;
    tournamentId: string;
    matchId: string;
}

export interface TournamentRoundCompletedNotification extends Notification {
    type: NotificationType.TOURNAMENT_ROUND_COMPLETED;
    tournamentId: string;
    roundNumber: number;
}

export interface ActionNotification extends Notification {
    type: NotificationType.ACTION;
    actionId: string;
}



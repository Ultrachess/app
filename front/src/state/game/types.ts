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
  id: number;
  type: ActionType;
  transactionInfo: TransactionInfo;
  status?: ActionStates;
  transactionHash?: string;
  timeStamp?: string;
  result?: NoticeInfo;
  processedTime?: number;
  initTime: number;
}

export type ActionList = {
  [actionId: string]: Action;
};

export interface Bet {
  sender: string;
  timestamp: number;
  gameId: string;
  tokenAddress: string;
  amount: number;
  winningId: number;
}

export interface GameWagers {
  gameId: string;
  openTime: number;
  duration: number;
  bets: {
    [winningId: string]: {
      [playerId: string]: Bet;
    };
  };
  pots: {
    [winningId: string]: number;
  };
  totalPot: number;
  betsArray: Bet[];
}

export interface BotMoveStats {
  depth: number;
  seldepth: number;
  time: number;
  nodes: number;
  pv: string[];
  score: number;
  nps: number;
  tbhits: number;
  sbhits: number;
  cpuload: number;
}

export interface Game {
  id: string;
  players: string[];
  pgn: string;
  isBot: boolean;
  isEnd: boolean;
  matchCount: number;
  wagerAmount: number;
  token: string;
  timestamp: number;
  resigner: string;
  scores: { [playerId: string]: number };
  bettingDuration: number;
  wagering: GameWagers;
  botMoveStats: BotMoveStats[];
}

//enum of all countries
export enum Country {
  FRANCE,
  GERMANY,
  ITALY,
  SPAIN,
  UK,
  USA,
  CHINA,
  JAPAN,
  KOREA,
  INDIA,
  BRAZIL,
  MEXICO,
  CANADA,
  AUSTRALIA,
  RUSSIA,
  TURKEY,
  NETHERLANDS,
  BELGIUM,
  SWITZERLAND,
}

export interface Challenge {
  id: string;
  sender: string;
  recipient: string;
  token: string;
  wager: number;
  timestamp: number;
}

export interface BotOffer {
  offerId: string;
  botId: string;
  sender: string;
  owner: string;
  token: string;
  price: number;
  timestamp: number;
}

export interface Balance {
  token: string;
  amount: number;
}

export enum ProfileType {
  HUMAN,
  BOT,
}

export interface BaseProfile {
  type: ProfileType;
  id: string;
  name: string;
  avatar: string;
  elo: number;
  games: Game[];
  nationality: string;
  challenges: Challenge[];
}

export interface UserProfile extends BaseProfile {
  balances: Balance[];
  bots: BotProfile[];
}

export interface BotProfile extends BaseProfile {
  owner: string;
  offers: BotOffer[];
  autoBattleEnabled: boolean;
  autoMaxWagerAmount: number;
  autoWagerTokenAddress: string;
  timestamp: number;
}

export type Profile = UserProfile | BotProfile;

export enum TournamentType {
  KNOCKOUT = "Knockout",
}

export interface TournamentMatch {
  games: string[];
  matchCount: number;
  currentMatch: number;
  left: string;
  right: string;
  leftScore: number;
  rightScore: number;
}

export interface TournamentRound {
  matches: TournamentMatch[];
}

export interface Tournament {
  id: string;
  type: TournamentType;
  rounds: number;
  amountOfWinners: number;
  participantCount: number;
  participants: string[];
  owner: string;
  currentRound: number;
  matches: TournamentRound[];
  isOver: boolean;
  isRoundOver: boolean;
}

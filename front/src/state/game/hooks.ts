/*
 * Copyright (C) 2022-2023 Ultrachess team
 * This file is part of Ultrachess - https://github.com/Ultrachess/app
 *
 * SPDX-License-Identifier: Apache-2.0
 * See the file LICENSE for more information.
 */

import { TransactionResponse } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import { delay } from "./updater";

import { TransactionInfo, TransactionType } from "../../common/types";
import { CHAINS } from "../../ether/chains";
import { CONTRACTS } from "../../ether/contracts";
import { useContract } from "../../hooks/contract";
import { appendNumberToUInt8Array, getErc20Contract } from "../../utils";
import {
  addAction,
  setAction,
  setActionTransactionHash,
} from "../actions/reducer";
import { useAppSelector } from "../hooks";
import {
  ActionNotification,
  NotificationType,
} from "../notifications/notifications";
import { addNotification } from "../notifications/reducer";
import { useTransactionAdder } from "../transactions/hooks";
import { createPromise } from "./gameHelper";
import { DAPP_ADDRESSES } from "./gameSlice";
import {
  Action,
  ActionList,
  ActionStates,
  ActionType,
  Balance,
  BaseProfile,
  Bet,
  BotOffer,
  BotProfile,
  Challenge,
  Game,
  Profile,
  ProfileType,
  Throne,
  Tournament,
  TournamentType,
  UserProfile,
} from "./types";
import { ActionResolverObject } from "./updater";

export function useNationality(id): string {
  return "US";
}

export function useAvatarImgUrl(id): string {
  return id;
}

export function useName(id): string {
  return id;
}

export function useBalances(id: string): Balance[] {
  const accounts: { [address: string]: { [token: string]: number } } =
    useAppSelector((state) => state.game.accounts);
  if (!id || !accounts[id]) return [];
  const tokenAddresses = Object.keys(accounts[id]);
  const amounts = Object.values(accounts[id]);
  return tokenAddresses.map((val, index) => {
    return {
      token: val,
      amount: amounts[index] / 10 ** 18, // convert balance to correct value
    };
  });
}

export function useElo(id): number {
  const elos = useAppSelector((state) => state.game.elo);
  return elos[id] ? elos[id] : 0;
}

const PLACE_HOLDER_PROFILE: Profile = {
  type: ProfileType.HUMAN,
  id: "",
  name: "",
  avatar: "",
  elo: 0,
  games: [],
  nationality: "",
  challenges: [],
  balances: [],
  bots: [],
};

const PLACE_HOLDER_TOURNAMENT: Tournament = {
  id: "",
  type: TournamentType.KNOCKOUT,
  rounds: 0,
  amountOfWinners: 1,
  participantCount: 0,
  participants: [],
  owner: "",
  currentRound: 0,
  matches: [],
  isOver: false,
  isRoundOver: false,
};

const PLACE_HOLDER_GAME: Game = {
  id: "",
  pgn: "",
  players: [],
  isBot: false,
  isEnd: false,
  matchCount: 0,
  wagerAmount: 0,
  token: "",
  timestamp: 0,
  resigner: "",
  scores: {},
  bettingDuration: 0,
  wagering: {
    gameId: "",
    openTime: 0,
    duration: 0,
    bets: {},
    pots: {},
    totalPot: 0,
    betsArray: [],
  },
  botMoveStats: [],
};

const PLACE_HOLDER_THRONE: Throne = {
  king: "",
  winnings: 0,
  battles: {},
  price: 0,
  token: "",
  gamesToWin: 0,
  maxTrys: 0,
};

export function useBalance(id: string, tokenAddress: string): number {
  const accounts: { [address: string]: { [token: string]: number } } =
    useAppSelector((state) => state.game.accounts);
  if (!id || !tokenAddress || !accounts) return 0;
  if (!accounts[id.toLowerCase()]) return 0;
  const balance = accounts[id.toLowerCase()][tokenAddress.toLowerCase()] ?? 0;
  return balance / 10 ** 18;
}

export function useProfile(id: string, bots: any = []): Profile | undefined {
  const isBot = !id.includes("0x");

  // common
  const type = isBot ? ProfileType.BOT : ProfileType.HUMAN;
  const nameDefault = useName(id);
  const avatar = useAvatarImgUrl(id);
  const elo = useElo(id);
  const nationality = useNationality(id);
  const games = useUserGames(id);
  const challenges = useRecievedChallenges(id);

  // bot only
  const {
    owner,
    autoBattleEnabled,
    autoMaxWagerAmount,
    autoWagerTokenAddress,
    timestamp,
    name,
  } = bots[id]
    ? bots[id]
    : {
        owner: "",
        autoBattleEnabled: false,
        autoMaxWagerAmount: 0,
        autoWagerTokenAddress: "",
        timestamp: 0,
        name: "",
      };
  const offers = bots[id] ? useOffersByBotId(id) : [];

  // human only
  const balances = useBalances(id);
  const userBots = useUserBots(id);

  // return the correct profile type
  const profile: Profile = isBot
    ? {
        type,
        id,
        name,
        avatar,
        elo,
        nationality,
        games,
        owner,
        autoBattleEnabled,
        autoMaxWagerAmount,
        autoWagerTokenAddress,
        offers,
        challenges,
        timestamp,
      }
    : {
        type,
        id,
        name: nameDefault,
        avatar,
        elo,
        nationality,
        games,
        balances,
        bots: userBots,
        challenges,
      };
  return profile;
}

export function useThrone(): Throne {
  const throne = useAppSelector((state) => state.game.throne);
  console.log("throne", throne);
  if (!throne) return PLACE_HOLDER_THRONE;
  return throne;
}

//get all bot profiles
export function useAllBots(): BotProfile[] {
  const games: { [gameIds: string]: Game } = useAppSelector(
    (state) => state.game.games
  );
  const elos = useAppSelector((state) => state.game.elo);
  const botBaseVals: {
    [botIds: string]: {
      id: string;
      name: string;
      owner: string;
      autoBattleEnabled: boolean;
      autoMaxWagerAmount: number;
      autoWagerTokenAddress: string;
      timestamp: number;
    };
  } = useAppSelector((state) => state.game.bots);
  const offers: { [offerIds: string]: BotOffer } = useAppSelector(
    (state) => state.game.marketplace
  );
  const challenges: { [challengeIds: string]: Challenge } = useAppSelector(
    (state) => state.game.challenges
  );
  if (!challenges) return [];
  return Object.values(botBaseVals).map((val) => {
    return {
      type: ProfileType.BOT,
      id: val.id,
      name: val.name,
      avatar: val.id,
      elo: elos[val.id],
      nationality: "US",
      games: Object?.values(games).filter((game) => {
        return game.players.includes(val.id);
      }),
      owner: val.owner,
      autoBattleEnabled: val.autoBattleEnabled,
      autoMaxWagerAmount: val.autoMaxWagerAmount,
      autoWagerTokenAddress: val.autoWagerTokenAddress,
      offers: Object?.values(offers).filter((offer) => {
        return offer.botId.toLowerCase() == val.id.toLowerCase();
      }),
      challenges: Object?.values(challenges)?.filter((challenge) => {
        return challenge.recipient.toLowerCase() == val.id.toLowerCase();
      }),
      timestamp: val.timestamp,
    };
  });
}

//get all user profiles
//similar to useAllBots
export function useAllUsers(): UserProfile[] {
  const games: { [gameIds: string]: Game } = useAppSelector(
    (state) => state.game.games
  );
  const elos = useAppSelector((state) => state.game.elo);
  const users = useAppSelector((state) => state.game.accounts);
  const userIds = Object.keys(users);
  const challenges: { [challengeIds: string]: Challenge } = useAppSelector(
    (state) => state.game.challenges
  );
  const balances = useAppSelector((state) => state.game.accounts);
  const bots: { [botIds: string]: BotProfile } = useAppSelector(
    (state) => state.game.bots
  );
  if (!challenges) return [];
  return Object.keys(users).map((val) => {
    return {
      type: ProfileType.HUMAN,
      id: val,
      name: "",
      avatar: "",
      elo: elos[val],
      nationality: "US",
      games: Object?.values(games).filter((game) => {
        return game.players.includes(val.toLowerCase());
      }),
      balances: balances[val],
      bots: Object?.values(bots).filter((bot) => {
        //console.log("abc account ", bot.owner, id)
        return bot.owner.toLowerCase() == val.toLowerCase();
      }),
      challenges: Object?.values(challenges)?.filter((challenge) => {
        return challenge.recipient.toLowerCase() == val.toLowerCase();
      }),
    };
  });
}

export function useAllProfiles(rankByElo = false): BaseProfile[] {
  const bots = useAllBots();
  const users = useAllUsers();
  let profiles = [...bots, ...users];
  if (rankByElo) {
    profiles = profiles.sort((a, b) => {
      return b.elo - a.elo;
    }).filter((profile) => {
      return profile.elo > 0;
    });
  }
  return profiles;
}

export function useGame(id): Game {
  const games = useAppSelector((state) => state.game.games);
  if (!games) return PLACE_HOLDER_GAME;
  if (!games[id]) return PLACE_HOLDER_GAME;
  if (!games[id].botMoveStats) games[id].botMoveStats = [];
  return games[id];
}
export function useActions(): ActionList {
  const actions = useAppSelector((state) => state.actions);
  if (!actions) return {};
  return actions;
}

export function useUserGames(id: string): Game[] {
  const games: { [gameIds: string]: Game } = useAppSelector(
    (state) => state.game.games
  );
  if (!games) return [];
  return Object?.values(games).filter((game) => {
    return game.players.includes(id);
  });
}

export function useRecievedChallenges(id: string): Challenge[] {
  const challenges: { [challengeIds: string]: Challenge } = useAppSelector(
    (state) => state.game.challenges
  );
  if (!challenges) return [];
  return Object?.values(challenges)?.filter((challenge) => {
    return challenge.recipient == id;
  });
}

export function useUserSentChallenges(id: string): Challenge[] {
  const challenges: { [challengeIds: string]: Challenge } = useAppSelector(
    (state) => state.game.challenges
  );
  if (!challenges) return [];
  return Object?.values(challenges).filter((challenge) => {
    return challenge.sender == id;
  });
}

export function useUserBotOffers(id: string): BotOffer[] {
  const offers: { [offerIds: string]: BotOffer } = useAppSelector(
    (state) => state.game.marketplace
  );
  if (!offers) return [];
  return Object?.values(offers).filter((offer) => {
    return offer.owner == id;
  });
}

export function useOffersByBotId(id: string): BotOffer[] {
  const offers: { [offerIds: string]: BotOffer } = useAppSelector(
    (state) => state.game.marketplace
  );
  if (!offers) return [];
  return Object?.values(offers).filter((offer) => {
    return offer.botId == id;
  });
}

export function useAllActiveAndCompletedGamesSeparated(): {
  activeGames: Game[];
  completedGames: Game[];
} {
  const games: { [gameIds: string]: Game } = useAppSelector(
    (state) => state.game.games
  );
  if (!games) return { activeGames: [], completedGames: [] };
  const activeGames: Game[] = [];
  const completedGames: Game[] = [];
  Object?.values(games).forEach((game) => {
    if (game.isEnd) {
      completedGames.push(game);
    } else {
      activeGames.push(game);
    }
  });
  return { activeGames, completedGames };
}

export function useAllActiveGames(): Game[] {
  const games: { [gameIds: string]: Game } = useAppSelector(
    (state) => state.game.games
  );
  if (!games) return [];
  return Object?.values(games)?.filter((game) => {
    return !game.isEnd;
  });
}

export function useAllCompletedGames(): Game[] {
  const games: { [gameIds: string]: Game } = useAppSelector(
    (state) => state.game.games
  );
  if (!games) return [];
  return Object?.values(games).filter((game) => {
    return game.isEnd;
  });
}

//return list of games that you are in and are not completed
export function useUserGameIds(id: string = ""): string[] {
  const games = useAppSelector((state) => state.game.games);
  if (!games) return [];
  return Object.keys(games).filter((gameId) => {
    const game = games[gameId];
    return game.players.includes(id);
  });
}

export function useUserOwnedGameIds(id: string = ""): string[] {
  const games = useAppSelector((state) => state.game.games);
  if (!games) return [];
  return Object.keys(games).filter((gameId) => {
    const game = games[gameId];
    if (game.players.length == 0) return false;
    return game.players[0].toLowerCase() == id.toLowerCase();
  });
}

export function useUserCompletedGameIds(id: string = ""): string[] {
  const games = useAppSelector((state) => state.game.games);
  if (!games) return [];
  return Object.keys(games).filter((gameId) => {
    const game = games[gameId];
    return game.players.includes(id) && game.isEnd;
  });
}

export function useUserActiveGameIds(id: string = ""): string[] {
  const games = useAppSelector((state) => state.game.games);
  if (!games) return [];
  //return all as lowercase
  const gamesToReturn = Object.keys(games)
    .filter((gameId) => {
      const game = games[gameId];
      const lower_case_players = game.players.map((player) => {
        return player.toLowerCase();
      });
      return lower_case_players.includes(id.toLowerCase()) && !game.isEnd;
    })
    .map((gameId) => {
      return gameId.toLowerCase();
    });
  return gamesToReturn;
}

export function useTournament(id): Tournament | undefined {
  const tournaments: Tournament[] = useAppSelector(
    (state) => state.game.tournaments
  );
  console.log("tournaments", tournaments);
  if (!tournaments) return undefined;
  //check if tournaments is an array
  if (!Array.isArray(tournaments)) return undefined;
  if (tournaments.length == 0) return undefined;
  const tournament = tournaments.find((tournament) => {
    return tournament.id.toLowerCase() == id.toLowerCase();
  });
  return tournament;
}

export function useAllTournaments(): Tournament[] {
  const tournaments: Tournament[] = useAppSelector(
    (state) => state.game.tournaments
  );
  if (!tournaments) return [];
  console.log("tournaments", tournaments);
  return Object?.values(tournaments);
}

export function useUserBots(id: string): BotProfile[] {
  const bots: { [botIds: string]: BotProfile } = useAppSelector(
    (state) => state.game.bots
  );
  if (!bots) return [];
  return Object?.values(bots).filter((bot) => {
    //console.log("abc account ", bot.owner, id)
    return bot.owner.toLowerCase() == id.toLowerCase();
  });
}

export function useOwner(id: string): string | undefined {
  const bots: { [botIds: string]: BotProfile } = useAppSelector(
    (state) => state.game.bots
  );
  if (!bots) return undefined;
  return bots[id] ? bots[id].owner : undefined;
}

//return list of all bots you own
export function useUserBotIds(id: string): string[] {
  const bots = useAppSelector((state) => state.game.bots);
  if (!bots) return [];
  return Object.keys(bots).filter((botId) => {
    const bot = bots[botId];
    //console.log("new abc account ", bot.owner, id)
    //console.log("new abc account bool", bot.owner.toLowerCase() == id.toLowerCase())
    return bot.owner.toLowerCase() == id.toLowerCase();
  });
}

//return list of all games your bots are in
export function useUserBotGameIds(id: string): string[] {
  const bots = useUserBotIds(id);
  const games = useAppSelector((state) => state.game.games);
  if (!games) return [];
  if (!bots) return [];
  return Object.keys(games).filter((gameId) => {
    const game = games[gameId];
    return bots.some((botId) => game.players.includes(botId));
  });
}

//return list of all tournaments you are in or own
export function useUserTournamentIds(id: string): string[] {
  const tournaments = useAppSelector((state) => state.game.tournaments);
  if (!tournaments) return [];
  return Object.keys(tournaments).filter((tournamentId) => {
    const tournament = tournaments[tournamentId];
    return tournament?.participants?.includes(id) || tournament.owner == id;
  });
}

//return list of all tournaments your bots are in
export function useUserBotTournamentIds(id: string): string[] {
  const bots = useUserBotIds(id);
  const tournaments = useAppSelector((state) => state.game.tournaments);
  if (!tournaments) return [];
  if (!bots) return [];
  return Object.keys(tournaments).filter((tournamentId) => {
    const tournament = tournaments[tournamentId];
    return bots.some((botId) => tournament.participants.includes(botId));
  });
}

//return list of wagers in a game
export function useGameWagers(gameId: string, playerId: string): Bet[] {
  const game = useGame(gameId);
  if (!game) return [];
  return Object?.values(game.wagering.bets[playerId]);
}

export function useActionsNotProcessed(): Action[] {
  const actions = useActions();
  return useMemo(() => {
    return Object?.values(actions).filter(
      ({ status }) =>
        status != ActionStates.PROCESSED && status != ActionStates.ERROR
    );
  }, [actions]);
}

export function useAction(actionId: number): Action {
  const actions = useActions();
  return actions[actionId];
}



export function useWaitForAction(): (actionId: number) => Promise<Action> {
  const actions = useActions();
  return useCallback(
    (actionId: number) => {
      const action = actions[actionId];
      const waitToResolve = async (): Promise<Action> => {
        while (action.status != ActionStates.PROCESSED) {
          await delay(100);
          await waitToResolve();
        }
        return action;
      };
      return waitToResolve();
    },
    [actions]
  );
}

export function useAddAction(): (action: Action) => number {
  const dispatch = useDispatch();

  return useCallback(
    (action: Action) => {
      dispatch(addAction(action));

      // Add notification
      const notification: ActionNotification = {
        id: action.id,
        timestamp: action.initTime,
        type: NotificationType.ACTION,
        actionId: action.id,
      };
      dispatch(addNotification(notification));

      //console.log(action.id.toString())
      return action.id;
    },
    [dispatch]
  );
}

// Convert a hex string to a byte array
function hexToBytes(hex) {
  for (var bytes = [], c = 0; c < hex.length; c += 2)
    bytes.push(parseInt(hex.substr(c, 2), 16));
  return bytes;
}

export function useActionCreator(): (
  info: TransactionInfo
) => Promise<[Action, Promise<string>]> {
  const { chainId, provider, account } = useWeb3React();

  // Get network name
  const CHAIN = CHAINS[chainId];
  const networkName =
    CHAIN && CHAIN.networkName ? CHAIN.networkName : "localhost";

  // Fetch abi list
  const contracts = CONTRACTS[networkName];
  const abis =
    contracts && contracts.InputFacet && contracts.ERC20PortalFacet
      ? contracts
      : CONTRACTS.localhost;

  //Fetch dapp address
  const dappAddress = DAPP_ADDRESSES[networkName] ?? DAPP_ADDRESSES.localhost;
  //console.log("dappAddress: ", dappAddress)
  const dispatch = useDispatch();
  const addAction = useAddAction();
  const addTransaction = useTransactionAdder();
  // TODO: Handle DAPP_ADDRESSES[networkName] or CONTRACTS[networkName] not defined
  const contract = useContract(dappAddress, abis.InputFacet.abi);
  const erc20PortalContract = useContract(
    dappAddress,
    abis.ERC20PortalFacet.abi
  );

  return useCallback(
    async (info: TransactionInfo) => {
      let input: Uint8Array;
      let result: TransactionResponse;
      let id: number = Math.floor(Math.random() * 90000);
      //console.log(`actionId: ${id}`)
      //console.log(`actionId hex ${decimalToHexString(id)}`)
      let action: Action;
      addAction({
        id: id,
        type:
          info.type == TransactionType.APPROVE_ERC20 ||
          info.type == TransactionType.DEPOSIT_ERC20
            ? ActionType.TRANSACTION
            : ActionType.INPUT,
        transactionInfo: info,
        status: ActionStates.INITIALIZED,
        initTime: new Date().getTime(),
      });
      try {
        switch (info.type) {
          case TransactionType.BOT_STEP:
            const { hash } = info;
            input = ethers.utils.toUtf8Bytes(`{
                        "op": "botStep", 
                        "value": "${hash}"
                    }`);
            input = appendNumberToUInt8Array(id, input);
            result = await contract.addInput(input);
            break;
          case TransactionType.RELEASE_FUNDS:
            const { tokenAddress } = info;
            input = ethers.utils.toUtf8Bytes(`{
                        "op": "releaseFunds", 
                        "value": "${tokenAddress}"
                    }`);
            input = appendNumberToUInt8Array(id, input);
            result = await contract.addInput(input);
            break;
          case TransactionType.MANAGER_BOT_INPUT:
            const {
              autoBattleEnabled,
              autoMaxWagerAmount,
              autoWagerTokenAddress,
              botId,
            } = info;
            input = ethers.utils.toUtf8Bytes(`{
                        "op": "manageBot", 
                        "value": {
                            "name" : "${info.name}",
                            "autoBattleEnabled": ${autoBattleEnabled},
                            "autoWagerTokenAddress" : "${autoWagerTokenAddress}",
                            "autoMaxWagerAmount": ${autoMaxWagerAmount ?? 0},
                            "botId": "${botId}"
                        }
                    }`);
            input = appendNumberToUInt8Array(id, input);
            result = await contract.addInput(input);
            break;
          case TransactionType.CREATE_GAME_INPUT:
            const {
              name,
              isBot,
              wagerAmount,
              wagerTokenAddress,
              botId1,
              botId2,
              playerId,
              bettingDuration,
            } = info;
            input = ethers.utils.toUtf8Bytes(`{
                        "op": "create", 
                        "value": {
                            "name" : "${name}",
                            "isBot" : ${isBot},
                            "botId1" : "${botId1 ?? "blank"}",
                            "botId2" : "${botId2 ?? "blank"}",
                            "playerId" : "${playerId ?? "blank"}",
                            "token" : "${wagerTokenAddress}",
                            "wagerAmount" : ${wagerAmount},
                            "bettingDuration" : ${bettingDuration ?? "0"}
                        }
                    }`);
            input = appendNumberToUInt8Array(id, input);
            result = await contract.addInput(input);
            break;
          case TransactionType.BET_INPUT:
            input = ethers.utils.toUtf8Bytes(`{
                        "op": "bet", 
                        "value": {
                            "gameId" : "${info.gameId}",
                            "tokenAddress" : "${info.tokenAddress}",
                            "amount" : ${info.amount},
                            "winningId" : "${info.winningId}"
                        }
                    }`);
            input = appendNumberToUInt8Array(id, input);
            result = await contract.addInput(input);
            break;
          case TransactionType.CREATE_TOURNAMENT:
            const {
              tourneyType,
              participants,
              participantCount,
              roundCount,
              amountOfWinners,
            } = info;
            input = ethers.utils.toUtf8Bytes(`{
                        "op": "createTourney", 
                        "value": {
                            "type" : "${tourneyType}",
                            "participants" : ${JSON.stringify(participants)},
                            "participant_count": ${participantCount},
                            "round_count": ${roundCount},
                            "amount_of_winners": ${amountOfWinners}
                        }
                    }`);
            input = appendNumberToUInt8Array(id, input);
            result = await contract.addInput(input);
            break;
          case TransactionType.JOIN_TOURNAMENT:
            input = ethers.utils.toUtf8Bytes(`{
                        "op": "joinTourney", 
                        "value": {
                            "tournament_id": "${info.tournamentId}",
                            "participant_id" : "${info.participant_id ?? false}"
                        }
                    }`);
            input = appendNumberToUInt8Array(id, input);
            result = await contract.addInput(input);
            break;
          case TransactionType.SEND_MOVE_INPUT:
            let { value, roomId } = info;
            input = ethers.utils.toUtf8Bytes(`{
                        "op": "move", 
                        "value": {
                            "roomId" : "${roomId}",
                            "move" : "${value}"
                        }
                    }`);
            input = appendNumberToUInt8Array(id, input);
            result = await contract.addInput(input);
            break;
          case TransactionType.JOIN_GAME_INPUT:
            const roomId1 = info.roomId;
            input = ethers.utils.toUtf8Bytes(`{
                        "op": "join", 
                        "value": "${roomId1}"
                    }`);
            input = appendNumberToUInt8Array(id, input);
            result = await contract.addInput(input);
            break;
          case TransactionType.CREATE_CHALLENGE:
            input = ethers.utils.toUtf8Bytes(`{
                        "op": "createChallenge", 
                        "value": {
                            "recipient" : "${info.recipient}",
                            "challenger" : "${info.challenger}",
                            "wager" : ${info.wager},
                            "token": "${info.token}"
                        }
                    }`);
            input = appendNumberToUInt8Array(id, input);
            result = await contract.addInput(input);
            break;
          case TransactionType.ACCEPT_CHALLENGE:
            input = ethers.utils.toUtf8Bytes(`{
                        "op": "acceptChallenge", 
                        "value": "${info.challengeId}"
                    }`);
            input = appendNumberToUInt8Array(id, input);
            result = await contract.addInput(input);
            break;
          case TransactionType.DECLINE_CHALLENGE:
            input = ethers.utils.toUtf8Bytes(`{
                        "op": "declineChallenge", 
                        "value": "${info.challengeId}"
                    }`);
            input = appendNumberToUInt8Array(id, input);
            result = await contract.addInput(input);
            break;
          case TransactionType.CREATE_OFFER:
            console.log("create offer");
            input = ethers.utils.toUtf8Bytes(`{
                        "op": "createBotOffer", 
                        "value": {
                            "botId" : "${info.botId}",
                            "price" : ${info.price},
                            "token": "${info.tokenAddress}"
                        }
                    }`);
            input = appendNumberToUInt8Array(id, input);
            result = await contract.addInput(input);
            break;
          case TransactionType.ACCEPT_OFFER:
            input = ethers.utils.toUtf8Bytes(`{
                        "op": "acceptBotOffer", 
                        "value": "${info.offerId}"
                    }`);
            input = appendNumberToUInt8Array(id, input);
            result = await contract.addInput(input);
            break;
          case TransactionType.DECLINE_OFFER:
            input = ethers.utils.toUtf8Bytes(`{
                        "op": "declineBotOffer", 
                        "value": "${info.offerId}"
                    }`);
            input = appendNumberToUInt8Array(id, input);
            result = await contract.addInput(input);
            break;
          case TransactionType.KING_THRONE_CHALLENGE:
            input = ethers.utils.toUtf8Bytes(`{
                        "op": "kingThroneChallenge",
                        "value": {
                            "challenger" : "${info.challenger}"
                        }
                    }`);
            input = appendNumberToUInt8Array(id, input);
            result = await contract.addInput(input);
            break;
          case TransactionType.KING_THRONE_UPDATE:
            input = ethers.utils.toUtf8Bytes(`{
                        "op": "kingThroneUpdate",
                        "value": {
                            "numberOfTrys": ${info.numberOfTrys},
                            "numberOfWins": ${info.numberOfWins},
                            "price" : ${info.price},
                            "token": "${info.token}"
                        }
                    }`);
            input = appendNumberToUInt8Array(id, input);
            result = await contract.addInput(input);
            break;
          case TransactionType.RESIGN_GAME_INPUT:
            roomId = info.roomId;
            input = ethers.utils.toUtf8Bytes(`{
                        "op": "resign", 
                        "value": "${roomId}"
                    }`);
            input = appendNumberToUInt8Array(id, input);
            result = await contract.addInput(input);
            break;
          case TransactionType.DEPLOY_BOT_INPUT:
            const { binary } = info;
            input = binary;
            input = appendNumberToUInt8Array(id, input);
            result = contract.addInput(input);
            break;
          case TransactionType.DEPOSIT_ERC20:
            const { amount } = info;
            //console.log("DEPOSITING TOKENS")
            //console.log(erc20PortalContract.address)
            var erc20Amount = ethers.BigNumber.from(
              ethers.utils.parseUnits(info.amount)
            );
            result = await erc20PortalContract.erc20Deposit(
              info.tokenAddress,
              erc20Amount,
              "0x"
            );
            break;
          case TransactionType.APPROVE_ERC20:
            const { spender } = info;
            var erc20Amount = ethers.BigNumber.from(
              ethers.utils.parseUnits(info.amount)
            );
            const erc20Contract = getErc20Contract(
              info.tokenAddress,
              provider,
              account
            );
            //console.log("erc20 portal contract address")
            //console.log(erc20PortalContract.address)
            result = await erc20Contract.approve(
              spender ?? erc20PortalContract.address,
              erc20Amount
            );
            break;
          default:
            break;
        }

        if (!result.hash) {
          //console.log("waiting for result hash")
          await result;
        }
        addTransaction(result, info);
        dispatch(
          setActionTransactionHash({
            id: id,
            transactionHash: result.hash,
          })
        );
        ActionResolverObject[id] = createPromise();
        //await result.wait()
      } catch (e) {
        console.log("bot error");
        console.log(e);
        dispatch(
          setAction({
            id: id,
            type:
              info.type == TransactionType.APPROVE_ERC20 ||
              info.type == TransactionType.DEPOSIT_ERC20
                ? ActionType.TRANSACTION
                : ActionType.INPUT,
            transactionInfo: info,
            status: ActionStates.ERROR,
            initTime: new Date().getTime(),
          })
        );
        ActionResolverObject[id] = createPromise();
        ActionResolverObject[id].resolve("error");

        id = -1;
      }
      return [action, ActionResolverObject[id]];
    },
    [chainId, provider, account, dispatch, addTransaction, contract, addAction]
  );
}

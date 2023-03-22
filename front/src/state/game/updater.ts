/*
 * Copyright (C) 2022-2023 Ultrachess team
 * This file is part of Ultrachess - https://github.com/Ultrachess/app
 *
 * SPDX-License-Identifier: Apache-2.0
 * See the file LICENSE for more information.
 */

import { useWeb3React } from "@web3-react/core";
import { default as axios } from "axios";
import fetch from "cross-fetch";
import { ethers } from "ethers";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDispatch } from "react-redux";
import { createClient, defaultExchanges } from "urql/core";

import {
  Input,
  Notice,
  NoticesByEpochAndInputDocument,
  NoticesByEpochDocument,
  NoticesDocument,
} from "../../generated-src/graphql";
import {
  DEFAULT_GRAPHQL_POLL_TIME,
  DEFAULT_GRAPHQL_URL,
  DEFAULT_INSPECT_URL,
} from "../../utils";
import { setAction } from "../actions/reducer";
import { useAppSelector } from "../hooks";
import { Notification, NotificationType } from "../notifications/notifications";
import { addNotification } from "../notifications/reducer";
import { Action, ActionList, ActionStates, ActionType } from "./types";
axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded";
import { SERVER_URL, setAppState } from "./gameSlice";
import {
  useUserActiveGameIds,
  useUserBotGameIds,
  useUserBotIds,
  useUserBotTournamentIds,
  useUserOwnedGameIds,
  useUserTournamentIds,
} from "./hooks";

export interface NoticeInfo {}

export interface ActionResult {
  success: boolean;
  actionId: string;
  timestamp: string;
  value: string;
}

export interface ActionResolver {
  [actionId: string]: Promise<string>;
}

export const ActionResolverObject: ActionResolver | any = {};

export type InputKeys = {
  epoch_index?: number;
  input_index?: number;
};

// define PartialNotice type only with the desired fields of the full Notice defined by the GraphQL schema
export type PartialEpoch = Pick<Input, "index">;
export type PartialInput = Pick<Input, "index"> & { epoch: PartialEpoch };
export type PartialNotice = Pick<
  Notice,
  "__typename" | "id" | "index" | "payload"
> & {
  input: PartialInput;
};

// define a type predicate to filter out notices
const isPartialNotice = (n: PartialNotice | null): n is PartialNotice =>
  n !== null;

//delay utils
export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getNotices = async (
  url: string,
  inputKeys: InputKeys
): Promise<PartialNotice[]> => {
  // create GraphQL client to reader server
  const client = createClient({ url, exchanges: defaultExchanges, fetch });
  // query the GraphQL server for notices corresponding to the input keys
  console.log(`querying ${url} for notices of ${JSON.stringify(inputKeys)}...`);

  if (
    inputKeys.epoch_index !== undefined &&
    inputKeys.input_index !== undefined
  ) {
    // list notices querying by epoch and input
    const { data, error } = await client
      .query(NoticesByEpochAndInputDocument, {
        epoch_index: inputKeys.epoch_index,
        input_index: inputKeys.input_index,
      })
      .toPromise();
    if (data?.epoch?.input?.notices) {
      return data.epoch.input.notices.nodes.filter<PartialNotice>(
        isPartialNotice
      );
    } else {
      return [];
    }
  } else if (inputKeys.epoch_index !== undefined) {
    // list notices querying only by epoch
    const { data, error } = await client
      .query(NoticesByEpochDocument, {
        epoch_index: inputKeys.epoch_index,
      })
      .toPromise();
    if (data?.epoch?.inputs) {
      // builds return notices array by concatenating each input's notices
      let ret: PartialNotice[] = [];
      const inputs = data.epoch.inputs.nodes;
      for (const input of inputs) {
        ret = ret.concat(
          input.notices.nodes.filter<PartialNotice>(isPartialNotice)
        );
      }
      return ret;
    } else {
      return [];
    }
  } else if (inputKeys.input_index !== undefined) {
    throw new Error(
      "Querying only by input index is not supported. Please define epoch index as well."
    );
  } else {
    // list notices using top-level query
    const { data, error } = await client.query(NoticesDocument, {}).toPromise();
    if (data?.notices) {
      return data.notices.nodes.filter<PartialNotice>(isPartialNotice);
    } else {
      return [];
    }
  }
};

function getRelevantNotifications(
  notifications: Notification[],
  account = " ",
  userBots: string[],
  userGames: string[],
  userBotGames: string[],
  userTournaments: string[],
  userBotTournaments: string[],
  userOwnedGames: string[]
) {
  const lUserBots = userBots.map((id) => id.toLowerCase());
  const lUserGames = userGames.map((id) => id.toLowerCase());
  const lUserBotGames = userBotGames.map((id) => id.toLowerCase());
  const lUserOwnedGames = userOwnedGames.map((id) => id.toLowerCase());
  const lUserTournaments = userTournaments.map((id) => id.toLowerCase());
  const lUserBotTournaments = userBotTournaments.map((id) => id.toLowerCase());
  //console.log("checking notifications account ", account)
  //console.log("checking notifications bots ", userBots)
  //console.log("checking notifications userGames ", userGames)
  //console.log("checking notifications botGames ", userBotGames)
  //console.log("checking notifications: ", notifications.map((id)=> {return id.type}))
  return notifications
    ? notifications.filter((notification) => {
        const { type } = notification;
        if (
          type == NotificationType.GAME_MOVE ||
          type == NotificationType.GAME_WAGER ||
          type == NotificationType.GAME_BETTING_CLOSED //||
          //type == NotificationType.GAME_CREATED
        ) {
          //check if game is in user's games
          return (
            lUserGames.includes(notification["game_id"].toLowerCase()) ||
            lUserBotGames.includes(notification["game_id"].toLowerCase())
          );
          //&& !lUserOwnedGames.includes(notification["game_id"].toLowerCase())
        }
        if (type == NotificationType.GAME_CREATED) {
          return lUserOwnedGames.includes(
            notification["game_id"].toLowerCase()
          );
        }
        if (type == NotificationType.GAME_JOINED) {
          //checkt if game is in user's games
          //and make sure joiner is not account
          return (
            (lUserOwnedGames.includes(notification["game_id"].toLowerCase()) ||
              lUserBotGames.includes(notification["game_id"].toLowerCase())) &&
            notification["player_id"].toLowerCase() != account.toLowerCase()
          );
        }
        if (type == NotificationType.GAME_COMPLETED) {
          return (
            notification["player_id1"].toLowerCase() == account.toLowerCase() ||
            notification["player_id2"].toLowerCase() == account.toLowerCase()
          );
        }
        if (type == NotificationType.CHALLENGE_ACCEPTED) {
          return notification.sender.toLowerCase() == account.toLowerCase();
        }
        if (type == NotificationType.CHALLENGE_DECLINED) {
          return notification.sender.toLowerCase() == account.toLowerCase();
        }
        if (type == NotificationType.CHALLENGE_CREATED) {
          return (
            notification.recipient.toLowerCase() == account.toLowerCase() ||
            lUserBots.includes(notification.recipient.toLowerCase())
          );
        }
        if (type == NotificationType.TOURNAMENT_JOINED) {
          return (
            userTournaments.includes(notification.tournamentId) ||
            userBotTournaments.includes(notification.tournamentId)
          );
        }
        if (type == NotificationType.TOURNAMENT_COMPLETED) {
          return (
            userTournaments.includes(notification.tournamentId) ||
            userBotTournaments.includes(notification.tournamentId)
          );
        }
        if (type == NotificationType.TOURNAMENT_MATCH_CREATED) {
          return (
            userTournaments.includes(notification.tournamentId) ||
            userBotTournaments.includes(notification.tournamentId)
          );
        }
        if (type == NotificationType.TOURNAMENT_MATCH_COMPLETED) {
          return (
            userTournaments.includes(notification.tournamentId) ||
            userBotTournaments.includes(notification.tournamentId)
          );
        }
        if (type == NotificationType.TOURNAMENT_ROUND_COMPLETED) {
          return userTournaments.includes(notification.tournamentId);
        }
        if (type == NotificationType.BOT_GAME_CREATED) {
          return (
            lUserBotGames.includes(notification["game_id"].toLowerCase()) ||
            lUserBots.includes(notification["player_id1"].toLowerCase()) ||
            lUserBots.includes(notification["player_id1"].toLowerCase())
          );
        }
        if (type == NotificationType.BOT_GAME_COMPLETED) {
          return (
            lUserBotGames.includes(notification["game_id"].toLowerCase()) ||
            lUserBots.includes(notification["player_id1"].toLowerCase()) ||
            lUserBots.includes(notification["player_id2"].toLowerCase())
          );
        }
        if (type == NotificationType.BOT_OFFER_CREATED) {
          return notification.owner.toLowerCase() == account.toLowerCase();
        }
        if (type == NotificationType.BOT_OFFER_ACCEPTED) {
          return notification.sender.toLowerCase() == account.toLowerCase();
        }
        if (type == NotificationType.BOT_OFFER_DECLINED) {
          return notification.sender.toLowerCase() == account.toLowerCase();
        }
        if (type == NotificationType.BOT_CREATED) {
          return (
            notification["creator_id"].toLowerCase() == account.toLowerCase()
          );
        }
      })
    : [];
}

function useNotices(): PartialNotice[] | undefined {
  const [notices, setNotices] = useState<PartialNotice[]>(undefined);
  useEffect(() => {
    const fetchNotices = async () => {
      setNotices(await getNotices(DEFAULT_GRAPHQL_URL, {}));
      await delay(DEFAULT_GRAPHQL_POLL_TIME);
      await fetchNotices();
    };
    fetchNotices().catch(console.error);
  }, []);

  return notices;
}

function updateGameState(dispatch, payload) {
  ////console.log(ethers.utils.toUtf8String(payload))
  const state = JSON.parse(ethers.utils.toUtf8String(payload));
  console.log(state);
  dispatch(setAppState(state));
}

function useInspect(dispatch) {
  const isMountedRef = useRef(true);
  console.log("useInspect");
  const poll = async (dispatch) => {
    console.log("waiting");
    await delay(5000);
    console.log("done waiting");
    if (!isMountedRef.current) {
      return;
    }

    const instance = axios.create({ baseURL: DEFAULT_INSPECT_URL });
    const input = `{
      "type": "state", 
      "value": ""
    }`;
    const response = await instance.get("/inspect/" + input);

    if (response.data.reports.length <= 0) {
      return poll(dispatch);
    }

    const payload = response.data.reports[0].payload;
    updateGameState(dispatch, payload);
    await poll(dispatch);
  };

  useEffect(() => {
    poll(dispatch);

    return () => {
      isMountedRef.current = false;
    };
  }, []);
}

export function useNotifications(): Notification[] | undefined {
  const [notices, setNotices] = useState<PartialNotice[]>([]);
  const [lastNoticeIndex, setLastNoticeIndex] = useState(0);
  const [allNotices, setAllNotices] = useState<Notification[]>([]);

  useEffect(() => {
    //console.log("useNotifications: ", notices)
    const fetchNotices = async () => {
      const newNotices = (await getNotices(DEFAULT_GRAPHQL_URL, {})) ?? [];

      //if (newNotices.length > lastNoticeIndex) {
      setNotices(newNotices);
      setLastNoticeIndex(newNotices.length);
      //}

      await delay(DEFAULT_GRAPHQL_POLL_TIME);
      await fetchNotices();
    };
    fetchNotices().catch(console.error);
  }, []);

  useEffect(() => {
    //if (notices && notices.length > 0) {
    const notifications: Notification[] = notices
      ?.sort((a, b) => a.index - b.index)
      ?.map((n) => JSON.parse(ethers.utils.toUtf8String(n.payload)));

    setAllNotices(notifications);
    //}
  }, [notices]);

  return allNotices;
}

const fetchActionResult = async (id: string): Promise<ActionResult> => {
  const instance = axios.create({ baseURL: DEFAULT_INSPECT_URL });
  const input = `{
        "type": "action", 
        "value": "${id}"
    }`;
  const response = await instance.get("/inspect/" + input);
  //console.log(response)
  return JSON.parse(
    ethers.utils.toUtf8String(response.data.reports[0].payload)
  );
};

function useActionList(): string[] {
  const actionList = useAppSelector((state) => state.game.actionList);
  return actionList;
}

function shouldCheckAction(a: Action): boolean {
  return a.status != ActionStates.PROCESSED && a.status != ActionStates.ERROR;
}

export const GameStateUpdater = React.memo(() => {
  const { account, chainId } = useWeb3React();
  const actions: ActionList = useAppSelector((state) => state.actions);
  const transactions = useAppSelector((state) => state.transactions);
  const pendingTransactions = useMemo(
    () => (chainId ? transactions[chainId] ?? {} : {}),
    [chainId, transactions]
  );
  //const lastBlockProcessed = useMemo(() => Math.max(...notices.map(n => JSON.parse(ethers.utils.toUtf8String("0x" + n.payload)).timeStamp)), [notices])
  const actionList = useActionList();

  const userBots = useUserBotIds(account);
  const userGames = useUserActiveGameIds(account);
  const botGames = useUserBotGameIds(account);
  const userTournaments = useUserTournamentIds(account);
  const botTournaments = useUserBotTournamentIds(account);
  const userOwnedGames = useUserOwnedGameIds(account);

  const newNotifications = useNotifications();
  const [lastNotificationLength, setLastNotificationLength] = useState(0);

  const dispatch = useDispatch();

  //Inspect Cartesi Machine and update game state
  useInspect(dispatch);

  //Update game state when a new notification is received
  const updateGameState = useCallback(async () => {
    if (!actions) return;

    // const payloads: NoticeInfo[] = notices
    //     .sort((a, b) => parseInt(a.input_index) - parseInt(b.input_index))
    //     .map(n => JSON.parse(ethers.utils.toUtf8String("0x" + n.payload)))

    for (const actionId in actions) {
      if (Object.prototype.hasOwnProperty.call(actions, actionId)) {
        const action = { ...actions[actionId] };
        if (shouldCheckAction(action)) {
          const transaction = pendingTransactions[action.transactionHash];
          //const expectedNotice = payloads.find(p => p.actionId == actionId)
          let actionResult: ActionResult = null;
          if (!transaction) {
            action.status = ActionStates.INITIALIZED;
          } else {
            if (transaction.confirmedTime)
              action.status =
                action.type == ActionType.TRANSACTION
                  ? ActionStates.PROCESSED
                  : ActionStates.CONFIRMED_WAITING_FOR_L2;
            else action.status = ActionStates.PENDING;
          }
          if (actionList.find((val) => val == actionId)) {
            actionResult = await fetchActionResult(actionId);
            action.status = actionResult.success
              ? ActionStates.PROCESSED
              : ActionStates.ERROR;
            action.result = actionResult;
            action.processedTime = new Date().getTime();
            //console.log(actionResult)
          }

          if (!shouldCheckAction(action))
            ActionResolverObject[actionId]?.resolve(
              actionResult ? actionResult.value ?? "blank" : "blank"
            );

          if (action.status != actions[actionId].status)
            dispatch(setAction(action));
        }
      }
    }
  }, [actions, pendingTransactions, dispatch, actionList]);

  useEffect(() => {
    const run = async () => {
      updateGameState();
    };
    run();
  }, [updateGameState, actionList]);

  useEffect(() => {
    //console.log("newNotifications: attempting ", newNotifications)
    if (newNotifications && newNotifications.length > 0) {
      //console.log("newNotifications: ", newNotifications);
      //console.log("newNotifications:", userGames)
      // dispatch(setNotifications(newNotifications))
      getRelevantNotifications(
        newNotifications,
        account,
        userBots,
        userGames,
        botGames,
        userTournaments,
        botTournaments,
        userOwnedGames
      ).forEach((notification) => {
        //console.log("newNotification: addingn notification", notification)
        dispatch(addNotification(notification));
      });
    }
    //console.log("user games1", userGames)
  }, [
    newNotifications,
    dispatch,
    account,
    userBots,
    userGames,
    botGames,
    userTournaments,
    botTournaments,
    userOwnedGames,
  ]);

  return null;
});

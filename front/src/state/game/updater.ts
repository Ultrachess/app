import { createClient, defaultExchanges } from "urql/core"
import {
    NoticesDocument,
    NoticesByEpochDocument,
    NoticesByEpochAndInputDocument,
    Notice,
    Input,
    NoticeDocument,
} from "../../generated-src/graphql";import fetch from 'cross-fetch'
import { DEFAULT_GRAPHQL_POLL_TIME, DEFAULT_GRAPHQL_URL } from "../../utils";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppSelector } from "../hooks";
import { delay } from "wonka";
import { ethers } from "ethers";
import { useDispatch } from "react-redux";
import { setAction } from "../actions/reducer";
import { addNotification, setNotifications } from "../notifications/reducer";
import { Notification, NotificationType } from "../notifications/notifications";
import { Action, ActionList, ActionStates, ActionType } from "./types"
import { useAllTransactions } from "../transactions/hooks";
import { useWeb3React } from "@web3-react/core";
import {default as axios} from "axios"
axios.defaults.headers.post['Content-Type'] ='application/x-www-form-urlencoded';
import { SERVER_URL } from "./gameSlice";
import { useUserBotIds, useUserBotGameIds, useUserBotTournamentIds, useUserTournamentIds, useUserActiveGameIds, useGame } from "./hooks";

export interface NoticeInfo {}

export interface ActionResult {
    success: boolean,
    actionId: string,
    timestamp: string,
    value: string,
}

export interface ActionResolver {
    [actionId: string]: Promise<string>
}

export const ActionResolverObject: ActionResolver | any = { }

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

const getNotices = async (
    url: string,
    inputKeys: InputKeys
): Promise<PartialNotice[]> => {
    // create GraphQL client to reader server
    const client = createClient({ url, exchanges: defaultExchanges, fetch });
    // query the GraphQL server for notices corresponding to the input keys
    console.log(
        `querying ${url} for notices of ${JSON.stringify(inputKeys)}...`
    );

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
            for (let input of inputs) {
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
        const { data, error } = await client
            .query(NoticesDocument, {})
            .toPromise();
        if (data?.notices) {
            return data.notices.nodes.filter<PartialNotice>(isPartialNotice);
        } else {
            return [];
        }
    }
};

function getRelevantNotifications(
        notifications: Notification[], 
        account: String = " ",
        userBots: String[],
        userGames: String[], 
        userBotGames: String[], 
        userTournaments: String[],
        userBotTournaments: String[]
    ){
    let lUserBots = userBots.map((id) => id.toLowerCase())
    let lUserGames = userGames.map((id) => id.toLowerCase())
    let lUserBotGames = userBotGames.map((id) => id.toLowerCase())
    let lUserTournaments = userTournaments.map((id) => id.toLowerCase())
    let lUserBotTournaments = userBotTournaments.map((id) => id.toLowerCase())
    //console.log("checking notifications account ", account)
    //console.log("checking notifications bots ", userBots)
    //console.log("checking notifications userGames ", userGames)
    //console.log("checking notifications botGames ", userBotGames)
    //console.log("checking notifications: ", notifications.map((id)=> {return id.type}))
    return notifications ?
        notifications
        .filter(notification => {
            const { type } = notification
            if(type == NotificationType.GAME_JOINED ||
                type == NotificationType.GAME_MOVE ||
                type == NotificationType.GAME_WAGER ||
                type == NotificationType.GAME_BETTING_CLOSED ||
                type == NotificationType.GAME_CREATED 
            ){
                //console.log("is game notification", userGames)
                //console.log("is game notification", account)
                return lUserGames.includes(notification["game_id"].toLowerCase()) || lUserBotGames.includes(notification["game_id"].toLowerCase())
            }
            if(type == NotificationType.GAME_COMPLETED){
                return notification["player_id1"].toLowerCase() == account.toLowerCase() || 
                notification["player_id2"].toLowerCase() == account.toLowerCase()
            }
            if (type == NotificationType.CHALLENGE_ACCEPTED){
                return notification.sender.toLowerCase() == account.toLowerCase()
            } 
            if (type == NotificationType.CHALLENGE_DECLINED){
                return notification.sender.toLowerCase() == account.toLowerCase()
            }
            if (type == NotificationType.CHALLENGE_CREATED){
                return notification.recipient.toLowerCase() == account.toLowerCase() ||
                    lUserBots.includes(notification.recipient.toLowerCase())
            }
            if (type == NotificationType.TOURNAMENT_JOINED){
                return userTournaments.includes(notification.tournamentId) || userBotTournaments.includes(notification.tournamentId)
            }
            if (type == NotificationType.TOURNAMENT_COMPLETED){
                return userTournaments.includes(notification.tournamentId) || userBotTournaments.includes(notification.tournamentId)
            }
            if (type == NotificationType.TOURNAMENT_MATCH_CREATED){
                return userTournaments.includes(notification.tournamentId) || userBotTournaments.includes(notification.tournamentId)
            }
            if (type == NotificationType.TOURNAMENT_MATCH_COMPLETED){
                return userTournaments.includes(notification.tournamentId) || userBotTournaments.includes(notification.tournamentId)
            }
            if (type == NotificationType.TOURNAMENT_ROUND_COMPLETED){
                return userTournaments.includes(notification.tournamentId)
            }
            if (type == NotificationType.BOT_GAME_CREATED){
                return lUserBotGames.includes(notification["game_id"].toLowerCase()) || 
                    lUserBots.includes(notification["player_id1"].toLowerCase()) ||
                    lUserBots.includes(notification["player_id1"].toLowerCase())
            }
            if (type == NotificationType.BOT_GAME_COMPLETED){
                return lUserBotGames.includes(notification["game_id"].toLowerCase()) || 
                    lUserBots.includes(notification["player_id1"].toLowerCase()) ||
                    lUserBots.includes(notification["player_id2"].toLowerCase())
            }
            if (type == NotificationType.BOT_OFFER_CREATED){
                return notification.owner.toLowerCase() == account.toLowerCase()
            }
            if (type == NotificationType.BOT_OFFER_ACCEPTED){
                return notification.sender.toLowerCase() == account.toLowerCase()
            }
            if (type == NotificationType.BOT_OFFER_DECLINED){
                return notification.sender.toLowerCase() == account.toLowerCase()
            }
                
        })
        : []
}


function useNotices(): PartialNotice[] | undefined {
    const [notices, setNotices] = useState<PartialNotice[]>(undefined)
    useEffect(() => {
        const fetchNotices = async () => {
            setNotices( await getNotices(DEFAULT_GRAPHQL_URL, {
            }) )
            await delay(DEFAULT_GRAPHQL_POLL_TIME)
            await fetchNotices()
        }
        fetchNotices()
            .catch(console.error)
    },[])

    return notices
}

export function useNotifications(): Notification[] | undefined {
    const [notices, setNotices] = useState<PartialNotice[]>([]);
    const [lastNoticeIndex, setLastNoticeIndex] = useState(0);
    const [allNotices, setAllNotices] = useState<Notification[]>([]);
  
    useEffect(() => {
        //console.log("useNotifications: ", notices)
      const fetchNotices = async () => {
        const newNotices = await getNotices(DEFAULT_GRAPHQL_URL, {}) ?? [];
  
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
    var instance = axios.create({baseURL: SERVER_URL })
    var input = `{
        "type": "action", 
        "value": "${id}"
    }`
    var response = await instance.get("/inspect/" + input) 
    //console.log(response)
    return JSON.parse(ethers.utils.toUtf8String(response.data.reports[0].payload))
}

function useActionList(): String[] {
    const actionList = useAppSelector(state => state.game.actionList)
    return actionList
}

function shouldCheckAction(a: Action): boolean {
    return a.status != ActionStates.PROCESSED && a.status != ActionStates.ERROR
}


export function GameStateUpdater() {
    const { account, chainId } = useWeb3React()
    const actions: ActionList = useAppSelector(state => state.actions)
    const transactions = useAppSelector((state) => state.transactions)
    const pendingTransactions = useMemo(() => (chainId ? transactions[chainId] ?? {} : {}), [chainId, transactions])
    //const lastBlockProcessed = useMemo(() => Math.max(...notices.map(n => JSON.parse(ethers.utils.toUtf8String("0x" + n.payload)).timeStamp)), [notices])
    const actionList = useActionList()

    const userBots = useUserBotIds(account)
    const userGames = useUserActiveGameIds(account)
    const botGames = useUserBotGameIds(account)
    const userTournaments = useUserTournamentIds(account)
    const botTournaments = useUserBotTournamentIds(account)

    const newNotifications = useNotifications()
    const [lastNotificationLength, setLastNotificationLength] = useState(0)

    const dispatch = useDispatch()
    useEffect(() => {
        const run = async () => {
            if(!actions) return

            // const payloads: NoticeInfo[] = notices
            //     .sort((a, b) => parseInt(a.input_index) - parseInt(b.input_index))
            //     .map(n => JSON.parse(ethers.utils.toUtf8String("0x" + n.payload)))
            
            for (const actionId in actions) {
                if (Object.prototype.hasOwnProperty.call(actions, actionId)) {
                    var action = {...actions[actionId]}
                    if(shouldCheckAction(action)){
                        const transaction = pendingTransactions[action.transactionHash]
                        //const expectedNotice = payloads.find(p => p.actionId == actionId)
                        var actionResult: ActionResult = null
                        if(!transaction){
                            action.status = ActionStates.INITIALIZED
                        }
                        else{
                            if(transaction.confirmedTime) action.status = 
                                action.type == ActionType.TRANSACTION
                                ? ActionStates.PROCESSED : ActionStates.CONFIRMED_WAITING_FOR_L2
                            else action.status = ActionStates.PENDING
                        }
                        if(actionList.find(val=> val == actionId)) {
                            actionResult = await fetchActionResult(actionId)
                            action.status = actionResult.success? ActionStates.PROCESSED : ActionStates.ERROR
                            action.result = actionResult
                            action.processedTime = new Date().getTime()
                            //console.log(actionResult)
                        }
                        
                        if(!shouldCheckAction(action)) 
                            ActionResolverObject[actionId]
                                ?.resolve(actionResult 
                                    ? actionResult.value 
                                    ?? "blank": "blank")
                                    
                        if(action.status != actions[actionId].status)
                            dispatch(setAction(action))
                    }
                }
            }
        }
        run()
        
    }, [actionList, dispatch])

    useEffect(() => {
        //console.log("newNotifications: attempting ", newNotifications)
        if(newNotifications && 
            newNotifications.length > 0){
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
                botTournaments
            )
            .forEach((notification) => {
                //console.log("newNotification: addingn notification", notification)
                 dispatch(addNotification(notification)) 
            })
        }
        //console.log("user games1", userGames)

    }, [newNotifications, dispatch, account, userBots, userGames, botGames, userTournaments, botTournaments])

    return null
}
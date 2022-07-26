import { createClient, defaultExchanges } from "urql/core"
import { GetNoticeDocument, Notice, NoticeKeys } from "../../generated-src/graphql"
import fetch from 'cross-fetch'
import { DEFAULT_GRAPHQL_POLL_TIME, DEFAULT_GRAPHQL_URL } from "../../utils";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppSelector } from "../hooks";
import { delay } from "wonka";
import { ethers } from "ethers";
import { useDispatch } from "react-redux";
import { setAction } from "../actions/reducer";
import { Action, ActionList, ActionStates, ActionType } from "./types"
import { useAllTransactions } from "../transactions/hooks";
import { useWeb3React } from "@web3-react/core";
import {default as axios} from "axios"
axios.defaults.headers.post['Content-Type'] ='application/x-www-form-urlencoded';
import { SERVER_URL } from "./gameSlice";

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

type PartialNotice = Pick<
    Notice,
    | "__typename"
    | "session_id"
    | "epoch_index"
    | "input_index"
    | "notice_index"
    | "payload"
>;

const isPartialNotice = (n: PartialNotice | null): n is PartialNotice =>
    n !== null;

const getNotices = async (
    url: string,
    noticeKeys: NoticeKeys
): Promise<PartialNotice[]> => {
    // create GraphQL client to reader server
    const client = createClient({ url, exchanges: defaultExchanges, fetch });

    // query the GraphQL server for notices of our input
    // keeping trying forever (or until user kill the process)
    // console.log(
    //     `querying ${url} for notices of ${JSON.stringify(noticeKeys)}...`
    // );
    const { data, error } = await client
        .query(GetNoticeDocument, { query: noticeKeys })
        .toPromise();
    if (data?.GetNotice) {
        return data.GetNotice.filter<PartialNotice>(isPartialNotice);
    } else {
        throw new Error(error?.message);
    }
};

function useNotices(): PartialNotice[] | undefined {
    const [notices, setNotices] = useState<PartialNotice[]>(undefined)

    useEffect(() => {
        const fetchNotices = async () => {
            setNotices( await getNotices(DEFAULT_GRAPHQL_URL, {}) )
            await delay(DEFAULT_GRAPHQL_POLL_TIME)
            await fetchNotices()
        }
        fetchNotices()
            .catch(console.error)
    },[])

    return notices
}

const fetchActionResult = async (id: string): Promise<ActionResult> => {
    var instance = axios.create({baseURL: SERVER_URL })
    var input = `{
        "type": "action", 
        "value": "${id}"
    }`
    var response = await instance.get("/inspect/" + input) 
    console.log(response)
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
    const { chainId } = useWeb3React()
    const actions: ActionList = useAppSelector(state => state.actions)
    //const notices = useNotices()
    const transactions = useAppSelector((state) => state.transactions)
    const pendingTransactions = useMemo(() => (chainId ? transactions[chainId] ?? {} : {}), [chainId, transactions])
    //const lastBlockProcessed = useMemo(() => Math.max(...notices.map(n => JSON.parse(ethers.utils.toUtf8String("0x" + n.payload)).timeStamp)), [notices])
    const actionList = useActionList()

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
                            console.log(actionResult)
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

    return null
}
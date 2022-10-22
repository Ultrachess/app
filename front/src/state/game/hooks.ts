import { useWeb3React } from "@web3-react/core";
import { useDispatch } from "react-redux";
import { useTransactionAdder } from "../transactions/hooks";
import { Action, ActionType, ActionStates, ActionList } from "./types";
import { TransactionInfo, TransactionType } from "../../common/types";
import { TransactionResponse } from '@ethersproject/providers'
import { useCallback, useMemo } from "react";
import { useContract, useErc20Contract } from "../../hooks/contract";
import { DAPP_ADDRESS } from "./gameSlice";
import { addAction, setAction, setActionTransactionHash } from "../actions/reducer";
import InputFacet from  "../../../../deployments/localhost/InputFacet.json"
import ERC20PortalFacet from "../../../../deployments/localhost/ERC20PortalFacet.json"
import { ethers } from "ethers";
import { useAppSelector } from "../hooks";
import { delay, filter } from "wonka";
import { appendNumberToUInt8Array, decimalToHexString, getErc20Contract } from "../../utils";
import { createPromise } from "./gameHelper";
import { ActionResolverObject } from "./updater";

export function useActions(): ActionList {
    const actions = useAppSelector(state => state.actions)
    return actions
}

export function useActionsNotProcessed(): Action[] {
    const actions = useActions()
    return useMemo(()=> {
        return Object.values(actions)
            .filter(({status}) => status != ActionStates.PROCESSED && status != ActionStates.ERROR)
    }, [actions])
}

export function useAction(actionId: number): Action {
    const actions = useActions()
    return actions[actionId]
}   

export function useWaitForAction(): (actionId: number) => Promise<Action>{
    const actions = useActions()
    return useCallback((actionId: number) => {
        const action = actions[actionId]
        const waitToResolve = async (): Promise<Action> => {
            while(action.status != ActionStates.PROCESSED){
                await delay(100)
                await waitToResolve()
            }
            return action
        }
        return waitToResolve()
    }, [actions])
} 

export function useAddAction(): (action: Action) => number {
    const dispatch = useDispatch()

    return useCallback((action: Action) => {
        dispatch(addAction(action))
        console.log(action.id.toString())
        return action.id
    }, [dispatch])
}

// Convert a hex string to a byte array
function hexToBytes(hex) {
    for (var bytes = [], c = 0; c < hex.length; c += 2)
        bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
}

export function useActionCreator(): (info: TransactionInfo) => Promise<[Action, Promise<String>]> {
    const { chainId, provider, account } = useWeb3React()
    const dispatch = useDispatch()
    const addAction = useAddAction()
    const addTransaction = useTransactionAdder()
    const contract = useContract(DAPP_ADDRESS, InputFacet.abi)
    const erc20PortalContract = useContract(DAPP_ADDRESS, ERC20PortalFacet.abi)

    return useCallback(async (info: TransactionInfo) => {
        var input: Uint8Array
        var result: TransactionResponse
        var id: number = Math.floor(Math.random() * 90000);
        console.log(`actionId: ${id}`)
        console.log(`actionId hex ${decimalToHexString(id)}`)
        var action: Action
        addAction({
            id: id,
            type: info.type == TransactionType.APPROVE_ERC20 
                || info.type == TransactionType.DEPOSIT_ERC20
                ? ActionType.TRANSACTION : ActionType.INPUT,
            transactionInfo: info,
            status: ActionStates.INITIALIZED,
            initTime: new Date().getTime(),
        })
        try{
            switch (info.type) {
                case TransactionType.BOT_STEP:
                    let { hash } = info
                    input = ethers.utils.toUtf8Bytes(`{
                        "op": "botStep", 
                        "value": "${hash}"
                    }`)
                    input = appendNumberToUInt8Array(id, input)
                    result = await contract.addInput(input)
                    break;
                case TransactionType.RELEASE_FUNDS:
                    let { tokenAddress } = info
                    input = ethers.utils.toUtf8Bytes(`{
                        "op": "releaseFunds", 
                        "value": "${tokenAddress}"
                    }`)
                    input = appendNumberToUInt8Array(id, input)
                    result = await contract.addInput(input)
                    break;
                case TransactionType.MANAGER_BOT_INPUT:
                    let { autoBattleEnabled, autoMaxWagerAmount, autoWagerTokenAddress, botId } = info
                    input = ethers.utils.toUtf8Bytes(`{
                        "op": "manageBot", 
                        "value": {
                            "autoBattleEnabled": ${autoBattleEnabled},
                            "autoWagerTokenAddress" : "${autoWagerTokenAddress}",
                            "autoMaxWagerAmount": ${autoMaxWagerAmount},
                            "botId": "${botId}"
                        }
                    }`)
                    input = appendNumberToUInt8Array(id, input)
                    result = await contract.addInput(input)
                    break;                
                case TransactionType.CREATE_GAME_INPUT:
                    const { name, isBot, wagerAmount, wagerTokenAddress, botId1, botId2, playerId, bettingDuration} = info
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
                            "bettingDuration" : "${bettingDuration ?? "0"}"
                        }
                    }`)
                    input = appendNumberToUInt8Array(id, input)
                    result = await contract.addInput(input)
                    break;
                case TransactionType.SEND_MOVE_INPUT:
                    let { value, roomId } = info
                    input = ethers.utils.toUtf8Bytes(`{
                        "op": "move", 
                        "value": {
                            "roomId" : "${roomId}",
                            "move" : "${value}"
                        }
                    }`)
                    input = appendNumberToUInt8Array(id, input)
                    result = await contract.addInput(input)
                    break;
                case TransactionType.JOIN_GAME_INPUT:
                    let roomId1  = info.roomId
                    input = ethers.utils.toUtf8Bytes(`{
                        "op": "join", 
                        "value": "${roomId1}"
                    }`)
                    input = appendNumberToUInt8Array(id, input)
                    result = await contract.addInput(input)
                    break;
                case TransactionType.RESIGN_GAME_INPUT:
                    roomId = info.roomId
                    input = ethers.utils.toUtf8Bytes(`{
                        "op": "resign", 
                        "value": "${roomId}"
                    }`)
                    input = appendNumberToUInt8Array(id, input)
                    result = await contract.addInput(input)
                    break;
                case TransactionType.DEPLOY_BOT_INPUT:
                    const { binary } = info
                    input = binary
                    input = appendNumberToUInt8Array(id, input)
                    result = contract.addInput(input)
                    break;
                case TransactionType.DEPOSIT_ERC20:
                    var { amount, tokenAddress } = info
                    var erc20Amount = ethers.BigNumber.from(ethers.utils.parseUnits(amount))
                    result = await erc20PortalContract.erc20Deposit(tokenAddress, erc20Amount, "0x")
                    break;
                case TransactionType.APPROVE_ERC20:
                    var { amount, tokenAddress, spender } = info
                    var erc20Amount = ethers.BigNumber.from(ethers.utils.parseUnits(amount))
                    const erc20Contract = getErc20Contract(tokenAddress, provider, account)
                    result = await erc20Contract.approve(
                        spender ?? erc20PortalContract.address,
                        erc20Amount
                    );
                    break;
                default:
                    break;     
            }
   
            while (!result.hash) {
                console.log("waiting for result hash")
                await result.wait()
            }
            addTransaction(result, info)
            dispatch(setActionTransactionHash({
                id: id,
                transactionHash: result.hash,
            }))
            ActionResolverObject[id] = createPromise()
            await result.wait()
        }
        catch(e){
            console.log(e)
            dispatch(setAction({
                id: id,
                type: info.type == TransactionType.APPROVE_ERC20
                || info.type == TransactionType.DEPOSIT_ERC20
                    ? ActionType.TRANSACTION : ActionType.INPUT,
                transactionInfo: info,
                status: ActionStates.ERROR,
                initTime: new Date().getTime(),
            }))
            ActionResolverObject[id] = createPromise()
            ActionResolverObject[id].resolve("error")

            id = -1
        }
        return [action, ActionResolverObject[id]]

    }, [chainId, provider, account, dispatch, addTransaction, contract, addAction])
}
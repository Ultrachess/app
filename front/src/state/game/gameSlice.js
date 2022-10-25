import { createSlice } from "@reduxjs/toolkit";
import { InputStatus, InputType, getGameByPlayer, createDummyGames, getGameById, createGameHelper } from "./gameHelper";
import { ethers } from "ethers";
import dappGoerli from "../../../../deployments/goerli/chessAppNew.json";
import dappLocalhost from "../../../../deployments/localhost/dapp.json";
import dappPolygonMumbai from "../../../../deployments/polygon-mumbai/chessAppNew.json"
import { CONTRACTS } from '../../ether/contracts';
import { CHAINS } from '../../ether/chains';


import { createClient, defaultExchanges } from '@urql/core';
import { pipe, subscribe } from "wonka";
import { Chess } from "chess.js";
import {default as axios} from "axios"
axios.defaults.headers.post['Content-Type'] ='application/x-www-form-urlencoded';

export const DAPP_ADDRESSES = {
    goerli: dappGoerli.address,
    polygon_mumbai: dappPolygonMumbai.address,
    localhost: dappLocalhost.address,
};
console.log(`dapp addresses ${JSON.stringify(DAPP_ADDRESSES, null, "  ")}`)


export const SERVER_URL = import.meta.env.PROD ? 
    "https://ultrachess.org/api" : 
    `http://localhost:3002`;

const GetNoticeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetNotice"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"query"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"NoticeKeys"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"GetNotice"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"Variable","name":{"kind":"Name","value":"query"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"session_id"}},{"kind":"Field","name":{"kind":"Name","value":"epoch_index"}},{"kind":"Field","name":{"kind":"Name","value":"input_index"}},{"kind":"Field","name":{"kind":"Name","value":"notice_index"}},{"kind":"Field","name":{"kind":"Name","value":"payload"}}]}}]}}]}
export const gameSlice = createSlice({
    name: "game",
    initialState: {
        cache:{
            latestInputIndex: 0,
            isUpToDate: false
        },
        currentInputState:{
            status: undefined,
            type: undefined,
        },
        games: {},
        bots: {},
        elo: {},
        accounts: {},
        blockNumber: 0,
        lastProcessedBlock: 0,
        lastStepTimestamp: 0,
        actionList: [],
    },
    reducers: {
        setLastProcessedBlock: (state, action) => {
            state.lastProcessedBlock = action.payload
        },
        setBlockNumber: (state, action) => {
            state.blockNumber = action.payload
        },
        setInputStatus: (state, action) => {
            var { status, type } = action.payload
            state.currentInputState.status = status
            state.currentInputState.type = type
        },
        setLatestInput: (state, action) => {
            state.cache.latestInputIndex = action.payload
        },
        setGames: (state, action) => {
            state.games = action.payload
        },
        setElo: (state, action) => {
            state.elo = action.payload
        },
        setAccounts: (state, action) => {
            state.accounts = action.payload
        },
        setBots: (state, action) => {
            state.bots = action.payload
        },
        setAppState: (state, action) => {
            var {elo, game, bots, accounts, lastProcessedBlock, actionList, lastStepTimestamp} = action.payload
            if(
                !deepEqual(state.elo, elo) ||
                !deepEqual(state.games, game) ||
                !deepEqual(state.bots, bots) ||
                !deepEqual(state.accounts, accounts)
            ){ 
                state.cache.isUpToDate = !state.cache.isUpToDate
                console.log("is not up to date, updating")
            }

            state.elo = elo
            state.games = game
            state.bots = bots
            state.accounts = accounts
            state.lastProcessedBlock = lastProcessedBlock
            state.lastStepTimestamp = lastStepTimestamp
            state.actionList = actionList
        },
        updateGame: (state, action) => {
            var {id, game} = action.payload
            state.games.forEach((value, index) => {
                if(id == value.id)
                    state.games[index] == game  
            })
        },
        processInput: (state, action) => {
            var {
                sender,
                operation,
                value,
                success,
                index,
                timestamp
            } = action.payload
            var latestInputIndex = state.cache.latestInputIndex

            if(latestInputIndex < index){    
                //console.log(action.payload)
                if(success){
                    switch (operation) {
                        case "create":
                            var game = createGameHelper(sender, value, timestamp)
                            if(state.games.filter(e => e.id == game.id) <= 0)
                                state.games.push(game)
                            break;
                        case "join":
                            var {id, player} = {id: value, player: sender }
                            state.games.forEach((value, index) => {
                                if(id == value.id)
                                    state.games[index].players.push(player)
                            })
                            break;
                        case "leave":
                        
                            break;
                        case "move":
                            var board = new Chess()
                            var game = getGameByPlayer(state.games, sender)
                            if(game){
                                board.load_pgn(game.pgn)
                                board.move(value, {sloppy: true})
                                board.set_comment(timestamp.toString())
                                game.pgn = board.pgn()
                                //console.log(board.pgn())
                                state.games.forEach((value, index) => {
                                    if(game.id == value.id)
                                        state.games[index] == game  
                                })
                            }
                            
                            break;
                        default:
                            break;
                    }
                }
                state.cache.latestInputIndex = index
                state.cache.isUpToDate = false
            }else{
                state.cache.isUpToDate = true
            }
        },
        applyMove: (state, action) => {
            var { sender, value } = action.payload
            var board = new Chess()
            var game = getGameByPlayer(state.games, sender)
            board.load_pgn(game.pgn)
            board.move(value)
            game.pgn = board.pgn()
            updateGame({
                id: game.id,
                game,
            })
        },
        joinGame: (state, action) => {
            var {id, player} = action.payload
            state.games.forEach((value, index) => {
                if(id == value.id)
                    state.games[index].players.push(player)
            })
        },
        leaveGame: (state, action) => {
            var {id, player} = action.payload
            state.games.forEach((value, index) => {
                if(id == value.id){
                    var indexToRemove = state.games[index].players.indexOf(player)
                    state.games[index].players.splice(indexToRemove, 1)
                }
            })
        },
        addGame: (state, action) => {
            var game = action.payload
            if(state.games.filter(e => e.id == game.id) <= 0)
                state.games.push(game)
        },
        removeGame: (state, action) => {
            var { id } = action.payload
            state.games.forEach((value, index) => {
                if(id == value.id)
                    state.games.splice(index, 1)
            })
        },
        
    }
})

export const { setBlockNumber, setAppState, setGames, setElo, setAccounts, setBots, updateGame, addGame, removeGame, setLatestInput, processInput, setInputStatus } = gameSlice.actions



var cartesiDappContract;
var erc20PortalContract;
var client;
var fn2;

var hexToUtf8 = function( s ){
    return decodeURIComponent( s.replace( /../g, '%$&' ) );
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function deepEqual(object1, object2) {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);
    if (keys1.length !== keys2.length) {
      return false;
    }
    for (const key of keys1) {
      const val1 = object1[key];
      const val2 = object2[key];
      const areObjects = isObject(val1) && isObject(val2);
      if (
        areObjects && !deepEqual(val1, val2) ||
        !areObjects && val1 !== val2
      ) {
        return false;
      }
    }
    return true;
  }
  function isObject(object) {
    return object != null && typeof object === 'object';
  }

function updateGameState(dispatch, payload){
    //console.log(ethers.utils.toUtf8String(payload))
    var state = JSON.parse(ethers.utils.toUtf8String(payload))
    //console.log(state)
    dispatch(setAppState(state))
}
  
async function poll(dispatch) {
    await delay(500);
    var instance = axios.create({baseURL: SERVER_URL })
    var input = `{
        "type": "state", 
        "value": ""
    }`
    var response = await instance.get("/inspect/" + input) 
    var payload = response.data.reports[0].payload
    updateGameState(dispatch, payload)
    await poll(dispatch);
}

export const initContracts = (signer, chainId) => async dispatch => {
    // Get network name
    const CHAIN = CHAINS[chainId];
    const networkName = CHAIN && CHAIN.networkName ? CHAIN.networkName : "localhost";

    //init contract
    // TODO: Handle DAPP_ADDRESSES[networkName] or CONTRACTS[networkName] not defined
    var inputFacetAbi = CONTRACTS[networkName].InputFacet.abi
    var erc20PortalAbi = CONTRACTS[networkName].ERC20PortalFacet.abi
    var cartesiDappAddress = DAPP_ADDRESSES[networkName]


    cartesiDappContract = new ethers.Contract(
        cartesiDappAddress,
        inputFacetAbi,
        signer
    )

    erc20PortalContract = new ethers.Contract(
        cartesiDappAddress,
        erc20PortalAbi,
        signer
    )

    



    //start polling
    poll(dispatch)

}

export const fetchGames = () => async dispatch => {
    try{
        dispatch( setGames(createDummyGames()) )
    }
    catch(e){
        return console.error(e.message);
    }
}

export const sendBinary = (binary) => async dispatch => {
    try{
        let overrides = {
            gasLimit: 30000000,     
            gasPrice: ethers.utils.parseUnits('9.0', 'gwei'),   
            nonce: 123,
        };

        //send transaction
        const tx = await cartesiDappContract.addInput(binary, overrides)
        console.log("waiting for confirmation...");
        const receipt = await tx.wait(1);
        console.log("1 confirmation")
        console.log(receipt)
    }
    catch(e){
        return console.error(e.message);
    }
}

export const depositErc20 = (signer, tokenAddress, tokenAmount) => async dispatch => {
    try{
        let overrides = {
            gasLimit: 30000000,     
            gasPrice: ethers.utils.parseUnits('9.0', 'gwei'),   
            nonce: 123,
        };

        var erc20Contract = new ethers.Contract(
            tokenAddress,
            CartesiToken.abi,
            signer
        )

        const erc20Amount = ethers.BigNumber.from(ethers.utils.parseUnits(tokenAmount))
        const signerAddress = await erc20PortalContract.signer.getAddress();
        console.log(`using account "${signerAddress}"`);
        const allowance = await erc20Contract.allowance(
            signerAddress,
            erc20PortalContract.address
        );
        console.log(`current allowance ${allowance}`)
        if (allowance.lt(erc20Amount)) {
            const allowanceApproveAmount =
                ethers.BigNumber.from(erc20Amount).sub(allowance);
            console.log(
                `approving allowance of ${allowanceApproveAmount} tokens...`
            );
            const tx = await erc20Contract.approve(
                erc20PortalContract.address,
                erc20Amount
            );
            await tx.wait();
        }

        //send transaction
        console.log(erc20PortalContract)
        const tx = await erc20PortalContract.erc20Deposit(tokenAddress, erc20Amount, "0x");
        console.log("waiting for confirmation...");
        const receipt = await tx.wait(1);
        console.log("1 confirmation")
        console.log(receipt)
    }
    catch(e){
        return console.error(e.message);
    }
}

export const sendMove = (move) => async dispatch => {
    dispatch(setInputStatus({
        type: InputType.MOVE,
        status: InputStatus.ACTIVE
    }))
    try{
        let overrides = {
            gasLimit: 30000000,     
            gasPrice: ethers.utils.parseUnits('9.0', 'gwei'),   
            nonce: 123,
        };

        //send transaction
        const message = `{"op": "move", "value": "${move}"}`
        console.log(message)
        const input = ethers.utils.toUtf8Bytes(message)
        const tx = await cartesiDappContract.addInput(input)
        console.log("waiting for confirmation...");
        const receipt = await tx.wait(1);
        console.log("1 confirmation")
        console.log(receipt)
        dispatch(setInputStatus({
            type: InputType.MOVE,
            status: InputStatus.SUCCESS
        }))
    }
    catch(e){
        dispatch(setInputStatus({
            type: InputType.MOVE,
            status: InputStatus.FAIL
        }))
        return console.error(e.message);
    }
}

export const createBotGame = (botId1, botId2, matchCount, wagerAmount) => async dispatch => {
    try{
        let overrides = {
            gasLimit: 30000000,     
            gasPrice: ethers.utils.parseUnits('9.0', 'gwei'),   
            nonce: 123,
            //blockTag: 33,     
        };

        const erc20WagerAmount = ethers.BigNumber.from(ethers.utils.parseUnits(wagerAmount))


        //send transaction
        const message = `
            {
                "op": "create", 
                "value": {
                    "isBot": true,
                    "botId1": "${botId1}",
                    "botId2": "${botId2}",
                    "wagerAmount": ${erc20WagerAmount},
                    "matchCount": ${matchCount}
                }
            }
        `;
        const input = ethers.utils.toUtf8Bytes(message)
        const tx = await cartesiDappContract.addInput(input)
        console.log(tx);
        console.log("waiting for confirmation...");
        const receipt = await tx.wait(1);
        console.log("1 confirmation")
        console.log(receipt)
    }
    catch(e){
        return console.error(e.message);
    }
}

export const createGame = (token, wagerAmount) => async dispatch => {
    dispatch(setInputStatus({
        type: InputType.CREATE,
        status: InputStatus.ACTIVE
    }))
    try{
        let overrides = {
            gasLimit: 30000000,     
            gasPrice: ethers.utils.parseUnits('9.0', 'gwei'),   
            nonce: 123,
            //blockTag: 33,     
        };

        console.log(`wager amount ${wagerAmount}`)
        const erc20WagerAmount = ethers.utils.parseUnits(wagerAmount)

        //send transaction
        const message = `
            {
                "op": "create", 
                "value": {
                    "isBot" : false,
                    "token" : "${token}",
                    "wagerAmount": ${erc20WagerAmount}
                }
            }
        `;
        const input = ethers.utils.toUtf8Bytes(message)
        const tx = await cartesiDappContract.addInput(input)
        console.log(tx);
        console.log("waiting for confirmation...");
        const receipt = await tx.wait(1);
        console.log("1 confirmation")
        console.log(receipt)
        dispatch(setInputStatus({
            type: InputType.CREATE,
            status: InputStatus.SUCCESS
        }))
    }
    catch(e){
        dispatch(setInputStatus({
            type: InputType.CREATE,
            status: InputStatus.FAIL
        }))
        return console.error(e.message);
    }
}

export const joinGame = (roomId) => async dispatch => {
    dispatch(setInputStatus({
        type: InputType.JOIN,
        status: InputStatus.ACTIVE
    }))
    try{
        let overrides = {
            gasLimit: 30000000,     
            gasPrice: ethers.utils.parseUnits('9.0', 'gwei'),   
            nonce: 123,
            //blockTag: 33,     
        };

        //send transaction
        const message = `{"op": "join", "value": "${roomId}"}`
        const input = ethers.utils.toUtf8Bytes(message)
        const tx = await cartesiDappContract.addInput(input)
        console.log(tx);
        console.log("waiting for confirmation...");
        const receipt = await tx.wait(1);
        console.log("1 confirmation")
        console.log(receipt)
        dispatch(setInputStatus({
            type: InputType.JOIN,
            status: InputStatus.SUCCESS
        }))
    }
    catch(e){
        dispatch(setInputStatus({
            type: InputType.JOIN,
            status: InputStatus.FAIL
        }))
        return console.error(e.message);
    }
}

export const leaveGame = () => async dispatch => {
    try{
        setGames(createDummyGames())
    }
    catch(e){
        return console.error(e.message);
    }
}

export default gameSlice.reducer
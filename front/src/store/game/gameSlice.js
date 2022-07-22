import { createSlice } from "@reduxjs/toolkit";
import { InputStatus, InputType, getGameByPlayer, createDummyGames, getGameById, createGameHelper } from "./gameHelper";
import { ethers } from "ethers";
//import CartesiDapp from "../../../../deployments/localhost/CartesiDApp.json"
import InputFacet from "../../../../deployments/localhost/InputFacet.json"
import ERC20PortalFacet from "../../../../deployments/localhost/ERC20PortalFacet.json"
import CartesiToken from "../../../../deployments/localhost/CartesiToken.json"

import { createClient, defaultExchanges } from '@urql/core';
import { pipe, subscribe } from "wonka";
import { Chess } from "chess.js";

const DAPP_ADDRESS = "0xa37aE2b259D35aF4aBdde122eC90B204323ED304"
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
        games: [],
        bots: [],
        elo: {},
        accounts: {}
    },
    reducers: {
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

export const { setGames, updateGame, addGame, removeGame, setLatestInput, processInput, setInputStatus } = gameSlice.actions

const QUERY = `
    { 
        GetEpochStatus(query:{session_id: "default_rollups_id", epoch_index:"0"})
            { 
                processed_inputs{ 
                    input_index 
                    result{
                        notices{
                            payload
                        } 
                    } 
                } 
            } 
        }
    `;

var cartesiDappContract;
var erc20PortalContract;
var erc20Contract;
var client;
var fn2;

var hexToUtf8 = function( s ){
    return decodeURIComponent( s.replace( /../g, '%$&' ) );
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function updateGameState(dispatch, inputs){
    if(inputs instanceof Array){
        var input = inputs[inputs.length - 1]
        if(input){
            var { input_index } = input
            var { notices } = input.result ?? []
            console.log(notices)
            if(notices instanceof Array){
                var inputsParsed = notices.map((notice) => {
                    var { payload } = notice
                    var {sender,operation,value,success,index, timestamp} = JSON.parse(hexToUtf8(payload))
                    return {
                        sender,
                        operation,
                        value,
                        success,
                        index,
                        timestamp
                    }
                }).sort(function compareFn(a, b){return a.index - b.index})

                inputsParsed.forEach((inputParsed)=>{
                    dispatch(processInput(inputParsed))
                })
            }
        }
    }
}
   
async function poll(dispatch) {
    await delay(5000);
    var result = await client
        .query(QUERY, { })
        .toPromise()
    updateGameState(dispatch, result?.data?.GetEpochStatus?.processed_inputs)
    await poll(dispatch);
}

export const initContracts = (signer) => async dispatch => {
    //init contract
    var inputFacetAbi = InputFacet.abi
    var erc20PortalAbi = ERC20PortalFacet.abi
    var cartesiDappAddress = DAPP_ADDRESS

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

    erc20Contract = new ethers.Contract(
        CartesiToken.address,
        CartesiToken.abi,
        signer
    )

    //instantiate client
    client = createClient({
        url: 'http://localhost:4000/graphql',
        exchanges: defaultExchanges,
        requestPolicy: "network-only"
    })

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

export const depositErc20 = () => async dispatch => {
    try{
        let overrides = {
            gasLimit: 30000000,     
            gasPrice: ethers.utils.parseUnits('9.0', 'gwei'),   
            nonce: 123,
        };

        const erc20Amount = ethers.BigNumber.from(10000000)
        const signerAddress = await erc20PortalContract.signer.getAddress();
        console.log(`using account "${signerAddress}"`);
        const allowance = await erc20Contract.allowance(
            signerAddress,
            erc20PortalContract.address
        );
        if (allowance.lt(erc20Amount)) {
            const allowanceApproveAmount =
                ethers.BigNumber.from(erc20Amount).sub(allowance);
            console.log(
                `approving allowance of ${allowanceApproveAmount} tokens...`
            );
            const tx = await erc20Contract.approve(
                erc20PortalContract.address,
                allowanceApproveAmount
            );
            await tx.wait();
        }

        //send transaction
        console.log(erc20PortalContract)
        const tx = await erc20PortalContract.erc20Deposit(CartesiToken.address, erc20Amount, "0x");
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
        const tx = await cartesiDappContract.addInput(input, overrides)
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

export const createBotGame = (botId1, botId2, matchCount) => async dispatch => {
    try{
        let overrides = {
            gasLimit: 30000000,     
            gasPrice: ethers.utils.parseUnits('9.0', 'gwei'),   
            nonce: 123,
            //blockTag: 33,     
        };

        //send transaction
        const message = `
            {
                "op": "create", 
                "value": {
                    "isBot": true,
                    "botId1": "${botId1}",
                    "botId2": "${botId2}",
                    "matchCount": ${matchCount}
                }
            }
        `;
        const input = ethers.utils.toUtf8Bytes(message)
        const tx = await cartesiDappContract.addInput(input, overrides)
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

export const createGame = () => async dispatch => {
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

        //send transaction
        const message = `{"op": "create", "value": "sds"}`
        const input = ethers.utils.toUtf8Bytes(message)
        const tx = await cartesiDappContract.addInput(input, overrides)
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
        const tx = await cartesiDappContract.addInput(input, overrides)
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
import { Chess } from 'chess.js'

export const InputType = {
    CREATE: "create",
    JOIN: "join",
    LEAVE: "leave", 
    MOVE: "move",
}

export const InputStatus = {
    ACTIVE: "active",
    SUCCESS: "success",
    FAIL: "fail"
}

export const side = {
    WHITE: "white",
    BLACK: "black"
}

export const  generateUUID = () => { // Public Domain/MIT
    var d = new Date().getTime();//Timestamp
    var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16;//random number between 0 and 16
        if(d > 0){//Use timestamp until depleted
            r = (d + r)%16 | 0;
            d = Math.floor(d/16);
        } else {//Use microseconds since page-load if supported
            r = (d2 + r)%16 | 0;
            d2 = Math.floor(d2/16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

export const uciToMove = (value) => {
    var from = value.substring(0, 2)
    var to = value.substring(2, 4)
    return {
        from,
        to,
    }
}

export const createGameHelper = (sender, id, timestamp) => {
    var pgn = new Chess().pgn()
    return { id, pgn, players: [sender], timestamp }
}

export const createDummyGame = () => {
    var board = new Chess(fen);
    return createGame(generateUUID(), board.fen())
}

export const getSide = (game, address) => {
    var index = game?.players?.indexOf(address.toLowerCase())
    return index == 0 ? side.WHITE : side.BLACK
}

export const getTopAddress = (game, address, currentSide) => {
    var addresses = game?.players
    if(addresses?.length > 1)
        return currentSide == side.WHITE ? addresses[1] : addresses[0]
    return "Waiting on player"
}

export const getBottomAddress = (game, address, currentSide) => {
    var addresses = game?.players
    if(addresses?.length > 1)
        return currentSide == side.WHITE ? addresses[0] : addresses[1]
    return address
}

export const isGameActive = (games, id) => {
    return games.find(game => game.id == id) != null
}

export const getGameById = (games, id) => {
    return games.find(game => game.id == id)
}

export const playerIsInGame = (games, address, gameId) => {
    var game = getGameById(games, gameId)
    return game != undefined ? game.players.includes(address.toLowerCase()) : undefined
}

export const canJoinGame = (games, gameId) => {
    var game = getGameById(games, gameId)
    return game != undefined ? game.players.length < 2 : false
}

export const getGameByPlayer = (games, address) => {
    return games.find(game => {
        const tempGameState = new Chess()
        tempGameState.load_pgn(game.pgn?? "")

        const isGameOver = tempGameState.game_over()
        const isInGame = game.players.includes(address)

        return !isGameOver && isInGame

    })
}

export const submitMove = (game, move) => {
    var { id, fen } = game;
    var board = new Chess(fen);
    board.move(move)
    return createGame(
        id,
        board.fen()
    )
}

export const createDummyGames = () => {
    return [
    ]
}
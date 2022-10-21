import Address from "./Address";
import React, { useMemo } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";

import "./Game.css"
import { useParams } from "react-router-dom";
import { isGameActive, getGameById, playerIsInGame, canJoinGame, getSide, getBottomAddress, getTopAddress, side, InputStatus, InputType } from "../state/game/gameHelper";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useCallback } from "react";
import { joinGame, sendMove } from "../state/game/gameSlice";
import { TransactionType } from "../common/types";
import GameMovesView from "./GameMovesView";
import GameTimer from "./GameTimer";
import { useActionCreator, useActionsNotProcessed, useActions } from "../state/game/hooks";
import { useAllTransactions } from "../state/transactions/hooks";
import { Row, Text } from "@nextui-org/react";
import { useToken } from "../hooks/token";
import { ethers } from "ethers";

export default () => {
  let { gameId } = useParams()
  //const dispatch = useDispatch()
  const addAction = useActionCreator()
  const games = useSelector(state => state.game.games);
  const accounts = useSelector(state => state.auth.accounts);
  const inputState = useSelector(state => state.game.currentInputState)
  const isUpToDate = useSelector(state => state.game.cache.isUpToDate)
  const [gameState, setGameState] = useState(new Chess());
  const [gameSide, setGameSide] = useState(side.WHITE)
  const [topAddress, setTopAddress] = useState("")
  const [bottomAddress, setBottomAddress] = useState("")
  const [rightClickedSquares, setRightClickedSquares] = useState({});
  const [moveSquares, setMoveSquares] = useState({});
  const [optionSquares, setOptionSquares] = useState({});
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1)
  const [currentFen, setCurrentFen] = useState()
  const actionsNotProcessed = useActionsNotProcessed()
  const pendingMoves = useMemo(()=>{
    return actionsNotProcessed
      .filter(({transactionInfo}) => transactionInfo.type == TransactionType.SEND_MOVE_INPUT)
      .map(({transactionInfo}) => transactionInfo.value)
  },[actionsNotProcessed])
  const game = useMemo(()=> games[gameId], [games])
  const tokenAddress = useMemo(()=>game.token, [game])
  const token = useToken(tokenAddress)
  const tokenName = token.symbol
  const wagerAmount = useMemo(()=> ethers.utils.formatUnits(ethers.BigNumber.from(game.wagerAmount.toString())), [game])
  const resigner = useMemo(() => game.resigner, [game])
  const topAddressScore = useMemo(() => game.scores[topAddress])
  const bottomAddressScore = useMemo(() => game.scores[bottomAddress])
  const topAddressWinAmount = useMemo(() => wagerAmount*topAddressScore)
  const bottomAddressWinAmount = useMemo(() => wagerAmount*bottomAddressScore)
  const isTurn = gameState.turn() == gameSide[0]
  const minPlayers = useMemo(()=> game.players.length > 1)
  var address = Array.isArray(accounts) && accounts.length > 0 ? accounts[0] : ""

  

  useEffect(() => {
      var isAlreadyInGame = playerIsInGame(games, address, gameId),
      canJoin = canJoinGame(games, gameId),
      gameIsActive = isGameActive(games, gameId),
      game = getGameById(games, gameId)
      if(gameIsActive && !isAlreadyInGame && canJoin){
        addAction({
          type: TransactionType.JOIN_GAME_INPUT,
          roomId: gameId
        })
      }
      setGameSide(getSide(game, address))
      setTopAddress(getTopAddress(getGameById(games, gameId), address, gameSide))
      setBottomAddress(getBottomAddress(getGameById(games, gameId), address, gameSide)) 
  },[isUpToDate])

  useEffect(() => {
      var game = getGameById(games, gameId)
      if(game)
        safeGameMutate((gameValue) => {
          gameValue.load_pgn(game.pgn)
        })
  }, [isUpToDate])

  useEffect(() => {
    var isAtLatestMove = currentMoveIndex >= gameState.history().length - 2 || currentMoveIndex < 0
    console.log(`isLatestMove: ${isAtLatestMove}  currentMoveIndex: ${currentMoveIndex} length: ${gameState.history().length}`)
    if(isAtLatestMove) setCurrentMoveIndex(gameState.history().length - 1)
    setGameHighlights()
  }, [gameState])

  useEffect(()=>{
    const tempGame = new Chess()
    gameState.history().forEach((move, index) => {
        if(index <= currentMoveIndex)
            tempGame.move(move)
    })
    setCurrentFen(tempGame.fen())
    setGameHighlights()
  }, [currentMoveIndex])
  
  useEffect(()=> {
    console.log(pendingMoves)
    safeGameMutate((gameValue) => {
      let game = getGameById(games, gameId)
      gameValue.load_pgn(game.pgn);
      pendingMoves.forEach((mv) => {
        let mov = gameValue.move(mv, {sloppy: true})
        console.log(mov)
      })
    }); 
  },[pendingMoves])

  function safeGameMutate(modify) {
    if(minPlayers)
    setGameState((g) => {
      const update = { ...g };
      modify(update);
      return update;
    });
  }

  function makeRandomMove() {
    const possibleMoves = gameState.moves();
    if (gameState.game_over() || gameState.in_draw() || possibleMoves.length === 0)
      return; // exit if the game is over
    const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    safeGameMutate((game) => {
      game.move(possibleMoves[randomIndex]);
    });
  }

  function isMovePending(move){
    const game = getGameById(games, gameId)
    const tempGameState = new Chess()
    tempGameState.load_pgn(game.pgn)
    const history = tempGameState.history()
    const { san } = move
    return !history.includes(san)
  }

  function setGameHighlights(){
    const history = gameState.history({ verbose: true })
    const lastMove = history[currentMoveIndex]
    if(lastMove){
      const { from, to } = lastMove
      const isPending = isMovePending(lastMove)
      const sourceColor =  !isPending ? 'rgba(150, 255, 0, 0.4)' : 'rgba(105,105,105, 0.4)'
      const targetColor =  !isPending ? 'rgba(150, 255, 0, 0.4)' : 'rgba(105,105,105, 0.4)'
      setMoveSquares({
        [from]: { backgroundColor: sourceColor },
        [to]: { backgroundColor: targetColor }
      });
    }
  }

  function onDrop(sourceSquare, targetSquare) {
    
    var moveUci = sourceSquare + targetSquare
    //if(move.promotion) moveUci += move.promotion
    //dispatch(sendMove(moveUci))
    if(!minPlayers) return false
    addAction({
      type: TransactionType.SEND_MOVE_INPUT,
      roomId: gameId,
      value: moveUci
    })
    return true;
  }

  function onMouseOverSquare(square) {
    getMoveOptions(square);
  }

  // Only set squares to {} if not already set to {}
  function onMouseOutSquare() {
    if (Object.keys(optionSquares).length !== 0) setOptionSquares({});
  }

  function isAddressTurn(address) {
    const game1 = getGameById(games, gameId)
    const tempGameState = new Chess()
    if(!game1) return false
    tempGameState.load_pgn(game1.pgn)
    var isActive = tempGameState.turn() == getSide(game1, address)[0]
    return isActive
  }

  function getDuration() {
    const { duration } = getGameById(games, gameId)?? { duration: 10000000}
    return duration
  }

  function getMoveOptions(square) {
    const moves = gameState.moves({
      square,
      verbose: true
    });
    const isTurn = gameState.turn() == gameSide[0]
    if (moves.length === 0 || !isTurn) {
      return;
    }
    const game = getGameById(games, gameId)


    const newSquares = {};
    moves.map((move) => {
      newSquares[move.to] = {
        background:
        gameState.get(move.to) && gameState.get(move.to).color !== gameState.get(square).color
            ? 'radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)'
            : 'radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)',
        borderRadius: '50%'
      };
      return move;
    });
    newSquares[square] = {
      background: 'rgba(255, 255, 0, 0.4)'
    };
    setOptionSquares(newSquares);
  }

  function onSquareClick() {
    setRightClickedSquares({});
  }

  function onSquareRightClick(square) {
    const colour = 'rgba(0, 0, 255, 0.4)';
    setRightClickedSquares({
      ...rightClickedSquares,
      [square]:
        rightClickedSquares[square] && rightClickedSquares[square].backgroundColor === colour
          ? undefined
          : { backgroundColor: colour }
    });
  }

  const lastMove = useCallback(() => {
    setCurrentMoveIndex(gameState.history().length - 1)
  }, [gameState])

  const firstMove = useCallback(() => {
    setCurrentMoveIndex(0)
  }, [])
  
  const prevMove = useCallback(() => {
    setCurrentMoveIndex(currentMoveIndex - 1)
  }, [currentMoveIndex])

  const nextMove = useCallback(() => {
    setCurrentMoveIndex(currentMoveIndex + 1)
  }, [currentMoveIndex])

  return (
    <div className="game">
        <div className="gameView">
          <Row justify="space-evenly">
            <Address value={topAddress} />
            <Text color="primary" className="tokenValue"> {wagerAmount}  {tokenName}</Text>
            {topAddressWinAmount == 0 ? 
              <div></div> : 
              <Text 
                color={
                  topAddressScore == 0 ? 
                    "error": 
                    topAddressScore == 0.5 ? 
                      "": 
                      "success"
                }
              >
                {topAddressWinAmount ? topAddressWinAmount : ""}
              </Text>
            }
          </Row>
          <Chessboard 
            position={currentFen}
            onPieceDrop={onDrop}
            arePremovesAllowed={false}
            boardOrientation={gameSide}
            onMouseOverSquare={onMouseOverSquare}
            onMouseOutSquare={onMouseOutSquare}
            onSquareClick={onSquareClick}
            onSquareRightClick={onSquareRightClick}
            isDraggablePiece={({ piece }) => piece[0] === gameSide[0]}
            customBoardStyle={{
              borderRadius: '4px',
              boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)'
            }}
            customSquareStyles={{
              ...moveSquares,
              ...optionSquares,
              ...rightClickedSquares
            }}
          />
          <Row justify="space-evenly">
            <Address value={bottomAddress} />
            <Text color="primary" className="tokenValue">{wagerAmount}  {tokenName}</Text>
            {bottomAddressWinAmount == 0 ? 
              <div></div> : 
              <Text 
                color={
                  bottomAddressScore == 0 ? 
                    "error": 
                    bottomAddressScore == 0.5 ? 
                      "": "success"
                }
              >
                {bottomAddressWinAmount ? bottomAddressWinAmount : ""}
              </Text>
            }
          </Row>
        </div>
        <div className="gameMovesView"> 
          <GameMovesView 
            pgn={gameState.pgn()}
            firstMove = {firstMove}
            lastMove = {lastMove}
            nextMove = {nextMove}
            prevMove = {prevMove}
            highlightIndex = {currentMoveIndex}
          />
        </div>
    </div>
  );
}
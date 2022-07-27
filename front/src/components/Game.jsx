import Address from "./Address";
import * as React from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";

import "./Game.css"
import { useParams } from "react-router-dom";
import { isGameActive, getGameById, playerIsInGame, canJoinGame, getSide, getBottomAddress, getTopAddress, side, InputStatus, InputType } from "../store/game/gameHelper";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { joinGame, sendMove } from "../store/game/gameSlice";
import GameMovesView from "./GameMovesView";
import GameTimer from "./GameTimer";

export default () => {
  let { gameId } = useParams()
  const dispatch = useDispatch()
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

  var address = Array.isArray(accounts) && accounts.length > 0 ? accounts[0] : ""

  useEffect(() => {

      var isAlreadyInGame = playerIsInGame(games, address, gameId),
      canJoin = canJoinGame(games, gameId),
      gameIsActive = isGameActive(games, gameId),
      game = getGameById(games, gameId)
      if(gameIsActive && !isAlreadyInGame && canJoin){
        dispatch(joinGame(gameId))
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
    setGameHighlights()
  }, [gameState])

  function safeGameMutate(modify) {
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
    const lastMove = history.pop()
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
    let move = null;
    safeGameMutate((game) => {
      move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q", // always promote to a queen for example simplicity
      });
    });
    if (move === null) return false; // illegal move
    var moveUci = sourceSquare + targetSquare
    if(move.promotion) moveUci += move.promotion
    dispatch(sendMove(moveUci))
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


  return (
    <div className="game">
        <div className="gameView">
            <Address value={topAddress} />
            <Chessboard 
              position={gameState.fen()}
              onPieceDrop={onDrop}
              arePremovesAllowed={true}
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
            <Address value={bottomAddress} />
        </div>
        <div className="gameMovesView"> 
          <GameMovesView pgn={gameState.pgn()}/>
        </div>
    </div>
  );
}
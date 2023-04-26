/*
 * Copyright (C) 2022-2023 Ultrachess team
 * This file is part of Ultrachess - https://github.com/Ultrachess/app
 *
 * SPDX-License-Identifier: Apache-2.0
 * See the file LICENSE for more information.
 */

import Address from "./Address";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";

import "./Game.css";
import { useParams } from "react-router-dom";
import {
  isGameActive,
  getGameById,
  playerIsInGame,
  canJoinGame,
  getSide,
  getBottomAddress,
  getTopAddress,
  side,
} from "../state/game/gameHelper";
import { useSelector } from "react-redux";
import { useEffect, useState, useCallback, useMemo } from "react";
import { TransactionType } from "../common/types";
import GameMovesView from "./GameMovesView";
import {
  useActionCreator,
  useActionsNotProcessed,
  useGame,
} from "../state/game/hooks";
import Flex from "./ui/Flex";
import AssetDisplay from "./AssetDisplay";
import { useTime } from "./ActionView";
import BotMoveStatisticsView from "./BotMoveStatisticsView";
import GameWagersView from "./GameWagersView";
import Button from "./ui/Button";
import { truncateAddress } from "../ether/utils";
import { Text } from "./ui/Text";
import ModalPlaceBet from "./modals/ModalPlaceBet";
import { useWeb3React } from "@web3-react/core";
import { useWindowSize } from "../hooks/ui";
import GameProfile from "./GameProfile";

const placerHolderBotMoveStat = {
  depth: 0,
  seldepth: 0,
  time: 0,
  nodes: 0,
  pv: "",
  score: 0,
  nps: 0,
  tbhits: 0,
  sbhits: 0,
  cpuload: 0,
};

const placeHolderGameWagers = {
  gameId: "",
  openTime: 0,
  duration: 0,
  bets: {},
  pots: {},
  totalPot: 0,
  betsArray: [],
};

export default () => {
  let { gameId } = useParams();
  const current = useTime(1000);
  //const dispatch = useDispatch()
  const addAction = useActionCreator();
  const now = useTime(1000);
  const games = useSelector((state) => state.game.games);
  const accounts = useSelector((state) => state.auth.accounts);
  const { account, chainId } = useWeb3React();
  const inputState = useSelector((state) => state.game.currentInputState);
  const [statustText, setStatusText] = useState("");
  const isUpToDate = useSelector((state) => state.game.cache.isUpToDate);
  const [gameState, setGameState] = useState(new Chess());
  const [gameSide, setGameSide] = useState(side.WHITE);
  const [topAddress, setTopAddress] = useState("");
  const [bottomAddress, setBottomAddress] = useState("");
  const [rightClickedSquares, setRightClickedSquares] = useState({});
  const [moveSquares, setMoveSquares] = useState({});
  const [optionSquares, setOptionSquares] = useState({});
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);
  const [isAutoPlay, setAutoPlay] = useState(false);
  const [currentFen, setCurrentFen] = useState();
  const [selectedPiece, setSelectedPiece] = useState(null);
  const actionsNotProcessed = useActionsNotProcessed();
  const { width } = useWindowSize();

  const isTurn = useMemo(() => {
    if (gameState.turn() === "w") {
      return gameSide === side.WHITE;
    } else {
      return gameSide === side.BLACK;
    }
  }, [gameState, gameSide]);

  console.log("fix: isTurn: ", isTurn);
  console.log("fix: gameSide: ", gameSide);

  //checkt if gameState is an instance of Chess
  const isChess = gameState instanceof Chess;
  if (isChess) {
    console.log("gameState is not an instance of Chess");
  }
  const pendingMoves = useMemo(() => {
    return actionsNotProcessed
      .filter(
        ({ transactionInfo }) =>
          transactionInfo.type == TransactionType.SEND_MOVE_INPUT
      )
      .map(({ transactionInfo }) => transactionInfo.value);
  }, [actionsNotProcessed]);
  const game = useGame(gameId);
  const tokenAddress = game.token;
  const wagerAmount = game.wagerAmount / 10 ** 18;
  const topAddressScore = useMemo(
    () => game.scores[topAddress],
    [topAddress, isUpToDate]
  );
  const bottomAddressScore = useMemo(
    () => game.scores[bottomAddress],
    [bottomAddress, isUpToDate]
  );
  const completed = game.isEnd;
  const topAddressLost = useMemo(() => topAddressScore == 0, [topAddressScore]);
  const bottomAddressLost = useMemo(
    () => bottomAddressScore == 0,
    [bottomAddressScore]
  );
  const topAddressIsBot = useMemo(
    () =>
      topAddress
        ? !topAddress.includes("0x") && !topAddress.includes("Waiting")
        : false,
    [topAddress]
  );
  const bottomAddressIsBot = useMemo(
    () => (bottomAddress ? !bottomAddress.startsWith("0x") : false),
    [bottomAddress]
  );
  const topAddressWon = topAddressScore == 1;
  const bottomAddressWon = bottomAddressScore == 1;
  
  //get whether bottom address is turn using gameSide and bottomAddress
  const bottomAddressIsTurn = useMemo(() => {
    if (gameSide === side.WHITE) {
      return bottomAddress === account;
    } else {
      return bottomAddress === account;
    }
  }, [gameSide, bottomAddress, account]);

  const topAddressIsTurn = useMemo(() => {
    if (gameSide === side.WHITE) {
      return topAddress === account;
    } else {
      return topAddress === account;
    }
  }, [gameSide, topAddress, account]);
    
  const draw = topAddressScore == 0.5 && bottomAddressScore == 0.5;
  const winningId = useMemo(() => {
    if (topAddressWon) return topAddress;
    if (bottomAddressWon) return bottomAddress;
    if (draw) return "DRAW";
    return null;
  }, [topAddressWon, bottomAddressWon]);
  const isWaitingWaitingForPlayerToJoin = useMemo(() => {
    return topAddress.includes("Waiting") || bottomAddress.includes("Waiting");
  }, [topAddress, bottomAddress]);

  const bettingOpenTime = game?.wagering?.openTime ?? -1;
  const bettingClosesAt = bettingOpenTime + game?.bettingDuration;
  const isWaitingForAPlayer =
    topAddress === undefined || bottomAddress === undefined;
  const isInGame =
    (topAddress?.toLowerCase() ?? "") === account?.toLowerCase() ||
    (topAddress?.toLowerCase() ?? "") === account?.toLowerCase();

  const bettingHasStarted = bettingOpenTime > 0;
  const bettingHasStartedBeforeCurrent = bettingOpenTime < current;
  const bettingIsOpen =
    bettingHasStarted &&
    bettingHasStartedBeforeCurrent &&
    bettingClosesAt > current / 1000;
  const bettingIsClosed = !bettingIsOpen;
  const canBet = bettingIsOpen && !isWaitingForAPlayer;

  //console.log("side1" + gameSide)
  //console.log("topAddress1" + topAddress)
  //console.log("bottomAddress1" + bottomAddress)
  //console.log("topScore1" + topAddressScore)
  //console.log("topAddressIsBot1" + topAddressIsBot)
  //console.log("bottomAddressIsBot1" + bottomAddressIsBot)

  const topAddressWinAmount = useMemo(() => wagerAmount * topAddressScore);
  //console.log("topWin" + topAddressWinAmount)
  const bottomAddressWinAmount = useMemo(
    () => wagerAmount * bottomAddressScore
  );
  //console.log("bottomWin" + bottomAddressWinAmount)

  const minPlayers = useMemo(() => game.players.length > 1);
  var address = account ?? "";

  //auto play and loop useEffect.
  //checks if autoplay is on and automatically increments the move index every second
  //asynchronously
  useEffect(() => {
    if (isAutoPlay) {
      var interval = setInterval(() => {
        if (currentMoveIndex < gameState?.history().length - 1)
          setCurrentMoveIndex(currentMoveIndex + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlay, currentMoveIndex]);

  //updates the game state when the game changes
  useEffect(() => {
    var isAlreadyInGame = playerIsInGame(games, address, gameId),
      canJoin = canJoinGame(games, gameId),
      gameIsActive = isGameActive(games, gameId),
      game = getGameById(games, gameId);
    if (gameIsActive && !isAlreadyInGame && canJoin) {
      addAction({
        type: TransactionType.JOIN_GAME_INPUT,
        roomId: gameId,
      });
      //console.log("attempting to join game")
    }
    console.log("fix: setting gameside", getSide(game, address));
    setGameSide(getSide(game, address));
  }, [isUpToDate]);

  useEffect(() => {
    setTopAddress(getTopAddress(getGameById(games, gameId), address, gameSide));
    setBottomAddress(
      getBottomAddress(getGameById(games, gameId), address, gameSide)
    );
  }, [gameSide, game, isUpToDate]);

  useEffect(() => {
    var game = getGameById(games, gameId);
    if (game)
      safeGameMutate((gameValue) => {
        if (gameValue.loadPgn) gameValue.loadPgn(game.pgn);

        if (gameValue instanceof Chess) {
          console.log("game is instance of chess");
        } else {
          console.log("game is not instance of chess");
        }
      });
  }, [isUpToDate]);

  useEffect(() => {
    var isAtLatestMove =
      currentMoveIndex >= gameState?.history().length - 2 ||
      currentMoveIndex < 0;
    //console.log(`isLatestMove: ${isAtLatestMove}  currentMoveIndex: ${currentMoveIndex} length: ${gameState?.history().length}`)
    if (isAtLatestMove) setCurrentMoveIndex(gameState?.history().length - 1);
    setGameHighlights();
  }, [gameState]);

  useEffect(() => {
    const tempGame = new Chess();
    gameState?.history().forEach((move, index) => {
      if (index <= currentMoveIndex) tempGame.move(move);
    });
    setCurrentFen(tempGame.fen());
    setGameHighlights();
  }, [currentMoveIndex]);

  useEffect(() => {
    //console.log(pendingMoves)
    safeGameMutate((gameValue) => {
      let game = getGameById(games, gameId);
      gameValue.loadPgn(game.pgn);
      pendingMoves.forEach((mv) => {
        let mov = gameValue.move(mv, { sloppy: true });
        //console.log(mov)
      });

      if (game instanceof Chess) {
        console.log("game is instance of chess");
      } else {
        console.log("game is not instance of chess");
      }
    });
  }, [pendingMoves]);

  //create an alert when the game is over
  //only if the game is over and the user is in the game
  //alert winnings as well
  useEffect(() => {
    //console.log("end has just come")
    if (completed && playerIsInGame(games, address, gameId)) {
      //console.log("end has just come and you are in the game")
      // if (topAddressWon)
      //   alert(
      //     "You lost " +
      //       topAddressWinAmount +
      //       " " +
      //       tokenAddress +
      //       " to " +
      //       topAddress
      //   );
      // if (bottomAddressWon)
      //   alert(
      //     "You lost " +
      //       bottomAddressWinAmount +
      //       " " +
      //       tokenAddress +
      //       " to " +
      //       bottomAddress
      //   );
      // if (draw) alert("You tied with " + topAddress + " and " + bottomAddress);
    }
  }, [completed, isUpToDate]);

  //initailize index to 0
  useEffect(() => {
    if (completed && !playerIsInGame(games, address, gameId))
      setCurrentMoveIndex(0);
  }, [gameId, completed]);

  function safeGameMutate(modify) {
    if (minPlayers)
      setGameState((g) => {
        const update = new Chess(g.fen());

        modify(update);
        return update;
      });
  }

  function makeRandomMove() {
    const possibleMoves = gameState?.moves();
    if (
      gameState?.game_over() ||
      gameState?.in_draw() ||
      possibleMoves.length === 0
    )
      return; // exit if the game is over
    const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    safeGameMutate((game) => {
      game.move(possibleMoves[randomIndex]);
      //check if game is instance of chess
      if (game instanceof Chess) {
        console.log("game is instance of chess");
      } else {
        console.log("game is not instance of chess");
      }
    });
  }

  function isMovePending(move) {
    const game = getGameById(games, gameId);
    const tempGameState = new Chess();
    tempGameState?.loadPgn(game.pgn);
    const history = tempGameState?.history();
    const { san } = move;
    return !history.includes(san);
  }

  function setGameHighlights() {
    const history = gameState?.history({ verbose: true });
    const lastMove = history[currentMoveIndex];
    if (lastMove) {
      const { from, to } = lastMove;
      const isPending = isMovePending(lastMove);
      const sourceColor = !isPending
        ? "rgba(150, 255, 0, 0.4)"
        : "rgba(105,105,105, 0.4)";
      const targetColor = !isPending
        ? "rgba(150, 255, 0, 0.4)"
        : "rgba(105,105,105, 0.4)";
      setMoveSquares({
        [from]: { backgroundColor: sourceColor },
        [to]: { backgroundColor: targetColor },
      });
    }
  }

  function onDrop(sourceSquare, targetSquare) {
    var moveUci = sourceSquare + targetSquare;
    //if(move.promotion) moveUci += move.promotion
    //dispatch(sendMove(moveUci))
    const moves = gameState?.moves({
      sourceSquare,
      verbose: true,
    });
    const isMoveValid = moves.some((move) => moveUci === move.lan);
    const isTurnd = gameState?.turn() == gameSide[0];
    if (!minPlayers) return false;
    if (!isTurnd) return false;
    if (!isMoveValid) return false;

    addAction({
      type: TransactionType.SEND_MOVE_INPUT,
      roomId: gameId,
      value: moveUci,
    });
    return true;
  }

  function onMouseOverSquare(square) {
    if (selectedPiece == null) getMoveOptions(square);
  }

  // Only set squares to {} if not already set to {}
  function onMouseOutSquare() {
    if (Object.keys(optionSquares).length !== 0 && selectedPiece === null)
      setOptionSquares({});
  }

  function isAddressTurn(address) {
    const game1 = getGameById(games, gameId);
    const tempGameState = new Chess();
    if (!game1) return false;
    tempgameState?.loadPgn(game1.pgn);
    var isActive = tempgameState?.turn() == getSide(game1, address)[0];
    return isActive;
  }

  function getDuration() {
    const { duration } = getGameById(games, gameId) ?? { duration: 10000000 };
    return duration;
  }

  function getMoveOptions(square) {
    const moves = gameState?.moves({
      square,
      verbose: true,
    });
    const isTurn = gameState?.turn() == gameSide[0];
    if (moves.length === 0 || !isTurn) {
      return;
    }
    const game = getGameById(games, gameId);

    const newSquares = {};
    moves.map((move) => {
      const getTo = gameState?.get
        ? gameState?.get(move.to)
        : { color: "white" };
      const getSquare = gameState?.get
        ? gameState?.get(square)
        : { color: "white" };
      newSquares[move.to] = {
        background:
          getTo && getTo.color !== getSquare.color
            ? "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)"
            : "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
        borderRadius: "50%",
      };
      return move;
    });
    newSquares[square] = {
      background: "rgba(255, 255, 0, 0.4)",
    };
    setOptionSquares(newSquares);
  }

  function onSquareClick(square) {
    setRightClickedSquares({});
    getMoveOptions(square);
    if (selectedPiece && selectedPiece != square && optionSquares[square]) {
      onDrop(selectedPiece, square);
      setSelectedPiece(null);
    } else {
      //check if your piece is on this square
      const piece = gameState?.get ? gameState?.get(square) : null;
      if (piece && piece.color == gameSide[0]) setSelectedPiece(square);
    }
  }

  function onPieceClick(piece) {
    // const square = piece.square
    // setRightClickedSquares({});
    // getMoveOptions(square);
    // if(selectedPiece){
    //   onDrop(selectedPiece, square)
    //   setSelectedPiece(null)
    // }else{
    //   //check if your piece is on this square
    //   const piece = gameState?.get(square)
    //   if(piece && piece.color == gameSide[0])
    //     setSelectedPiece(square)
    // }
  }

  function onSquareRightClick(square) {
    setSelectedPiece(null);
    const colour = "rgba(0, 0, 255, 0.4)";
    setRightClickedSquares({
      ...rightClickedSquares,
      [square]:
        rightClickedSquares[square] &&
        rightClickedSquares[square].backgroundColor === colour
          ? undefined
          : { backgroundColor: colour },
    });
  }

  const lastMove = useCallback(() => {
    setCurrentMoveIndex(
      gameState?.history ? gameState?.history().length - 1 : 0
    );
  }, [gameState]);

  const firstMove = useCallback(() => {
    setCurrentMoveIndex(0);
  }, []);

  const prevMove = useCallback(() => {
    setCurrentMoveIndex(currentMoveIndex - 1);
  }, [currentMoveIndex]);

  const nextMove = useCallback(() => {
    setCurrentMoveIndex(currentMoveIndex + 1);
  }, [currentMoveIndex]);

  const autoPlay = useCallback(() => {
    setAutoPlay(!isAutoPlay);
  }, [isAutoPlay]);

  const jumpTo = useCallback((index) => {
    setCurrentMoveIndex(index);
  }, []);

  const tweetGame = () => {
    const tweetText = `Hey check out this match on Ultrachess.org http://ultrachess.org/game/${gameId}`;
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      tweetText
    )}`;
    window.open(tweetUrl, "_blank");
  };

  const getLastProcessedBotMoveIndexFromCurrentIndex = (index) => {
    const botMoveStats = game.botMoveStats;
    //get the last processed bot move that is closest to the current index and less than or equal to the current index
    //by checking if botMoveStats[index] is undefined, we can check if the bot has processed the move at index
    //if it is undefined, then we know the bot has not processed the move at index, so we can decrement index and check again
    if (index < 0) return 0;
    while (botMoveStats[index] === undefined && index > 0) {
      index--;
    }
    return index;
  };

  const chessBoardWidth = useMemo(() => {
    if (width < 768) {
      console.log("window", width * 0.9);
      return width * 0.9;
    } else if (width >= 768 && width < 1024) {
      console.log("window", width * 0.7);
      return width * 0.7;
    } else {
      console.log("window", width * 0.5);
      return width * 0.5;
    }
  }, [width]);

  return (
    <div class="min-h-full">
      <div class="mx-auto max-w-7xl sm:px-6">
        <div className="flex flex-col lg:flex-row items-center justify-between min-h-[90vh]">
          <div className="flex flex-col gap-2 w-full md:w-4/5 lg:w-1/2 px-6 lg:px-0">
            <div className="flex w-full justify-between items-center">
            <div className="flex gap-2">
                <GameProfile address={topAddress} chainId={chainId} />
                {(topAddressIsBot) && (
                  <div role="status">
                      <svg aria-hidden="true" class="w-3 h-4 mr-3 text-blue-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                      </svg>
                      <span class="sr-only">Loading...</span>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                {completed && (
                  <Text size={"4"} faded>
                    +{topAddressScore}
                  </Text>
                )}
                {topAddressWon ? (
                  <AssetDisplay
                    green={true}
                    tokenAddress={tokenAddress}
                    balance={wagerAmount}
                  />
                ) : topAddressLost ? (
                  <AssetDisplay
                    red={true}
                    tokenAddress={tokenAddress}
                    balance={wagerAmount}
                  />
                ) : draw ? (
                  <AssetDisplay
                    grey={true}
                    tokenAddress={tokenAddress}
                    balance={wagerAmount}
                  />
                ) : (
                  <AssetDisplay
                    blue={true}
                    tokenAddress={tokenAddress}
                    balance={wagerAmount}
                  />
                )}
              </div>
            </div>
            {topAddressIsBot && (
              <BotMoveStatisticsView
                botMoveStat={
                  game?.botMoveStats[
                    getLastProcessedBotMoveIndexFromCurrentIndex(
                      currentMoveIndex
                    )
                  ] ?? placerHolderBotMoveStat
                }
              />
            )}
            <Chessboard
              className="w-full"
              position={currentFen}
              onPieceDrop={onDrop}
              arePremovesAllowed={false}
              boardOrientation={gameSide}
              onMouseOverSquare={onMouseOverSquare}
              onMouseOutSquare={onMouseOutSquare}
              onSquareClick={onSquareClick}
              onSquareRightClick={onSquareRightClick}
              onPieceClick={onPieceClick}
              isDraggablePiece={({ piece }) => piece[0] === gameSide[0]}
              customBoardStyle={{
                borderRadius: "4px",
              }}
              customSquareStyles={{
                ...moveSquares,
                ...optionSquares,
                ...rightClickedSquares,
              }}
            />
            {bottomAddressIsBot && (
              <BotMoveStatisticsView
                botMoveStat={
                  game.botMoveStats[
                    getLastProcessedBotMoveIndexFromCurrentIndex(
                      currentMoveIndex
                    )
                  ]
                }
              />
            )}

            <div className="flex w-full justify-between items-center">
              <div className="flex gap-2">
                <GameProfile address={bottomAddress} chainId={chainId} />
                {(bottomAddressIsBot && bottomAddressIsTurn) && (
                  <div role="status">
                      <svg aria-hidden="true" class="w-3 h-4 mr-3 text-blue-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                      </svg>
                      <span class="sr-only">Loading...</span>
                  </div>
                )}
              </div>
              <div className="flex gap-2 items-center">
                {completed && (
                  <Text size={"4"} faded>
                    +{bottomAddressScore}
                  </Text>
                )}
                {bottomAddressWon ? (
                  <AssetDisplay
                    green={true}
                    tokenAddress={tokenAddress}
                    balance={wagerAmount}
                  />
                ) : bottomAddressLost ? (
                  <AssetDisplay
                    red={true}
                    tokenAddress={tokenAddress}
                    balance={wagerAmount}
                  />
                ) : draw ? (
                  <AssetDisplay
                    grey={true}
                    tokenAddress={tokenAddress}
                    balance={wagerAmount}
                  />
                ) : (
                  <AssetDisplay
                    blue={true}
                    tokenAddress={tokenAddress}
                    balance={wagerAmount}
                  />
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 w-full md:w-2/3 lg:w-2/5 mt-8 md:mt-0">
            <div className="flex gap-4 w-full md:w-auto flex-row items-center justify-end">
              {bettingIsClosed ? (
                <Text blue>Wagering Closed</Text>
              ) : (
                <Text faded>Wagering closes on {bettingClosesAt}</Text>
              )}
              {canBet && (
                <ModalPlaceBet
                  gameId={gameId}
                  triggerElement={
                    <Button blue disabled={closed}>
                      Place Bet
                    </Button>
                  }
                />
              )}
              <Button onClick={tweetGame}>Share</Button>
            </div>
            <div className="flex justify-start">
              {completed && !draw && (
                <Text green>
                  Game completed.{" "}
                  <span style={{ textDecoration: "underline" }}>
                    {truncateAddress(winningId)}
                  </span>{" "}
                  won {wagerAmount} CTSI
                </Text>
              )}
              {draw && <Text faded>Game completed. Draw</Text>}
            </div>
            {game.bettingDuration > 0 && (
              <GameWagersView
                winningId={winningId}
                wagers={
                  game.wagering == {} || game.wagering == undefined
                    ? placeHolderGameWagers
                    : game.wagering
                }
                now={now}
                p1={topAddress}
                p2={bottomAddress}
              />
            )}
            <GameMovesView
              pgn={gameState?.pgn ? gameState?.pgn() : ""}
              firstMove={firstMove}
              lastMove={lastMove}
              nextMove={nextMove}
              prevMove={prevMove}
              autoPlay={autoPlay}
              jumpTo={jumpTo}
              highlightIndex={currentMoveIndex}
              botMoveStats={game.botMoveStats}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

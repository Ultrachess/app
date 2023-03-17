import Address from "./Address";
import React, { useMemo } from "react";
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
  InputStatus,
  InputType,
} from "../state/game/gameHelper";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useCallback } from "react";
import { joinGame, sendMove } from "../state/game/gameSlice";
import { TransactionType } from "../common/types";
import GameMovesView from "./GameMovesView";
import GameTimer from "./GameTimer";
import {
  useActionCreator,
  useActionsNotProcessed,
  useActions,
  useGame,
} from "../state/game/hooks";
import { useAllTransactions } from "../state/transactions/hooks";
import { Row } from "@nextui-org/react";
import { useToken } from "../hooks/token";
import { ethers } from "ethers";
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
  const { account } = useWeb3React();
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

  const isTurn = gameState.turn() == gameSide[0];
  const minPlayers = useMemo(() => game.players.length > 1);
  var address =
    Array.isArray(accounts) && accounts.length > 0 ? accounts[0] : "";

  //auto play and loop useEffect.
  //checks if autoplay is on and automatically increments the move index every second
  //asynchronously
  useEffect(() => {
    if (isAutoPlay) {
      var interval = setInterval(() => {
        if (currentMoveIndex < gameState.history().length - 1)
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
        gameValue.load_pgn(game.pgn);
      });
  }, [isUpToDate]);

  useEffect(() => {
    var isAtLatestMove =
      currentMoveIndex >= gameState.history().length - 2 ||
      currentMoveIndex < 0;
    //console.log(`isLatestMove: ${isAtLatestMove}  currentMoveIndex: ${currentMoveIndex} length: ${gameState.history().length}`)
    if (isAtLatestMove) setCurrentMoveIndex(gameState.history().length - 1);
    setGameHighlights();
  }, [gameState]);

  useEffect(() => {
    const tempGame = new Chess();
    gameState.history().forEach((move, index) => {
      if (index <= currentMoveIndex) tempGame.move(move);
    });
    setCurrentFen(tempGame.fen());
    setGameHighlights();
  }, [currentMoveIndex]);

  useEffect(() => {
    //console.log(pendingMoves)
    safeGameMutate((gameValue) => {
      let game = getGameById(games, gameId);
      gameValue.load_pgn(game.pgn);
      pendingMoves.forEach((mv) => {
        let mov = gameValue.move(mv, { sloppy: true });
        //console.log(mov)
      });
    });
  }, [pendingMoves]);

  //create an alert when the game is over
  //only if the game is over and the user is in the game
  //alert winnings as well
  useEffect(() => {
    //console.log("end has just come")
    if (completed && playerIsInGame(games, address, gameId)) {
      //console.log("end has just come and you are in the game")
      if (topAddressWon)
        alert(
          "You lost " +
            topAddressWinAmount +
            " " +
            tokenAddress +
            " to " +
            topAddress
        );
      if (bottomAddressWon)
        alert(
          "You lost " +
            bottomAddressWinAmount +
            " " +
            tokenAddress +
            " to " +
            bottomAddress
        );
      if (draw) alert("You tied with " + topAddress + " and " + bottomAddress);
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
        const update = { ...g };
        modify(update);
        return update;
      });
  }

  function makeRandomMove() {
    const possibleMoves = gameState.moves();
    if (
      gameState.game_over() ||
      gameState.in_draw() ||
      possibleMoves.length === 0
    )
      return; // exit if the game is over
    const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    safeGameMutate((game) => {
      game.move(possibleMoves[randomIndex]);
    });
  }

  function isMovePending(move) {
    const game = getGameById(games, gameId);
    const tempGameState = new Chess();
    tempGameState.load_pgn(game.pgn);
    const history = tempGameState.history();
    const { san } = move;
    return !history.includes(san);
  }

  function setGameHighlights() {
    const history = gameState.history({ verbose: true });
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
    if (!minPlayers) return false;
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
    tempGameState.load_pgn(game1.pgn);
    var isActive = tempGameState.turn() == getSide(game1, address)[0];
    return isActive;
  }

  function getDuration() {
    const { duration } = getGameById(games, gameId) ?? { duration: 10000000 };
    return duration;
  }

  function getMoveOptions(square) {
    const moves = gameState.moves({
      square,
      verbose: true,
    });
    const isTurn = gameState.turn() == gameSide[0];
    if (moves.length === 0 || !isTurn) {
      return;
    }
    const game = getGameById(games, gameId);

    const newSquares = {};
    moves.map((move) => {
      newSquares[move.to] = {
        background:
          gameState.get(move.to) &&
          gameState.get(move.to).color !== gameState.get(square).color
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
      const piece = gameState.get(square);
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
    //   const piece = gameState.get(square)
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
    setCurrentMoveIndex(gameState.history().length - 1);
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

  return (
    <Flex
      css={{
        flexDirection: "row",
        gap: 120,
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Flex
        css={{ gap: 10, flexDirection: "column", alignItems: "flex-start" }}
      >
        <Flex
          css={{
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Address isMedium value={topAddress} />
          <Flex css={{ gap: 1 }}>
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
          </Flex>
        </Flex>
        {topAddressIsBot && (
          <BotMoveStatisticsView
            botMoveStat={
              game?.botMoveStats[
                getLastProcessedBotMoveIndexFromCurrentIndex(currentMoveIndex)
              ] ?? placerHolderBotMoveStat
            }
          />
        )}
        <Chessboard
          boardWidth={700}
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
            boxShadow: "0 2px 7px rgba(0, 0, 0, 0.5)",
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
                getLastProcessedBotMoveIndexFromCurrentIndex(currentMoveIndex)
              ]
            }
          />
        )}

        <Flex
          css={{
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Address isMedium value={bottomAddress} />
          <Flex css={{ gap: 1, alignItems: "center" }}>
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
          </Flex>
        </Flex>
      </Flex>
      <Flex css={{ flexDirection: "column", gap: 10 }}>
        <Flex
          css={{
            gap: "10px",
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "right",
          }}
        >
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
        </Flex>
        <Flex css={{ justifyContent: "left", paddingBottom: "20px" }}>
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
        </Flex>
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
          pgn={gameState.pgn()}
          firstMove={firstMove}
          lastMove={lastMove}
          nextMove={nextMove}
          prevMove={prevMove}
          autoPlay={autoPlay}
          jumpTo={jumpTo}
          highlightIndex={currentMoveIndex}
          botMoveStats={game.botMoveStats}
        />
      </Flex>
    </Flex>
  );
};

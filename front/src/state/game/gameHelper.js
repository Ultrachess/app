/*
 * Copyright (C) 2022-2023 Ultrachess team
 * This file is part of Ultrachess - https://github.com/Ultrachess/app
 *
 * SPDX-License-Identifier: Apache-2.0
 * See the file LICENSE for more information.
 */

import { Chess } from "chess.js";

export const InputType = {
  CREATE: "create",
  JOIN: "join",
  LEAVE: "leave",
  MOVE: "move",
};

export const InputStatus = {
  ACTIVE: "active",
  SUCCESS: "success",
  FAIL: "fail",
};

export const side = {
  WHITE: "white",
  BLACK: "black",
};

export const generateUUID = () => {
  // Public Domain/MIT
  var d = new Date().getTime(); //Timestamp
  var d2 =
    (typeof performance !== "undefined" &&
      performance.now &&
      performance.now() * 1000) ||
    0; //Time in microseconds since page-load or 0 if unsupported
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = Math.random() * 16; //random number between 0 and 16
    if (d > 0) {
      //Use timestamp until depleted
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      //Use microseconds since page-load if supported
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
};

export const uciToMove = (value) => {
  var from = value.substring(0, 2);
  var to = value.substring(2, 4);
  return {
    from,
    to,
  };
};

export const createGameHelper = (sender, id, timestamp) => {
  var pgn = new Chess().pgn();
  return { id, pgn, players: [sender], timestamp };
};

export const createDummyGame = () => {
  var board = new Chess(fen);
  return createGame(generateUUID(), board.fen());
};

export const getSide = (game, address) => {
  var index = game?.players
    ?.map((val) => val.toLowerCase())
    .indexOf(address.toLowerCase());
  //console.log(`address ${address}  index ${index}`)
  return index == 0 ? side.WHITE : side.BLACK;
};

export const getTopAddress = (game, address, currentSide) => {
  var addresses = game?.players;
  if (addresses?.length > 1)
    return currentSide == side.WHITE ? addresses[1] : addresses[0];
  return "Waiting on player";
};

export const getBottomAddress = (game, address, currentSide) => {
  var addresses = game?.players;
  if (addresses?.length > 1)
    return currentSide == side.WHITE ? addresses[0] : addresses[1];
  return address;
};

export const isGameActive = (games, id) => {
  return games[id] != null;
};

export const getGameById = (games, id) => {
  return games[id];
};

export const playerIsInGame = (games, address, gameId) => {
  var game = getGameById(games, gameId);
  return game != undefined
    ? game.players.includes(address.toLowerCase())
    : undefined;
};

export const canJoinGame = (games, gameId) => {
  var game = getGameById(games, gameId);
  return game != undefined ? game.players.length < 2 : false;
};

export const getGameByPlayer = (games, address) => {
  for (var key in games) {
    if (games.hasOwnProperty(key)) {
      var game = games[key];
      const tempGameState = new Chess();
      tempGameState.load_pgn(game.pgn ?? "");

      const isGameOver = tempGameState.game_over();
      const isInGame = game.players.includes(address);

      if (!isGameOver && isInGame) return game;
    }
  }
};

export const submitMove = (game, move) => {
  var { id, fen } = game;
  var board = new Chess(fen);
  board.move(move);
  return createGame(id, board.fen());
};

export const createDummyGames = () => {
  return [];
};

export function createPromise(handler) {
  var resolve, reject;

  var promise = new Promise(function (_resolve, _reject) {
    resolve = _resolve;
    reject = _reject;
    if (handler) handler(resolve, reject);
  });

  promise.resolve = resolve;
  promise.reject = reject;
  return promise;
}

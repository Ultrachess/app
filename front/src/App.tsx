/*
 * Copyright (C) 2022-2023 Ultrachess team
 * This file is part of Ultrachess - https://github.com/Ultrachess/app
 *
 * SPDX-License-Identifier: Apache-2.0
 * See the file LICENSE for more information.
 */

import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Route, Routes } from "react-router-dom";

import Body from "./components/Body";
import BotManager from "./components/BotManager";
import BotProfile from "./components/BotProfile";
import Game from "./components/Game";
import Navbar from "./components/Navbar";
import Notifications from "./components/Notifications";
import PageKingOfTheHill from "./components/PageKingOfTheHill";
import Profile from "./components/Profile";
import Rankings from "./components/Rankings";
import Tournaments from "./components/Tournaments";
import TournamentView from "./components/TournamentView";
import TransitionManager from "./components/TransitionManager";
import { GameStateUpdater } from "./state/game/updater";
import { TransactionUpdater } from "./state/transactions/updater";

function App() {
  const [count, setCount] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {});

  return (
    <div className="App">
      <TransitionManager />
      <TransactionUpdater />
      <GameStateUpdater />
      <Notifications />
      <Navbar />
      <Routes>
        <Route path="/" element={<Body />} />
        <Route path="about" element={<Body />} />
        <Route path="rankings" element={<Rankings />} />
        <Route path="bots" element={<BotManager />} />
        <Route path="tournaments" element={<Tournaments />} />
        <Route path="tournament/:tournamentId" element={<TournamentView />} />
        <Route path="/game/:gameId" element={<Game />} />
        <Route path="/users/:userId" element={<Profile />} />
        <Route path="/bot/:botId" element={<BotProfile />} />
        <Route path="koh" element={<PageKingOfTheHill />} />
      </Routes>
    </div>
  );
}

export default App;

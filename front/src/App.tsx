import { useState, useEffect } from 'react'
import logo from './logo.svg'
import './App.css'
import Navbar from './components/Navbar';
import Body from './components/Body';
import Profile from './components/Profile'
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom"; 
import Game from './components/Game';
import { useDispatch } from 'react-redux';
import { fetchGames } from './state/game/gameSlice';
import BotManager from './components/BotManager';
import { TransactionUpdater } from './state/transactions/updater';
import { GameStateUpdater } from './state/game/updater';
import Notifications from './components/Notifications';
import 'bootstrap/dist/css/bootstrap.min.css';
import TransitionManager from './components/TransitionManager';

function App() {
  const [count, setCount] = useState(0)
  var dispatch = useDispatch()

  useEffect(() => {
  })

  return (
    <div className="App">
      <TransitionManager/>
      <GameStateUpdater/>
      <Notifications/>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Body />} />
        <Route path="about" element={<Body />} />
        <Route path="rankings" element={<Body />} />
        <Route path="bots" element={<BotManager />} />
        <Route path="/game/:gameId" element={<Game />} />
        <Route path="/users/:userId" element={<Profile/>} />
      </Routes>
    </div>
  )
}

export default App

import * as React from "react";
import Auth from "./Auth";
import Title from "./Title";
import { Text, Spacer, Button } from "@nextui-org/react";
import "./Navbar.css"
import { Link } from "react-router-dom";
import logo from "../assets/horse.png"

export default () => {
  const [mainItems, setMainItems] = React.useState([]);
  return (
    <nav >
      <div className="center">
        <div className="nav-left">
          <Link to="/"><img className="logo" src={logo} alt="logo" /></Link>
          <Button className="navItem" light color="default" auto><Link color="default" to="/game">Play</Link></Button>
          <Button className="navItem" light color="default" auto>About</Button>
          <Button className="navItem" light color="default" auto><Link to="/rankings">Rankings</Link></Button>
          <Button className="navItem" light color="default" auto><Link to="/bots">Bots</Link></Button>
        </div>
        <div className="nav-right">
          <Auth/>
        </div>
      </div>
      
    </nav>
  );
}
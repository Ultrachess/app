/*
 * Copyright (C) 2022-2023 Ultrachess team
 * This file is part of Ultrachess - https://github.com/Ultrachess/app
 *
 * SPDX-License-Identifier: Apache-2.0
 * See the file LICENSE for more information.
 */

import * as React from "react";
import Auth from "./Auth";
import { Button } from "@nextui-org/react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import logo from "../assets/horse.png";
import { Text } from "./ui/Text";

export default () => {
  const [mainItems, setMainItems] = React.useState([]);
  return (
    <nav>
      <div className="center">
        <div className="nav-left">
          <Link to="/">
            <img className="logo" src={logo} alt="logo" />
          </Link>
          <Button className="navItem" light color="default" auto>
            <Text link>About</Text>
          </Button>
          <Button className="navItem" light color="default" auto>
            <Link className="noUnderLine" to="/rankings">
              <Text link>Rankings</Text>
            </Link>
          </Button>
          <Button className="navItem" light color="default" auto>
            <Link className="noUnderLine" to="/bots">
              <Text link>Bots</Text>
            </Link>
          </Button>
          <Button className="navItem" light color="default" auto>
            <Link className="noUnderLine" to="/tournaments">
              <Text link>Tournaments</Text>
            </Link>
          </Button>
          <Button className="navItem" light color="default" auto>
            <Link className="noUnderLine" to="/koh">
              <Text link>KOH</Text>
            </Link>
          </Button>
        </div>
        <div className="nav-right">
          <Auth />
        </div>
      </div>
    </nav>
  );
};

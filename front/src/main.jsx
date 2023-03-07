import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { NextUIProvider } from "@nextui-org/react";
import { store } from "./state/index";
import { Provider } from "react-redux";
import { Web3ReactProvider } from "@web3-react/core";
import { ethers } from "ethers";
import { BrowserRouter as Router } from "react-router-dom";
import { metaMask, hooks as metaMaskHooks } from "./ether/connectors/metaMask";
import { TransactionUpdater } from "./state/transactions/updater";

const connectors = [[metaMask, metaMaskHooks]];

ReactDOM.render(
  <Provider store={store}>
    <Web3ReactProvider connectors={connectors}>
      <Router>
        <NextUIProvider>
          <React.StrictMode>
            <App />
          </React.StrictMode>
        </NextUIProvider>
      </Router>
    </Web3ReactProvider>
  </Provider>,

  document.getElementById("root")
);

import * as React from "react";
import { Text, Grid, Row, Button } from "@nextui-org/react";
import CartesiToken from "../../../deployments/localhost/CartesiToken.json"

import { getTokenNameFromAddress, truncateAddress } from "../ether/utils";
import { FaCoins } from "react-icons/fa";
import { useSelector } from "react-redux";

export default () => {
    const accounts = useSelector(state => state.auth.accounts);
    const accountBalances = useSelector(state => state.game.accounts);
    const address = Array.isArray(accounts) && accounts.length > 0 ? accounts[0].toLowerCase() : ""
    const balances = accountBalances[address.toLowerCase()] ?? {[CartesiToken.address.toLowerCase()] : 0}
    const getAssets = () => {
        let content = [];
        let index = 0
        for (const tokenAddress in balances) {
            const balance = balances[tokenAddress];
            content.push(
                <Button.Group key={index} color="primary" bordered>
                    <Button>{balance}</Button>
                    <Button icon={<FaCoins/>}>{getTokenNameFromAddress(tokenAddress)}</Button>
                </Button.Group>
            );
            index++
        }

        return content;
    };

    return (
        <Row justify="space-evenly">
            {getAssets()}
        </Row> 
    );
}
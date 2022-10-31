import * as React from "react";
import { Text, Grid, Row, Button } from "@nextui-org/react";
import { CONTRACTS } from "../ether/contracts";

import { getTokenNameFromAddress, truncateAddress } from "../ether/utils";
import { FaCoins } from "react-icons/fa";
import { useSelector } from "react-redux";
import { ethers } from "ethers";
import { useTokenFromNetwork } from "../hooks/token";
import { useActionCreator } from "../state/game/hooks";
import { TransactionType } from "../common/types";

export default () => {
    const accounts = useSelector(state => state.auth.accounts);
    const accountBalances = useSelector(state => state.game.accounts);
    const address = Array.isArray(accounts) && accounts.length > 0 ? accounts[0].toLowerCase() : ""
    const balances = accountBalances[address.toLowerCase()] ?? {[CONTRACTS.localhost.CartesiToken.address.toLowerCase()] : 0}
    const token = useTokenFromNetwork("0x326C977E6efc84E512bB9C30f76E30c160eD06FB")
    //console.log(token)
    const addAction = useActionCreator()

    const handleReleaseFunds = async (tokenAddress) => {
        addAction({
            type: TransactionType.RELEASE_FUNDS,
            tokenAddress,
        })
    }
    const getAssets = () => {
        let content = [];
        let index = 0
        for (const tokenAddress in balances) {
            const balance = balances[tokenAddress];
            content.push(
                <Button.Group 
                    css={{height:"100%", marginTop:"0"}} key={index} color="primary" 
                    bordered
                >
                    <Button onClick={()=>handleReleaseFunds(tokenAddress)}>{ethers.utils.formatUnits(ethers.BigNumber.from(balance.toString()))}</Button>
                    <Button onClick={()=>handleReleaseFunds(tokenAddress)} icon={<FaCoins/>}>{getTokenNameFromAddress(tokenAddress)}</Button>
                </Button.Group>
            );
            index++
        }

        return content;
    };

    return (
        <Row css={{height:"40px"}} justify="space-evenly">
            {getAssets()}
        </Row> 
    );
}
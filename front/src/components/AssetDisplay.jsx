import * as React from "react";
import { Grid, Row, Button } from "@nextui-org/react";
import { CONTRACTS } from "../ether/contracts";

import { getTokenNameFromAddress, truncateAddress } from "../ether/utils";
import { FaCoins } from "react-icons/fa";
import { useSelector } from "react-redux";
import { ethers } from "ethers";
import { useTokenFromList, useTokenFromNetwork } from "../hooks/token";
import { useActionCreator } from "../state/game/hooks";
import { TransactionType } from "../common/types";
import { useWeb3React } from "@web3-react/core";
import { Text } from "./ui/Text";
import Profile from "./Profile";
import ProfileImage from "./ProfileImage";
import TokenIcon from "./TokenIcon";
import { SelectIcon } from "@radix-ui/react-select";
import { USDC_ADDRESS_ON_NETWORKS } from "../ether/chains";


export default ({tokenAddress, balance, isL2=false, green=false, blue=false, grey=false, red=false}) => {
    const {account, chainId} = useWeb3React()
    const _tokenAddress = tokenAddress ?? USDC_ADDRESS_ON_NETWORKS[chainId]
    const token = useTokenFromList(_tokenAddress)
    //get account balance of token
    const balances = useSelector(state => state.game.balances)
    const accountBalances = balances?.[account] ?? undefined
    const _balance = balance ?? accountBalances?.[tokenAddress] ?? "0.0"

    console.log("tokenAddress", tokenAddress)
    console.log("token", token)

    return (
        <Row justify="space-evenly" css={{padding:"0"}}>
            <Text blue={blue} green={green} grey={grey} red={red}  css={{padding:"0 5px"}}>{_balance?? "0.0"}</Text>
            <TokenIcon uri={token?.logoUri}/> 
            <Text blue={blue} green={green} grey={grey} red={red} css={{paddingLeft:"5px"}} bold>{token?.name?? token}</Text>
            {isL2 && <Text size={1} blue={blue} green={green} grey={grey} red={red} bold>L2</Text>}
        </Row> 
    );
}
import * as React from "react";
import { truncateAddress, formatDate } from "../../ether/utils";
import Address from "../Address";
import ModalChallengeBot from "../ModalChallengeBot";
import ModalManageBot from "../ModalManageBot";
import { useWeb3React } from "@web3-react/core";
import List from "../ui/List";
import { BotProfile } from "../../state/game/types";
import BotListItem from "./BotListItem";
import { Text } from "../ui/Text";

export default ({bots}: {bots: BotProfile[]}) => {
    const botItems = bots.length > 0 ? 
        bots.map((bot) => <BotListItem bot={bot} rank={0} />) :
        [<Text key={0}>No bots found</Text>]

    return (
        <List
            items={botItems}
        />
    );
}
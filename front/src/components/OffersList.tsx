import * as React from "react";
import { truncateAddress, formatDate } from "../ether/utils";
import Address from "./Address";
import ModalChallengeBot from "./ModalChallengeBot";
import ModalManageBot from "./ModalManageBot";
import { useWeb3React } from "@web3-react/core";
import List from "./ui/List";
import { BotOffer } from "../state/game/types";
import { Text } from "./ui/Text";
import AssetDisplay from "./AssetDisplay";
import Date from "./ui/Date";
import HandleOffer from "./HandleOffer";

const BotOfferListItem = ({account, offer}: {account: string, offer: BotOffer}) => {
    // const {
    //     offerId,
    //     botId,
    //     owner,
    //     sender,
    //     price,
    //     token,
    //     timestamp,
    // } = offer
    // console.log("offer list item: ")
    // console.log(offer)

    // const isOwner = account === owner

    return (
        <Text>
            {/* <Address value={sender} hoverable={true} /> offered <AssetDisplay balance={price} tokenAddress={token} /> for bot <Address value={botId} hoverable={true} /> at <Date current={timestamp} />
            {isOwner ? 
                <div>
                    <HandleOffer offerId={offerId} accept={true} /> or <HandleOffer offerId={offerId} accept={false} /> 
                </div>
                : null
            } */}
        </Text>
    )
}
        

export default ({account, offers}: {account: string, offers: BotOffer[]}) => {
    // const botItems = offers.length > 0 ? 
    // offers.map((offer) => <BotOfferListItem account={account} offer={offer} />) :
    //     [<Text key={0}>No offers found</Text>]

    return (
            // <List
            //     items={botItems}
            // />
            <></>
    );
}
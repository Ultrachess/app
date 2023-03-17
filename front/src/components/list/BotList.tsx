import { useWeb3React } from "@web3-react/core";
import * as React from "react";

import { formatDate, truncateAddress } from "../../ether/utils";
import { BotProfile } from "../../state/game/types";
import Address from "../Address";
import ModalChallengeBot from "../modals/ModalChallengeBot";
import List from "../ui/List";
import { Text } from "../ui/Text";
import BotListItem from "./BotListItem";

export default ({ bots }: { bots: BotProfile[] }) => {
  const botItems =
    bots.length > 0
      ? bots.map((bot) => <BotListItem bot={bot} rank={0} />)
      : [<Text key={0}>No bots found</Text>];

  return <List items={botItems} />;
};

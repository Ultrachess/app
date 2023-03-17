import { useWeb3React } from "@web3-react/core";
import * as React from "react";

import { formatDate, truncateAddress } from "../../ether/utils";
import { useOwner } from "../../state/game/hooks";
import { Challenge } from "../../state/game/types";
import Address from "../Address";
import AssetDisplay from "../AssetDisplay";
import ChallengeAction from "../HandleChallenge";
import Date from "../ui/Date";
import List from "../ui/List";
import { Text } from "../ui/Text";

const ChallengeListItem = ({
  account,
  challenge,
}: {
  account: string;
  challenge: Challenge;
}) => {
  const { id, sender, recipient, token, wager, timestamp } = challenge;

  const isSentToYou = account === recipient;
  const owner = useOwner(recipient);
  const isOwnedByYou = account === owner;

  return (
    <Text>
      <Address value={sender} hoverable={true} /> challenged{" "}
      <Address value={recipient} hoverable={true} /> for{" "}
      <AssetDisplay balance={wager} tokenAddress={token} /> at{" "}
      <Date current={timestamp} />
      {isSentToYou || isOwnedByYou ? (
        <div>
          <ChallengeAction challengeId={id} accept={true} /> or{" "}
          <ChallengeAction challengeId={id} accept={false} />
        </div>
      ) : null}
    </Text>
  );
};

export default ({
  account,
  challenges,
}: {
  account: string;
  challenges: Challenge[];
}) => {
  const botItems =
    challenges.length > 0
      ? challenges.map((challenge) => (
          <ChallengeListItem account={account} challenge={challenge} />
        ))
      : [<Text key={0}>No challenges found</Text>];

  return <List items={botItems} />;
};

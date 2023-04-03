/*
 * Copyright (C) 2022-2023 Ultrachess team
 * This file is part of Ultrachess - https://github.com/Ultrachess/app
 *
 * SPDX-License-Identifier: Apache-2.0
 * See the file LICENSE for more information.
 */

import { useOwner } from "../../state/game/hooks";
import { Challenge } from "../../state/game/types";
import Address from "../Address";
import AssetDisplay from "../AssetDisplay";
import ChallengeAction from "../HandleChallenge";
import Date from "../ui/Date";
import Flex from "../ui/Flex";
import List from "../ui/List";
import Table from "../ui/Table";
import { Text } from "../ui/Text";

const columns = ["id", "sender", "recipient", "wager", "timestamp", ""];

const ChallengeListItem = ({
  account,
  challenge,
}: {
  account: string;
  challenge: Challenge;
}) => {
  const { challengeId, sender, recipient, token, wager, timestamp } = challenge;

  const isSentToYou = account === recipient;
  const owner = useOwner(recipient);
  const isOwnedByYou = account === owner;

  console.log("challenge Id: ", challengeId);

  return (
    <Text>
      <Address value={sender} hoverable={true} /> challenged{" "}
      <Address value={recipient} hoverable={true} /> for{" "}
      <AssetDisplay balance={wager} tokenAddress={token} /> at{" "}
      <Date current={timestamp} />
      {isSentToYou || isOwnedByYou ? (
        <div>
          <ChallengeAction challengeId={challengeId} accept={true} /> or{" "}
          <ChallengeAction challengeId={challengeId} accept={false} />
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
  const challengeItems =
    challenges.length > 0
      ? challenges.map((challenge) => {
          const { challengeId, sender, recipient, token, wager, timestamp } =
            challenge;
          const isSentToYou = account.toLowerCase() === recipient.toLowerCase();
          const owner = useOwner(recipient);
          const isOwnedByYou =
            account.toLowerCase() === (owner?.toLowerCase() ?? "");
          console.log("challenge Id: ", challengeId);
          return [
            challengeId ?? "#",
            <Address value={sender} hoverable={true} />,
            <Address value={recipient} hoverable={true} />,
            <AssetDisplay balance={wager / 10 ** 18} tokenAddress={token} />,
            <Date current={timestamp * 1000} />,
            isSentToYou || isOwnedByYou ? (
              <Flex css={{ justifyContent: "space-between" }}>
                <ChallengeAction challengeId={challengeId} accept={true} /> or{" "}
                <ChallengeAction challengeId={challengeId} accept={false} />
              </Flex>
            ) : (
              <></>
            ),
          ];
        })
      : [];

  return <Table columns={columns} rows={challengeItems} />;
};

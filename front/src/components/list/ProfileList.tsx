/*
 * Copyright (C) 2022-2023 Ultrachess team
 * This file is part of Ultrachess - https://github.com/Ultrachess/app
 *
 * SPDX-License-Identifier: Apache-2.0
 * See the file LICENSE for more information.
 */

import { useWeb3React } from "@web3-react/core";

import { STABLECOIN_ADDRESS_ON_NETWORKS } from "../../ether/chains";
import { Profile, UserProfile } from "../../state/game/types";
import Address from "../Address";
import AssetDisplay from "../AssetDisplay";
import List from "../ui/List";
import Table from "../ui/Table";
import { Text } from "../ui/Text";
import ProfileListItem from "./ProfileListItem";

const columns = [
  "#",
  "id",
  "elo",
  "nationality",
  "balance",
  "bots",
  "challenges",
  "games",
];

export default ({
  profiles,
  showRank = false,
}: {
  profiles: UserProfile[];
  showRank: boolean;
}) => {
  const { chainId } = useWeb3React();
  const profileItems = profiles.map((profile, index) => {
    const {
      id,
      name,
      avatar,
      elo,
      games,
      nationality,
      challenges,
      balances,
      bots,
    } = profile;
    const balance = balances.length > 0 ? balances[0].amount : 0;
    const tokenAddress =
      balances.length > 0
        ? balances[0].token
        : STABLECOIN_ADDRESS_ON_NETWORKS[chainId];
    return [
      index + 1,
      <Address value={id} hoverable={true} />,
      elo,
      nationality,
      <AssetDisplay balance={balance} tokenAddress={tokenAddress} />,
      bots.length,
      challenges.length,
      games.length,
    ].slice(showRank ? 0 : 1);
  });

  return (
    <Table
      columns={showRank ? columns : columns.slice(1)}
      rows={profileItems}
    />
  );
};

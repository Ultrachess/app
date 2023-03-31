/*
 * Copyright (C) 2022-2023 Ultrachess team
 * This file is part of Ultrachess - https://github.com/Ultrachess/app
 *
 * SPDX-License-Identifier: Apache-2.0
 * See the file LICENSE for more information.
 */

import { BotProfile } from "../../state/game/types";
import Address from "../Address";
import AssetDisplay from "../AssetDisplay";
import DateDisplay from "../ui/Date";
import List from "../ui/List";
import Table from "../ui/Table";
import { Text } from "../ui/Text";
import BotListItem from "./BotListItem";

const columns = [
  "#",
  "id",
  "owner",
  "elo",
  "nationality",
  "autoBattle",
  "autoWagerAmount",
  "offers",
  "price",
  "created",
];

export default ({
  bots,
  showRank = false,
}: {
  bots: BotProfile[];
  showRank: boolean;
}) => {
  const botItems = bots.map((bot, index) => {
    const {
      id,
      name,
      avatar,
      elo,
      games,
      nationality,
      challenges,
      owner,
      offers,
      autoBattleEnabled,
      autoMaxWagerAmount,
      autoWagerTokenAddress,
      timestamp,
    } = bot;
    return [
      index + 1,
      <Address value={id} hoverable={true} />,
      <Address value={owner} hoverable={true} />,
      elo,
      nationality,
      autoBattleEnabled ? "yes" : "no",
      <AssetDisplay
        balance={autoMaxWagerAmount}
        tokenAddress={autoWagerTokenAddress}
      />,
      offers.length,
      <AssetDisplay
        balance={offers[0]?.price}
        tokenAddress={offers[0]?.token}
      />,
      <DateDisplay current={timestamp * 1000} />,
    ].slice(showRank ? 0 : 1);
  });

  return (
    <Table columns={showRank ? columns : columns.slice(1)} rows={botItems} />
  );
};

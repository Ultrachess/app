/*
 * Copyright (C) 2022-2023 Ultrachess team
 * This file is part of Ultrachess - https://github.com/Ultrachess/app
 *
 * SPDX-License-Identifier: Apache-2.0
 * See the file LICENSE for more information.
 */

import { BotProfile } from "../../state/game/types";
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

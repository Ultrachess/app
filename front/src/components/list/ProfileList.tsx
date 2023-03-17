/*
 * Copyright (C) 2022-2023 Ultrachess team
 * This file is part of Ultrachess - https://github.com/Ultrachess/app
 *
 * SPDX-License-Identifier: Apache-2.0
 * See the file LICENSE for more information.
 */

import { Profile } from "../../state/game/types";
import List from "../ui/List";
import { Text } from "../ui/Text";
import ProfileListItem from "./ProfileListItem";

export default ({
  profiles,
  showRank = false,
}: {
  profiles: Profile[];
  showRank: boolean;
}) => {
  const botItems =
    profiles.length > 0
      ? profiles.map((bot, index) => (
          <ProfileListItem profile={bot} rank={showRank ? index + 1 : 1} />
        ))
      : [<Text key={0}>No profiles found</Text>];

  return <List items={botItems} />;
};

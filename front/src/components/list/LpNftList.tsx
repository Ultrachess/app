/*
 * Copyright (C) 2022-2023 Ultrachess team
 * This file is part of Ultrachess - https://github.com/Ultrachess/app
 *
 * SPDX-License-Identifier: Apache-2.0
 * See the file LICENSE for more information.
 */

import { LpNftProfile } from "../../state/game/types";
import List from "../ui/List";
import { Text } from "../ui/Text";
import LpNftListItem from "./LpNftListItem";

export default ({ lpNfts }: { lpNfts: LpNftProfile[] }) => {
  const lpNftItems =
    lpNfts.length > 0
      ? lpNfts.map((lpNft) => <LpNftListItem lpNft={lpNft} />)
      : [<Text key={0}>No LP NFTs found</Text>];

  return <List items={lpNftItems} />;
};

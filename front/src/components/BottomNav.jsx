/*
 * Copyright (C) 2022-2023 Ultrachess team
 * This file is part of Ultrachess - https://github.com/Ultrachess/app
 *
 * SPDX-License-Identifier: Apache-2.0
 * See the file LICENSE for more information.
 */

import Flex from "./ui/Flex";
import { Text } from "./ui/Text";
import { useLatestTimestampAndBlockNumber } from "../state/transactions/hooks";
import { DotIcon } from "@radix-ui/react-icons";
import DateDisplay from "./ui/Date";

//This component is a flex box that sticks to the bottom of the page
//It displays the latest block number and the latest timestamp
//uses flex.

export default () => {
  const [latestTimestamp, latestBlockNumber] =
    useLatestTimestampAndBlockNumber();
  return (
    <Flex
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: 40,
        backgroundColor: "#f5f5f5",
        borderTop: "1px solid #e8e8e8",
        padding: "4px 8px",
        fontSize: 12,
        color: "#999",
        alignItems: "center",
        justifyContent: "right",
        gap: 8,
      }}
    >
      <Text green={true}>
        {latestBlockNumber} <DotIcon />
      </Text>
      <DateDisplay date={latestTimestamp} />
    </Flex>
  );
};

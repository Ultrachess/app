/*
 * Copyright (C) 2022-2023 Ultrachess team
 * This file is part of Ultrachess - https://github.com/Ultrachess/app
 *
 * SPDX-License-Identifier: Apache-2.0
 * See the file LICENSE for more information.
 */

import { useMemo } from "react";
import { FaRobot } from "react-icons/fa";
import { Link } from "react-router-dom";

import { STABLECOIN_ADDRESS_ON_NETWORKS } from "../ether/chains";
import { truncateAddress } from "../ether/utils";
import {
  useBalance,
  useElo,
  useNationality,
  useProfile,
} from "../state/game/hooks";
import AssetDisplay from "./AssetDisplay";
import ProfileHover from "./ProfileHover";
import ProfileImage from "./ProfileImage";
import Flex from "./ui/Flex";
import { Text } from "./ui/Text";

export default ({ address }) => {
  const isBot = useMemo(() => (address ? !address.includes("0x") : false), []);
  const elo = useElo(address);
  const nationality = useNationality(address);
  const tokenAddress = STABLECOIN_ADDRESS_ON_NETWORKS[31337];
  const balance = useBalance(address, tokenAddress);
  const isInvalid = address.includes(" ");
  return (
        <Link to={(isBot ? "/bot/" : isInvalid ? "#" : "/users/") + address}>
          <Flex css={{ flexDirection: "row", alignItems: "center", gap: 20 }}>
            <ProfileImage diameter={45} address={address} />
            <Flex css={{ flexDirection: "column", gap: 2 }}>
              <Text size={2} bold blue>
                {truncateAddress(address)}
                {isBot && <FaRobot />}
              </Text>
              <Flex
                css={{ flexDirection: "row", gap: 20, alignItems: "start" }}
              >
                <Flex css={{ flexDirection: "column", gap: 1 }}>
                  <Text size={1}>{elo} ELO</Text>
                  <Text size={1}>{nationality}</Text>
                </Flex>
                <AssetDisplay balance={balance} tokenAddress={tokenAddress} />
              </Flex>
            </Flex>
          </Flex>
        </Link>
  );
};

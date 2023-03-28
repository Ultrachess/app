/*
 * Copyright (C) 2022-2023 Ultrachess team
 * This file is part of Ultrachess - https://github.com/Ultrachess/app
 *
 * SPDX-License-Identifier: Apache-2.0
 * See the file LICENSE for more information.
 */

import { useMemo } from "react";
import { Link } from "react-router-dom";
import ProfileImage from "./ProfileImage";
import { truncateAddress } from "../ether/utils";
import { Text } from "./ui/Text";
import ProfileHover from "./ProfileHover";
import Flex from "./ui/Flex";
import { FaRobot } from "react-icons/fa";
import { useProfile } from "../state/game/hooks";

export default ({
  value,
  hoverable = false,
  isMedium = false,
  isImageBig = false,
  showBotName = false,
}) => {
  const isBot = useMemo(() => (value ? !value.includes("0x") : false));
  const addressView = (
    <Link to={(isBot ? "/bot/" : "/users/") + value}>
      <Flex css={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
        <ProfileImage address={value} />
        <span>{truncateAddress(value)}</span>
        {isBot && <FaRobot />}
      </Flex>
    </Link>
  );

  const mediumAddressView = (
    <Link to={(isBot ? "/bot/" : "/users/") + value}>
      <Flex css={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
        <ProfileImage diameter={30} address={value} />
        <Text size={2} bold blue>
          {truncateAddress(value)}
        </Text>
        {isBot && <FaRobot />}
        {isBot && showBotName && (
          <Text size={2} bold>
            {useProfile(value).name}
          </Text>
        )}
      </Flex>
    </Link>
  );

  //bigAddressView is used for the profile page
  //It renders the ProfileImage component with a bigger size
  //in a flex column
  const bigAddressView = (
    <Link to={(isBot ? "/bot/" : "/users/") + value}>
      <Flex css={{ flexDirection: "column", alignItems: "center" }}>
        <ProfileImage address={value} diameter={200} />
        <Text size={5} bold>
          {truncateAddress(value)}
          {isBot && <FaRobot />}
        </Text>
      </Flex>
    </Link>
  );

  const component = isImageBig
    ? bigAddressView
    : isMedium
    ? mediumAddressView
    : addressView;

  return (
    <>
      {hoverable ? (
        <ProfileHover triggerElement={component} profileId={value} />
      ) : (
        component
      )}
    </>
  );
};

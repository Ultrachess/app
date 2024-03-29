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
  showProfile = true,
  toShow= null,
}) => {
  const isBot = useMemo(() => (value ? !value.includes("0x") : false), []);
  const valueToShow = toShow ? toShow : truncateAddress(value);
  const addressView = (
    <Link css={{}} to={(isBot ? "/bot/" : "/users/") + value}>
      <Flex css={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
        {showProfile && <ProfileImage address={value} />}
        <span>toShow</span>
        {isBot && <FaRobot />}
      </Flex>
    </Link>
  );

  const mediumAddressView = (
    <Link to={(isBot ? "/bot/" : "/users/") + value}>
      <Flex css={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
        {showProfile && <ProfileImage diameter={30} address={value} />}
        <Text size={2} bold blue>
          toShow
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
    <>
      <Flex css={{ flexDirection: "row", alignItems: "end", gap: 5 }}>
        {showProfile && <ProfileImage address={value} diameter={90} />}
        <Flex css={{ flexDirection: "row", gap: 4 }}>
          <div>toShow</div>
          {isBot && <FaRobot />}
        </Flex>
      </Flex>
    </>
  );

  const component = isImageBig
    ? bigAddressView
    : isMedium
    ? mediumAddressView
    : addressView;

  return (
    <span
      className={
        !isMedium && !isImageBig
          ? "inline-flex items-center hover:underline cursor-pointer align-middle"
          : ""
      }
    >
      {hoverable ? (
        <ProfileHover triggerElement={component} profileId={value} />
      ) : (
        component
      )}
    </span>
  );
};

/*
 * Copyright (C) 2022-2023 Ultrachess team
 * This file is part of Ultrachess - https://github.com/Ultrachess/app
 *
 * SPDX-License-Identifier: Apache-2.0
 * See the file LICENSE for more information.
 */

import { mauve } from "@radix-ui/colors";
import * as HoverCard from "@radix-ui/react-hover-card";
import { keyframes, styled } from "@stitches/react";

import { useProfile } from "../state/game/hooks";
import { BotProfile, ProfileType, UserProfile } from "../state/game/types";
import Address from "./Address";
import AssetDisplay from "./AssetDisplay";

const BotProfileCard = ({ profile }: { profile: BotProfile }) => {
  //console.log("123 bot profile", profile)
  return (
    <div>
      <Flex css={{ flexDirection: "column", gap: 7, zIndex: 100000000000 }}>
        <Flex css={{ flexDirection: "column", gap: 15 }}>
          <Address value={profile.id} />
          <div>
            <Flex css={{ gap: 5 }}>
              <Text faded>USA 🇺🇸</Text>
            </Flex>
            <Flex css={{ gap: 5 }}>
              <Text faded>owner</Text>
              <Address value={profile.owner} />
            </Flex>
          </div>
          <Flex css={{ gap: 15 }}>
            <Flex css={{ gap: 5 }}>
              <Text bold>{profile.elo}</Text> <Text faded>Elo</Text>
            </Flex>
            <Flex css={{ gap: 5 }}>
              <Text bold>{profile.games.length}</Text>{" "}
              <Text faded>Games played</Text>
            </Flex>
          </Flex>
          {/* <Flex css={{ gap: 15 }}>
                    <ModalCreateChallenge triggerElement={<Button>Challenge</Button>} playerId={profile.id} />
                    <ModalCreateOffer triggerElement={<Button>Offer</Button>} botId={profile.id} />
                  </Flex> */}
        </Flex>
      </Flex>

      <HoverCardArrow />
    </div>
  );
};

const UserProfileCard = ({ profile }: { profile: UserProfile }) => {
  //console.log("123 profile", profile)
  const token = profile?.balances[0]?.token ?? "";
  const balance = profile?.balances[0]?.amount ?? "";
  return (
    <div>
      <Flex css={{ flexDirection: "column", gap: 7 }}>
        <Flex css={{ flexDirection: "column", gap: 15 }}>
          <Address value={profile.id} />
          <div>
            <Flex css={{ gap: 5 }}>
              <Text faded>🇺🇸</Text>
            </Flex>
            <Flex css={{ gap: 5 }}>
              <AssetDisplay
                tokenAddress={token}
                balance={balance}
                isL2={true}
              />{" "}
              <Text faded>Balance</Text>
            </Flex>
          </div>
          <Flex css={{ gap: 15 }}>
            <Flex css={{ gap: 5 }}>
              <Text bold>{profile.elo}</Text> <Text faded>Elo</Text>
            </Flex>
            <Flex css={{ gap: 5 }}>
              <Text bold>{profile.games.length}</Text>{" "}
              <Text faded>Games played</Text>
            </Flex>
          </Flex>
        </Flex>
        <Flex css={{ gap: 5, flexDirection: "column" }}>
          <Text>Bots</Text>
          <Flex css={{ gap: 5 }}>
            {profile.bots.map((bot) => (
              <>
                <Address value={bot.id} />,
              </>
            ))}
          </Flex>
        </Flex>
        {/* <Flex css={{ gap: 15 }}>
              <ModalCreateChallenge triggerElement={<Button>Challenge</Button>} playerId={profile.id} />
            </Flex> */}
      </Flex>

      <HoverCardArrow />
    </div>
  );
};

const ProfileHover = ({ triggerElement, profileId }) => {
  const profile: any = useProfile(profileId);
  return (
    <HoverCard.Root openDelay={10} closeDelay={10}>
      <HoverCard.Trigger asChild>{triggerElement}</HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCardContent sideOffset={5}>
          {profile.type == ProfileType.BOT ? (
            <BotProfileCard profile={profile} />
          ) : (
            <UserProfileCard profile={profile} />
          )}
        </HoverCardContent>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
};

const slideUpAndFade = keyframes({
  "0%": { opacity: 0, transform: "translateY(2px)" },
  "100%": { opacity: 1, transform: "translateY(0)" },
});

const slideRightAndFade = keyframes({
  "0%": { opacity: 0, transform: "translateX(-2px)" },
  "100%": { opacity: 1, transform: "translateX(0)" },
});

const slideDownAndFade = keyframes({
  "0%": { opacity: 0, transform: "translateY(-2px)" },
  "100%": { opacity: 1, transform: "translateY(0)" },
});

const slideLeftAndFade = keyframes({
  "0%": { opacity: 0, transform: "translateX(2px)" },
  "100%": { opacity: 1, transform: "translateX(0)" },
});

const HoverCardContent = styled(HoverCard.Content, {
  borderRadius: 6,
  padding: 20,
  width: 300,
  backgroundColor: "white",
  boxShadow:
    "hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px",
  animationDuration: "400ms",
  animationTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
  willChange: "transform, opacity",
  '&[data-state="open"]': {
    '&[data-side="top"]': { animationName: slideDownAndFade },
    '&[data-side="right"]': { animationName: slideLeftAndFade },
    '&[data-side="bottom"]': { animationName: slideUpAndFade },
    '&[data-side="left"]': { animationName: slideRightAndFade },
  },
});

const HoverCardArrow = styled(HoverCard.Arrow, {
  fill: "white",
});

const ImageTrigger = styled("a", {
  all: "unset",
  cursor: "pointer",
  borderRadius: "100%",
  display: "inline-block",
  "&:focus": { boxShadow: `0 0 0 2px white` },
});

const Img = styled("img", {
  display: "block",
  borderRadius: "100%",
  variants: {
    size: {
      normal: { width: 45, height: 45 },
      large: { width: 60, height: 60 },
    },
  },
  defaultVariants: {
    size: "normal",
  },
});

const Text = styled("div", {
  margin: 0,
  color: mauve.mauve12,
  fontSize: 15,
  lineHeight: 1.5,
  variants: {
    faded: {
      true: { color: mauve.mauve10 },
    },
    bold: {
      true: { fontWeight: 500 },
    },
  },
});

const Flex = styled("div", { display: "flex" });

export default ProfileHover;

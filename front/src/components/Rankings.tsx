/*
 * Copyright (C) 2022-2023 Ultrachess team
 * This file is part of Ultrachess - https://github.com/Ultrachess/app
 *
 * SPDX-License-Identifier: Apache-2.0
 * See the file LICENSE for more information.
 */

import "./Address.css";

import { violet } from "@radix-ui/colors";
import { StitchesLogoIcon } from "@radix-ui/react-icons";
import { styled } from "@stitches/react";

import { useAllProfiles } from "../state/game/hooks";
import ProfileList from "./list/ProfileList";
import ModalCreateBot from "./modals/ModalCreateBot";
import Button from "./ui/Button";
import Separator from "./ui/Separator";
import { Text } from "./ui/Text";

export default () => {
  const profiles: any = useAllProfiles(true);

  return (
    <div className="body">
      <div className="header">
        <div>
          <Text
            bold
            black
            size={"max"}
            css={{ textAlign: "center", marginBottom: "10px" }}
          >
            Rankings
          </Text>
        </div>
      </div>
      <div className="content">
        <div className="contentHolder">
          <div>
            <div className="contentHeader">
              <Label>Ranking list</Label>
              <RightSlot>
                <ModalCreateBot
                  triggerElement={
                    <Button>
                      <Text>
                        random <StitchesLogoIcon />
                      </Text>
                    </Button>
                  }
                />
              </RightSlot>
            </div>
            <Separator />
            <ProfileList profiles={profiles} showRank={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

const Label = styled("label", {
  fontSize: 23,
  lineHeight: 1,
  fontWeight: 500,
  marginBottom: 20,
  color: violet.violet12,
  display: "block",
});

const LeftSlot = styled("div", {
  marginRight: "auto",
  paddingRight: 0,
  display: "flex",
  color: violet.violet11,
  "[data-highlighted] > &": { color: "white" },
  "[data-disabled] &": { color: violet.violet4 },
});

const RightSlot = styled("div", {
  marginLeft: "auto",
  paddingLeft: 0,
  display: "flex",
  "[data-highlighted] > &": { color: "white" },
});

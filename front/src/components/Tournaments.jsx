/*
 * Copyright (C) 2022-2023 Ultrachess team
 * This file is part of Ultrachess - https://github.com/Ultrachess/app
 *
 * SPDX-License-Identifier: Apache-2.0
 * See the file LICENSE for more information.
 */

import { useAllTournaments } from "../state/game/hooks";
import { Text } from "./ui/Text";
import { styled } from "@stitches/react";
import Separator from "./ui/Separator";
import { StitchesLogoIcon } from "@radix-ui/react-icons";
import Button from "./ui/Button";
import { violet } from "@radix-ui/colors";
import ModalCreateTournament from "./modals/ModalCreateTournament";
import TournamentList from "./list/TournamentList";

export default () => {
  const tournaments = useAllTournaments();

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
            Tournaments
          </Text>
        </div>
      </div>
      <div className="content">
        <div className="contentHolder">
          <div>
            <div className="contentHeader">
              <Label>All tournaments</Label>
              <RightSlot>
                <ModalCreateTournament
                  triggerElement={
                    <Button>
                      <Text>
                        Create Tournament <StitchesLogoIcon />
                      </Text>
                    </Button>
                  }
                />
              </RightSlot>
            </div>
            <Separator />
            {tournaments.length > 0 && (
              <TournamentList tournaments={tournaments} />
            )}
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

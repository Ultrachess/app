import { violet } from "@radix-ui/colors";
import { StitchesLogoIcon, ZoomOutIcon } from "@radix-ui/react-icons";
import { styled } from "@stitches/react";
import * as React from "react";
import { useSelector } from "react-redux";

import { useAllProfiles } from "../state/game/hooks";
import BotGameCreator from "./BotGameCreator";
import BotUploader from "./BotUploader";
import BotListView from "./list/BotList";
import ProfileList from "./list/ProfileList";
import ModalCreateBot from "./ModalCreateBot";
import Button from "./ui/Button";
import Flex from "./ui/Flex";
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

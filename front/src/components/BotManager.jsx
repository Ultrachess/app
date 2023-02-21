import * as React from "react";
import BotUploader from "./BotUploader";
import { useSelector } from "react-redux";
import BotListView from "./list/BotList";
import BotGameCreator from "./BotGameCreator";
import { useAllBots } from "../state/game/hooks";
import Flex from "./ui/Flex";
import { Text } from "./ui/Text";
import { styled } from "@stitches/react";
import ModalCreateBot from "./ModalCreateBot";
import Separator from "./ui/Separator";
import { ZoomOutIcon, StitchesLogoIcon } from "@radix-ui/react-icons";
import { violet } from "@radix-ui/colors";
import Button from "./ui/Button";


export default () => {
  const bots = useAllBots()

  return (
    <div className="body">
      <div className="header">
        <div>
          <Text bold black size={"max"} css={{ textAlign: "center", marginBottom: "10px" }}>
            Bots manager
          </Text>
        </div>

      </div>
      <div className="content">
        <div className="contentHolder">
          <div>
            <div className="contentHeader">
              <Label>Active bots</Label>
              <RightSlot>
                <ModalCreateBot triggerElement={
                  <Button shadow>
                    <Text>Create bot <StitchesLogoIcon/></Text>
                  </Button>
                } />
              </RightSlot>
            </div>
            <Separator />
            <BotListView bots={bots} />
          </div>
        </div>
    </div>
  </div>
  );
}

const Label = styled('label', {
  fontSize: 23,
  lineHeight: 1,
  fontWeight: 500,
  marginBottom: 20,
  color: violet.violet12,
  display: 'block',
});

const LeftSlot = styled('div', {
    marginRight: 'auto',
    paddingRight: 0,
    display: 'flex',
    color: violet.violet11,
    '[data-highlighted] > &': { color: 'white' },
    '[data-disabled] &': { color: violet.violet4 },
  });

  const RightSlot = styled('div', {
    marginLeft: 'auto',
    paddingLeft: 0,
    display: 'flex',
    '[data-highlighted] > &': { color: 'white' },
  });
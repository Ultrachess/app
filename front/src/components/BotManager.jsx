import * as React from "react";
import { Text, Grid } from "@nextui-org/react";
import BotUploader from "./BotUploader";
import { useSelector } from "react-redux";
import BotListView from "./BotListView";
import BotGameCreator from "./BotGameCreator";
export default () => {
  const bots = useSelector(state => state.game.bots)

  return (
    <div>
        <BotGameCreator/>
        <BotListView bots = {bots}/>
        <BotUploader/>
    </div>
  );
}
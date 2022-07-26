import * as React from "react";
import { Text, Grid, Card, Row } from "@nextui-org/react";
import BotUploader from "./BotUploader";
import { useSelector } from "react-redux";
import BotListView from "./BotListView";
import BotGameCreator from "./BotGameCreator";
export default () => {
  const bots = useSelector(state => state.game.bots)

  return (
    <div className="body">
      <div className="content">
      <Card shadow={true} css={{ height:"700px", width: "1000px", paddingLeft:"50px", paddingRight:"50px", paddingTop:"50px"}}>
        <Card.Header>
            <Row justify="center">
                <Text h2>Bot manager</Text>
            </Row>
        </Card.Header>
        <BotUploader/>
        <BotListView bots = {bots}/>
      </Card>

    </div>
    </div>
    
  );
}
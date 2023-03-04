import * as React from "react";
import {
  Text,
  Table,
  User,
  Button,
  Modal,
  Input,
  Row,
} from "@nextui-org/react";
import { useDispatch } from "react-redux";
import { FaRobot } from "react-icons/fa";
import { TransactionType } from "../common/types";
import { useNavigate } from "react-router-dom";
import { useActionCreator } from "../state/game/hooks";

export default () => {
  const dispatch = useDispatch();
  const addAction = useActionCreator();
  const navigate = useNavigate();
  const [visible, setVisible] = React.useState(false);
  const [botId1, setBotId1] = React.useState(0);
  const [botId2, setBotId2] = React.useState(0);

  const handler = () => setVisible(true);

  const handleCreateBotGame = async () => {
    //console.log("closed");
    const [action, wait] = await addAction({
      type: TransactionType.CREATE_GAME_INPUT,
      name: "default",
      isBot: true,
      botId1,
      botId2,
      wagerTokenAddress: "0",
      wagerAmount: 0,
    });
    const roomId = await wait;
    navigate(`/game/${roomId}`);
    //dispatch( createBotGame(botId1, botId2, 1) )
    setVisible(false);
  };

  const onChangeBotId1 = (event) => {
    setBotId1(event.target.value);
  };

  const onChangeBotId2 = (event) => {
    setBotId2(event.target.value);
  };

  return (
    <div>
      <Button auto shadow onClick={handler}>
        Open modal
      </Button>
      <Modal closeButton aria-labelledby="modal-title" open={visible}>
        <Modal.Header>
          <Text id="modal-title" size={18}>
            Create your match
          </Text>
        </Modal.Header>
        <Modal.Body>
          <Input
            clearable
            bordered
            fullWidth
            color="primary"
            size="lg"
            placeholder="Bot Id 1"
            contentLeft={<FaRobot />}
            onChange={onChangeBotId1}
          />
          <Input
            clearable
            bordered
            fullWidth
            color="primary"
            size="lg"
            placeholder="Bot Id 2"
            contentLeft={<FaRobot />}
            onChange={onChangeBotId2}
          />
          <Row justify="space-between">
            <Text size={14}>Need Help?</Text>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button auto onClick={handleCreateBotGame}>
            Create
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

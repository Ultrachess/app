import * as React from "react";
import { Text, Grid, Modal, Input, Row, Button } from "@nextui-org/react";
import { useDispatch } from "react-redux";
import { createBotGame } from "../store/game/gameSlice";
import { FaCoins } from "react-icons/fa";

export default ({visible, closeHandler, botId}) => {
    const dispatch = useDispatch()
    const [wagerValue, setWagerValue] = React.useState(0)
    const [challengerBot, setChallengerBot] = React.useState()

    const onWagerValueChange = (event) => setWagerValue(event.target.value)
    const onChallengerBotValueChange = ( event ) => setChallengerBot(event.target.value)
    const handleCreateBotGame = () => dispatch( createBotGame(botId, challengerBot, 1, wagerValue) )

    return (
        <Modal
            closeButton
            aria-labelledby="modal-title"
            open={visible}
            onClose={closeHandler}
        >
            <Modal.Header>
            <Text id="modal-title" size={18}>
                Choose bot to challenge {botId}
            </Text>
            </Modal.Header>
            <Modal.Body>
            <Input
                clearable
                bordered
                fullWidth
                color="primary"
                size="lg"
                placeholder="Wager amount"
                contentLeft={<FaCoins/>}
                onChange = {onWagerValueChange}
            />
            <Input
                clearable
                bordered
                fullWidth
                color="primary"
                size="lg"
                placeholder="Challenger bot by Id"
                contentLeft={<FaCoins/>}
                onChange = {onChallengerBotValueChange}
            />
            <Row justify="space-between">
                <Text size={14}>Need Help?</Text>
            </Row>
            </Modal.Body>
            <Modal.Footer>
            <Button auto onClick={handleCreateBotGame}>
                Challenge
            </Button>
            </Modal.Footer>
        </Modal>
    );
}
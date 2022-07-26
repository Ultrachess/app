import * as React from "react";
import { Text, Grid, Modal, Input, Row, Button } from "@nextui-org/react";
import { useDispatch } from "react-redux";
import { createGame } from "../store/game/gameSlice";
import { FaCoins } from "react-icons/fa";

export default ({visible, closeHandler}) => {
    const dispatch = useDispatch()
    const [wagerValue, setWagerValue] = React.useState(0)

    const onWagerValueChange = (event) => setWagerValue(event.target.value)
    const handleCreateGame = () => dispatch(createGame(wagerValue))

    return (
        <Modal
            closeButton
            aria-labelledby="modal-title"
            open={visible}
            onClose={closeHandler}
        >
            <Modal.Header>
            <Text id="modal-title" size={18}>
                Create your game
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
            <Row justify="space-between">
                <Text size={14}>Need Help?</Text>
            </Row>
            </Modal.Body>
            <Modal.Footer>
            <Button auto onClick={handleCreateGame}>
                Create
            </Button>
            </Modal.Footer>
        </Modal>
    );
}
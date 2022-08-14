import * as React from "react";
import { Text, Grid, Modal, Input, Row, Button } from "@nextui-org/react";
import { useDispatch } from "react-redux";
import { createGame } from "../state/game/gameSlice";
import { FaCoins } from "react-icons/fa";
import { useActionCreator } from "../state/game/hooks";
import { TransactionTypes } from "ethers/lib/utils";
import { TransactionType } from "../common/types";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";

export default ({visible, closeHandler}) => {
    const dispatch = useDispatch()
    const addAction = useActionCreator()
    const navigate = useNavigate()
    const [wagerValue, setWagerValue] = React.useState(0)
    const [tokenAddress, setTokenAddress] = React.useState(0)

    const onWagerValueChange = (event) => setWagerValue(event.target.value)
    const onTokenAddressChange = (event) => setTokenAddress(event.target.value)
    const handleCreateGame = async () => {
        //dispatch(createGame(tokenAddress, wagerValue))
        const [action, wait] = await addAction({
            type: TransactionType.CREATE_GAME_INPUT,
            name: "default",
            isBot: false,
            wagerTokenAddress: tokenAddress,
            wagerAmount: ethers.utils.parseUnits(wagerValue)
        })
        const roomId = await wait
        console.log("jumping to" + roomId)
        navigate(`game/${roomId}`, { replace: true })
    }

    const jumpToGame = () => {
        var roomId = "ZAKNPJ1XQ5"
        navigate(`game/${roomId}`, { replace: true })
    }

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
                placeholder="ERC-20 Token Address"
                contentLeft={<FaCoins/>}
                onChange = {onTokenAddressChange}
            />
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
            <Button auto onClick={jumpToGame}>
                jump
            </Button>
            </Modal.Footer>
        </Modal>
    );
}
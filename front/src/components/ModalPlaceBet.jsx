import * as React from "react";
import { Text, Grid, Modal, Input, Row, Button } from "@nextui-org/react";
import { useDispatch } from "react-redux";
import { createGame } from "../state/game/gameSlice";
import { FaCoins } from "react-icons/fa";
import { useActionCreator, useGame } from "../state/game/hooks";
import { TransactionTypes } from "ethers/lib/utils";
import { TransactionType } from "../common/types";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import Select from "react-select"
import { useTokenList } from "../hooks/token";
import { getGameById } from "../state/game/gameHelper";

export default ({visible, closeHandler, gameId}) => {
    const dispatch = useDispatch()
    const addAction = useActionCreator()
    const navigate = useNavigate()
    const game = useGame(gameId)
    const [wagerValue, setWagerValue] = React.useState(0)
    const [tokenAddress, setTokenAddress] = React.useState(0)
    const [winningId, setWinningId] = React.useState(0)
    const tokenList = useTokenList()

    const tokens = tokenList.map((token) => {
        return {
            value: token.address,
            label: token.name
        }
    })
    const definedPlayers = game && game.players ? game.players : []
    const players = definedPlayers.map((player) => {
        return {
            value: player,
            label: player,
        }
    })

    const onWagerValueChange = (event) => setWagerValue(event.target.value)
    const onTokenAddressChange = (newValue) => setTokenAddress(newValue.value)
    const onWinningIdChange = (event) => setWinningId(event.target.value)
    const handlePlaceBet = async () => {
        //dispatch(createGame(tokenAddress, wagerValue))
        const [action, wait] = await addAction({
            type: TransactionType.BET_INPUT,
            tokenAddress: tokenAddress,
            amount: ethers.utils.parseUnits(wagerValue),
            winningId,
        })
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
                Place your bet
            </Text>
            </Modal.Header>
            <Modal.Body>
            <Row>
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
                 <Select 
                    options={tokens}
                    onChange= {onTokenAddressChange}
                />
            </Row>
            <Select 
                options={players}
                onChange= {onWinningIdChange}
            />
            <Row justify="space-between">
                <Text size={14}>Need Help?</Text>
            </Row>
            </Modal.Body>
            <Modal.Footer>
            <Button auto onClick={handlePlaceBet}>
                Bet
            </Button>
            </Modal.Footer>
        </Modal>
    );
}
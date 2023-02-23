import * as React from "react";
import { Text, Grid, Modal, Input, Row, Button } from "@nextui-org/react";
import { useDispatch, useSelector } from "react-redux";
import { createBotGame } from "../state/game/gameSlice";
import { FaCoins } from "react-icons/fa";
import { useAppSelector } from "../state/hooks";
import { useWeb3React } from "@web3-react/core";
import { isAddress } from "../utils";
import { useActionCreator } from "../state/game/hooks";
import { useCallback, useEffect, useMemo } from "react";
import Select from "react-select"
import { TransactionType } from "../common/types";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import { useTokenList } from "../hooks/token";

export default ({visible, closeHandler, botId}) => {
    const dispatch = useDispatch()
    const [wagerValue, setWagerValue] = React.useState(0)
    const [challengerBot, setChallengerBot] = React.useState()
    const [tokenAddress, setTokenAddress] = React.useState()
    const tokenList = useTokenList()
    const bots = useSelector(state => state.game.bots)
    const { account } = useWeb3React()
    const addAction = useActionCreator()
    const navigate = useNavigate()

    const onWagerValueChange = (event) => setWagerValue(event.target.value)
    const onTokenAddressChange = ( newValue ) => setTokenAddress(newValue.value)
    const onChallengerBotValueChange = ( newValue ) => setChallengerBot(newValue.value)
    const handleCreateBotGame = async () => {
        const [action, wait] = await addAction({
            type: TransactionType.CREATE_GAME_INPUT,
            name: "default",
            isBot: true,
            botId1: botId,
            botId2: isAddress(challengerBot) ? "blank" : challengerBot,
            playerId: isAddress(challengerBot) ? challengerBot : "blank",
            wagerTokenAddress: tokenAddress,
            wagerAmount: ethers.utils.parseUnits(wagerValue)
        })
        const roomId = await wait
        //console.log("jumping to" + roomId)
        navigate(`/game/${roomId}`, { replace: true })
    }

    const tokens = tokenList.map((token) => {
        return {
            value: token.address,
            label: token.name
        }
    })

    const botList = useMemo(()=>{
        return [account]
            .concat(Object.keys(bots))
            .filter(val => val != botId)
            .map(val => {
                //console.log(val)
                if(isAddress(val)) 
                    return { value: val, label:"You" }
                return { value: val, label: val }
            })
    },[bots, botId])

    //console.log(botList)

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
            <Select 
                options={botList}
                onChange= {onChallengerBotValueChange}
            />
            <Row>
                <Input
                    clearable
                    bordered
                    fullWidth
                    color="primary"
                    size="lg"
                    placeholder="Deposit amount"
                    contentLeft={<FaCoins/>}
                    onChange = {onWagerValueChange}
                />
                <Select 
                    options={tokens}
                    onChange= {onTokenAddressChange}
                />
            </Row>
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
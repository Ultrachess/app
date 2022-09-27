import * as React from "react";
import { Text, Grid, Modal, Input, Row, Button } from "@nextui-org/react";
import { useDispatch, useSelector } from "react-redux";
import { createBotGame } from "../state/game/gameSlice";
import { FaCoins } from "react-icons/fa";
import TokenList from "../utils/lists/ultrachess.tokenlists.json"
import { useAppSelector } from "../state/hooks";
import { useWeb3React } from "@web3-react/core";
import { isAddress } from "../utils";
import { useActionCreator } from "../state/game/hooks";
import { useCallback, useEffect, useMemo } from "react";
import Select from "react-select"
import { TransactionType } from "../common/types";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";

export default ({visible, closeHandler, botId}) => {
    const dispatch = useDispatch()
    const [autoMaxWagerAmount, setAutoMaxWagerAmount] = React.useState(0)
    const [autoWagerTokenAddress, setAutoWagerTokenAddress] = React.useState()
    const [autoBattleEnabled, setAutoBattleEnabled] = React.useState()
    const bots = useSelector(state => state.game.bots)
    const { account } = useWeb3React()
    const addAction = useActionCreator()
    const navigate = useNavigate()

    const onAutoMaxWagerAmountChanged = (event) => setAutoMaxWagerAmount(event.target.value)
    const onAutoWagerTokenAddressChanged = ( newValue ) => setAutoWagerTokenAddress(newValue.value)
    const onAutoBattleEnabledChanged = ( newValue ) => setAutoBattleEnabled(newValue.value)
    const handleManageBot = async () => {
        const [action, wait] = await addAction({
            type: TransactionType.MANAGER_BOT_INPUT,
            autoBattleEnabled,
            autoMaxWagerAmount,
            autoWagerTokenAddress,
            botId
        })
    }

    const tokens = TokenList.map((token) => {
        return {
            value: token.address,
            label: token.name
        }
    })

    const trueFalse = [
        {
            value: false,
            label: "False"
        },
        {
            value: true,
            label: "True"
        }
    ]


    return (
        <Modal
            closeButton
            aria-labelledby="modal-title"
            open={visible}
            onClose={closeHandler}
        >
            <Modal.Header>
            <Text id="modal-title" size={18}>
                Manage {botId}
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
                    placeholder="Auto max wager amount"
                    contentLeft={<FaCoins/>}
                    onChange = {onAutoMaxWagerAmountChanged}
                />
                <Select 
                    options={tokens}
                    onChange= {onAutoWagerTokenAddressChanged}
                />
            </Row>
            <Row>
                <Text>auto battle enabled?</Text>
                <Select 
                    options={trueFalse}
                    onChange= {onAutoBattleEnabledChanged}
                />
            </Row>
            <Row justify="space-between">
                <Text size={14}>Need Help?</Text>
            </Row>
            </Modal.Body>
            <Modal.Footer>
            <Button auto onClick={handleManageBot}>
                finish
            </Button>
            </Modal.Footer>
        </Modal>
    );
}
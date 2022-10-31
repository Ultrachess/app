import * as React from "react";
import { Text, Grid, Modal, Input, Row, Button, Dropdown } from "@nextui-org/react";
import { useDispatch } from "react-redux";
import { hooks, metaMask } from '../ether/connectors/metaMask'
const { useProvider } = hooks
import { FaCoins } from "react-icons/fa";
import { TransactionType } from "../common/types";
import { useActionCreator } from "../state/game/hooks";
import { truncateAddress } from "../ether/utils";
import { useEffect, useMemo, useState } from 'react'
import Select from "react-select"
import { useTokenList } from "../hooks/token";

export default ({visible, closeHandler}) => {
    const dispatch = useDispatch()
    const provider = useProvider()
    const addAction = useActionCreator()
    const [depositValue, setDepositValue] = React.useState(0)
    const [tokenAddress, setTokenAddress] = React.useState()
    const tokenList = useTokenList()
    const onDepositValueChange = (event) => setDepositValue(event.target.value)
    const onTokenAddressChange = ( newValue ) => {
        //console.log(newValue)
        setTokenAddress(newValue.value)
    }
    const handleCreateGame = async () =>{
        console.log(tokenAddress)
        const [approvalActionId, forApproval] = await addAction({
            type: TransactionType.APPROVE_ERC20,
            tokenAddress: tokenAddress,
            amount: depositValue
        })
        await forApproval
        const [depositActionId, wait] = await addAction({
            type: TransactionType.DEPOSIT_ERC20,
            tokenAddress: tokenAddress,
            amount: depositValue
        })
    }

    const tokens = tokenList.map((token) => {
        return {
            value: token.address,
            label: token.name
        }
    })
    //console.log(tokens)

    const truncatedAddress = useMemo(()=>{
        return truncateAddress(tokenAddress?? "")
    },[tokenAddress])

    return (
        <Modal
            closeButton
            aria-labelledby="modal-title"
            open={visible}
            onClose={closeHandler}
        >
            <Modal.Header>
            <Text id="modal-title" size={18}>
                Deposit your token
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
                    placeholder="Deposit amount"
                    contentLeft={<FaCoins/>}
                    onChange = {onDepositValueChange}
                />
                 <Select 
                    options={tokens}
                    onChange= {onTokenAddressChange}
                />
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
import * as React from "react";
import { Text, Grid, Modal, Input, Row, Button } from "@nextui-org/react";
import { useDispatch } from "react-redux";
import { hooks, metaMask } from '../ether/connectors/metaMask'
const { useProvider } = hooks
import { FaCoins } from "react-icons/fa";
import CartesiToken from "../../../deployments/localhost/CartesiToken.json"
import { TransactionType } from "../common/types";
import { useActionCreator } from "../state/game/hooks";

export default ({visible, closeHandler}) => {
    const dispatch = useDispatch()
    const provider = useProvider()
    const addAction = useActionCreator()
    const [depositValue, setDepositValue] = React.useState(0)
    const [tokenAddress, setTokenAddress] = React.useState(0)

    const onDepositValueChange = (event) => setDepositValue(event.target.value)
    const onTokenAddressChange = ( event ) => setTokenAddress(event.target.value)
    const handleCreateGame = async () =>{
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
            <Input
                clearable
                bordered
                fullWidth
                color="primary"
                size="lg"
                placeholder="Token address"
                contentLeft={<FaCoins/>}
                onChange = {onTokenAddressChange}
            />
            <Row justify="space-between">
                <Text size={14}>CTSI token address is {CartesiToken.address.toLowerCase()}</Text>
            </Row>
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
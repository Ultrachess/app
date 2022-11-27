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
import Select from "react-select"
import { useTokenList } from "../hooks/token";

export default ({visible, closeHandler}) => {
    const addAction = useActionCreator()
    const navigate = useNavigate()
    const [tourneyType, setTournamentType] = React.useState(0)
    const [participants, setParticipants] = React.useState([])
    const [participantCount, setParticipantCount] = React.useState(0)
    const [participantToAdd, setParticipantToAdd] = React.useState(0)
    const [roundCount, setRoundCount] = React.useState(0)
    const [amountOfWinners, setAmountOfWinners] = React.useState(1)

    const tournamentTypes = [
        {value:"Swiss", label:"Swiss"},
        {value:"Knockout", label:"Knockout"},
        {value:"RoundRobin", label:"RoundRobin"},
        {value:"DoubleRoundRobin", label:"DoubleRoundRobin"}
    ]

    const addParticipant = () => {
        var temp = participants
        temp.push(participantToAdd)
        setParticipants(temp)
    }
    const removeParticipant = () =>{
        var temp = participants.pop()
        setParticipants(temp)
    }
    const onParticipantToAddChange = (event) => setParticipantToAdd(event.target.value)
    const onTournamentTypeChange = (newValue) => setTournamentType(newValue.value)
    const onParticipantCountChange = (event) => setParticipantCount(event.target.value)
    const onRoundCountChange = (event) => setRoundCount(event.target.value)
    const onAmountOfWinnersChange = (event) => setAmountOfWinners(event.target.value)
    const handleTournamentCreate = async () => {
        //dispatch(createGame(tokenAddress, wagerValue))
        const [action, wait] = await addAction({
            type: TransactionType.CREATE_TOURNAMENT,
            tourneyType,
            participants,
            participantCount,
            roundCount,
            amountOfWinners,
        })
        const tournamentId = await wait
        console.log("jumping to tournament" + tournamentId)
        if(roomId) navigate(`tournaments/${roomId}`, { replace: true })
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
                Create your tournament
            </Text>
            </Modal.Header>
            <Modal.Body>

            <Text size={14}>Choose tournament type</Text>
            <Select
                options={tournamentTypes}
                onChange={onTournamentTypeChange}
            />
            <Text size={14}>Add participants</Text>
            <Row>
                <Input
                    clearable
                    bordered
                    fullWidth
                    color="primary"
                    size="lg"
                    placeholder="Participant to add"
                    onChange = {onParticipantToAddChange}
                />
                 <Button onClick={addParticipant}>Add</Button>
                 <Button onClick={removeParticipant}>Remove</Button>
            </Row>
            <Text size={14}>Set max number of players before tourney begins</Text>
            <Input
                clearable
                bordered
                fullWidth
                color="primary"
                size="lg"
                placeholder="Participant max count"
                onChange = {onParticipantCountChange}
            />
            <Text size={14}>Set max number of rounds (Knockout auto generates this)</Text>
            <Input
                clearable
                bordered
                fullWidth
                color="primary"
                size="lg"
                placeholder="Round count"
                onChange = {onRoundCountChange}
            />

            <Text size={14}>Set max number of winners</Text>
            <Input
                clearable
                bordered
                fullWidth
                color="primary"
                size="lg"
                placeholder="Max amount of winners"
                onChange = {onAmountOfWinnersChange}
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
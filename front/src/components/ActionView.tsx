import { Text } from "@nextui-org/react"
import { useEffect, useState } from "react"
import { useAction } from "../state/game/hooks"
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Toast from 'react-bootstrap/Toast';
import ProgressBar from 'react-bootstrap/ProgressBar'
import { Action, ActionStates } from "../state/game/types"

const statusToString = {
    [ActionStates.INITIALIZED]: "Initialized",
    [ActionStates.PENDING]: "Pending",
    [ActionStates.ERROR]: "Error",
    [ActionStates.CONFIRMED_WAITING_FOR_L2]: "Waiting on L2",
    [ActionStates.PROCESSED]: "Processed",
}

const statusToProgress = {
    [ActionStates.INITIALIZED]: 0,
    [ActionStates.PENDING]: 30,
    [ActionStates.ERROR]: 100,
    [ActionStates.CONFIRMED_WAITING_FOR_L2]: 60,
    [ActionStates.PROCESSED]: 100,
}

export const useTime = (refreshCycle = 100) => {
    // Returns the current time
    // and queues re-renders every `refreshCycle` milliseconds (default: 100ms)

    const [now, setNow] = useState(new Date().getTime());

    useEffect(() => {
        // Regularly set time in state
        // (this will cause your component to re-render frequently)
        const intervalId = setInterval(
        () => setNow(new Date().getTime()),
        refreshCycle,
        );

        // Cleanup interval
        return () => clearInterval(intervalId);

        // Specify dependencies for useEffect
    }, [refreshCycle, setInterval, clearInterval, setNow]);

    return now;
};

export default ({action}: {action: Action}) => {
    const now = useTime(200)
    return (
        <Toast 
            show={
                action.status != ActionStates.PROCESSED
                && action.status != ActionStates.ERROR
            }
            animation={true}
        >
            <Toast.Header>
                <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
                <strong className="me-auto">#{action.id}</strong>
                <small className="text-muted">{(now - action.initTime)/1000} seconds ago</small>
            </Toast.Header>
            <Toast.Body>
                {statusToString[action.status]}
                <ProgressBar now={statusToProgress[action.status]} label={`${statusToProgress[action.status]}%`}/>
            </Toast.Body>
        </Toast>
    )
}
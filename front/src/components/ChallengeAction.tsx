import React, { useState } from "react";
import { Text } from "./Text";
import { useActionCreator } from "../state/game/hooks";
import { TransactionType, AcceptChallengeTransactionsInfo, DeclineChallengeTransactionsInfo } from "../common/types";

export default ({challengeId, accept}: {challengeId: string, accept: boolean}) => {
    const addAction = useActionCreator()
    const [waiting, setWaiting] = useState(false)
    const onClick = async () => {
        if (waiting) return
        setWaiting(true)
        const transactionInfo: AcceptChallengeTransactionsInfo | DeclineChallengeTransactionsInfo = {
            type: accept ? TransactionType.ACCEPT_CHALLENGE : TransactionType.DECLINE_CHALLENGE,
            challengeId,
        }
        const [actionId, wait] = await addAction(transactionInfo)
        await wait
        setWaiting(false)
    }
    return (
        <Text 
            onClick={onClick}
            color={waiting ? 'faded' : accept ? 'green' : 'red'}
            underline
        >
            {accept ? 'accept' : 'decline'}
            {waiting && 'ing'}
        </Text>
    );
}

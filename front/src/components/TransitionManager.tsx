import React, { useMemo } from "react";
import { Text, Grid, Loading } from "@nextui-org/react";
import { useAllTransactions } from "../state/transactions/hooks";
import { useActionsNotProcessed } from "../state/game/hooks";
import { TransactionType } from "../common/types";
import "./TransitionManager.css"

export default () => {
    const actionsNotProcessed = useActionsNotProcessed()
    const pendingGameCreates = useMemo(()=>{
        if(actionsNotProcessed)
            return actionsNotProcessed
                .filter(({transactionInfo}) => transactionInfo.type == TransactionType.CREATE_GAME_INPUT)
        return []
    },[actionsNotProcessed])

    const pendingGameJoins = useMemo(()=>{
        if(actionsNotProcessed)
            return actionsNotProcessed
                .filter(({transactionInfo}) => transactionInfo.type == TransactionType.JOIN_GAME_INPUT)
        return []
    }, [actionsNotProcessed])

    return (
        <div
            id="overlay"
            className={
                pendingGameCreates.length > 0 ||
                pendingGameJoins.length > 0 ? 
                "visible" : 
                "invisible" 
            }
        >
            <div className="center-transition">
                <Loading/>
                { pendingGameCreates.length > 0 ? 
                    (<Text>Creating game</Text>) : 
                    pendingGameJoins.length > 0 ?
                        (<Text>Joining game</Text>) :
                        (<Text>Loading</Text>)
                }
                
            </div>
        </div>
    );
}
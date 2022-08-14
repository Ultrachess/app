import { Text } from "@nextui-org/react"
import { useEffect } from "react"
import { useAction } from "../state/game/hooks"
import { ActionStates } from "../state/game/types"

export default ({id, pauseToast, freeToast}) => {
    const action = useAction(id)
    useEffect(() => {
        let isProcessed = action.status == ActionStates.PROCESSED
        if(isProcessed) freeToast()
        else pauseToast()
    }, [action])
    
    return (
        <div>
            <Text>action id #{action.id}</Text>
            <Text>status #{action.status}</Text>
        </div>
    )
}
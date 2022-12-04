import { useMemo } from "react"
import { useParams } from "react-router-dom"
import { useAppSelector } from "../state/hooks"
import GameList from "./GameList"
import { Row, Text, Button, Spacer, Card} from "@nextui-org/react";


export default () => {
    const { tournamentId } = useParams()
    const tournaments = useAppSelector(state => state.game.tournaments)
    const tournament = useMemo(() => 
        tournaments?.find(t => t?.id == tournamentId),
    [tournamentId, tournaments])
    
    return (
        <div className="body">
            <div className="content">
                <Card shadow={true} css={{ width:"1300px", height:"700px", paddingLeft:"50px", paddingRight:"50px", paddingTop:"50px"}}>
                    <Card.Header>
                        <Row justify="center">
                            <Text>Tournament {tournamentId}</Text>
                        </Row>
                    </Card.Header>
                    {tournament.matches.map((round, index) => {
                        return(
                            <div id="roundView">
                                <Text h1>Round {index}</Text>
                                <GameList games={round.map(match => match.game[0] ?? {})}/>
                            </div>
                        )
                    })}
                </Card>
            </div>
            
        </div>
    )
}
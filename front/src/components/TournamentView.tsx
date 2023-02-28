import { useParams } from "react-router-dom"
import { useTournament } from "../state/game/hooks"
import { SingleEliminationBracket, SVGViewer, Match } from "@g-loot/react-tournament-brackets"
import { useMemo } from "react"

interface ParticipantTypeForRendering {
    id: string
    resultText: string
    isWinner: boolean
    status: string | null
    name: string
}

interface MatchTypeForRendering {
    id: number
    name: string
    nextMatchId: number, // Id for the nextMatch in the bracket, if it's final match it must be null OR undefined
    tournamentRoundText: string, // Text for Round Header
    startTime: string, // ISO 8601 string
    state: string, // 'NO_SHOW' | 'WALK_OVER' | 'NO_PARTY' | 'DONE' | 'SCORE_DONE' Only needed to decide walkovers and if teamNames are TBD (to be decided)
    participants: ParticipantTypeForRendering[]      
}


export default () => {
    let { tournamentId } = useParams()
    const tournament = useTournament(tournamentId)

    const tournamentMatchesForRendering: MatchTypeForRendering[] = 
        useMemo(() => {
            if (tournament) {
                var rounds = tournament.matches;
                var matches: MatchTypeForRendering[] = []
                for (var i = 0; i < rounds.length; i++) {
                    var round = rounds[i];
                    for (var j = 0; j < round.length; j++) {
                        var match = round[j];
                        var matchForRendering: MatchTypeForRendering = {
                            id: parseInt(i.toString() + j.toString()),
                            name: "match " + i.toString() + j.toString(),
                            nextMatchId: ((i + 1) < rounds.length) ? parseInt((i + 1).toString() + (j / 2).toString()) : undefined,
                            tournamentRoundText: "Round " + (i + 1).toString(),
                            startTime: "2021-01-01T00:00:00.000Z",
                            state: match.leftScore + match.rightScore > 0 ? "DONE" : "IN_PROGRESS",
                            participants: [
                                {
                                    id: match.left,
                                    resultText: match.leftScore.toString(),
                                    isWinner: match.leftScore > match.rightScore,
                                    status: match.left ? "ACTIVE" : "NOT IN TOURNAMENT",
                                    name: match.left ? match.left : "WAITING FOR OPPONENT",
                                },
                                {
                                    id: match.right,
                                    resultText: match.rightScore.toString(),
                                    isWinner: match.rightScore > match.leftScore,
                                    status: match.right ? "ACTIVE" : "NOT IN TOURNAMENT",
                                    name: match.right ? match.right : "WAITING FOR OPPONENT",
                                }
                            ]
                        }
                        matches.push(matchForRendering)
                    }
                }
                return matches
            }
            return []
        }, [tournament])

        


    return (
        <div>
            <SingleEliminationBracket
                matches={tournamentMatchesForRendering}
                matchComponent={Match}
                svgWrapper={({ children, ...props }) => (
                <SVGViewer width={500} height={500} {...props}>
                    {children}
                </SVGViewer>
                )}
            />
        </div>
    )
}
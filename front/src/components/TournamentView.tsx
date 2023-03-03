import { useParams } from "react-router-dom"
import { useTournament } from "../state/game/hooks"
import { SingleEliminationBracket, SVGViewer, Match } from "@g-loot/react-tournament-brackets"
import { useMemo } from "react"
import { Text } from "./ui/Text"
import { styled } from "@stitches/react";
import Button from "./ui/Button";
import { violet } from "@radix-ui/colors";
import { TournamentMatch } from "../state/game/types"
import Flex from "./ui/Flex"
import Separator from "./ui/Separator";
import TournamentRoundView from "./list/TournamentRoundView"
import ModalJoinTournament from "./ModalJoinTournament"

// interface ParticipantTypeForRendering {
//     id: string
//     resultText: string
//     isWinner: boolean
//     status: string | null
//     name: string
// }

// interface MatchTypeForRendering {
//     id: number
//     name: string
//     nextMatchId: number, // Id for the nextMatch in the bracket, if it's final match it must be null OR undefined
//     tournamentRoundText: string, // Text for Round Header
//     startTime: string, // ISO 8601 string
//     state: string, // 'NO_SHOW' | 'WALK_OVER' | 'NO_PARTY' | 'DONE' | 'SCORE_DONE' Only needed to decide walkovers and if teamNames are TBD (to be decided)
//     participants: ParticipantTypeForRendering[]      
// }


export default () => {
    let { tournamentId } = useParams()
    const tournament = useTournament(tournamentId)

    console.log("tournament: ", tournament)

    const rounds = useMemo(() => {
        if (!tournament) return []
        const rounds = tournament.matches
            .map((matches, index) => {
                return (
                    <Flex css={{ flexDirection: 'column', gap: 2 }}>
                        <Text faded>Round #{index}</Text>
                        <TournamentRoundView matches={matches} />
                    </Flex>
                )
            }
        )
        return rounds
    }, [tournament])

    return (
        <div className="body">
        <div className="header">
            <div>
            <Text bold black size={"max"} css={{ textAlign: "center", marginBottom: "10px" }}>
                Tournament #{tournamentId}
            </Text>
            </div>

        </div>
        <div className="content">
            <div className="contentHolder">
            <div>
                <div className="contentHeader">
                <Label>Rounds list</Label>
                <RightSlot>
                    <ModalJoinTournament 
                        tournamentId={tournamentId}
                        triggerElement = {
                            <Button>
                                <Text>Join tournament</Text>
                            </Button>
                        }
                    />
                </RightSlot>
                </div>
                <Separator />
                {rounds}
            </div>
            </div>
        </div>
    </div>
    )
}

const Label = styled('label', {
    fontSize: 23,
    lineHeight: 1,
    fontWeight: 500,
    marginBottom: 20,
    color: violet.violet12,
    display: 'block',
  });
  
  const LeftSlot = styled('div', {
      marginRight: 'auto',
      paddingRight: 0,
      display: 'flex',
      color: violet.violet11,
      '[data-highlighted] > &': { color: 'white' },
      '[data-disabled] &': { color: violet.violet4 },
    });
  
    const RightSlot = styled('div', {
      marginLeft: 'auto',
      paddingLeft: 0,
      display: 'flex',
      '[data-highlighted] > &': { color: 'white' },
    });
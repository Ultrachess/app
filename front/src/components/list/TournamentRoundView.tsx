import { TournamentMatch } from "../../state/game/types";
import TournamentMatchListItem from "./TournamentMatchListItem";
import List from "../ui/List";
import { Text } from "../ui/Text";

export default ({matches}: {matches: TournamentMatch[]}) => {
    const matchItems = matches.length > 0 ? 
        matches.map((match) => <TournamentMatchListItem match={match}  />) :
        [<Text key={0}>No matches established</Text>]

    return (
        <List
            items={matchItems}
        />
    );
}
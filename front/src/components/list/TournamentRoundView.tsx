import { TournamentMatch } from "../../state/game/types";
import TournamentMatchListItem from "./TournamentMatchListItem";
import List from "../ui/List";
import { Text } from "../ui/Text";

export default ({matches}: {matches: TournamentMatch[]}) => {
    const matchItems = matches.length > 0 ? 
        matches.map((bot) => <TournamentMatchListItem match={bot}  />) :
        [<Text key={0}>No matches established</Text>]

    return (
        <List
            items={matchItems}
        />
    );
}
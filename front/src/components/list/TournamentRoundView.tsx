import { TournamentMatch } from "../../state/game/types";
import List from "../ui/List";
import { Text } from "../ui/Text";
import TournamentMatchListItem from "./TournamentMatchListItem";

export default ({ matches }: { matches: TournamentMatch[] }) => {
  const matchItems =
    matches.length > 0
      ? matches.map((match) => <TournamentMatchListItem match={match} />)
      : [<Text key={0}>No matches established</Text>];

  return <List items={matchItems} />;
};

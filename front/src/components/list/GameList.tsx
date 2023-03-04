import { Game } from "../../state/game/types";
import List from "../ui/List";
import { Text } from "../ui/Text";
import GameListItem from "./GameListItem";

export default ({ games }: { games: Game[] }) => {
  const gameItems =
    games.length > 0
      ? games.map((game) => <GameListItem game={game} />)
      : [<Text key={0}>No games found</Text>];
  return <List items={gameItems} />;
};

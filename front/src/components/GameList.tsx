import GameListItem from "./GameListItem";
import { Game } from "../state/game/types";
import List from "./List";

export default ({games}: {games: Game[]}) => {
    const gameItems = games.map((game) => <GameListItem game={game} />)
    return (
        <List
            items={gameItems}
            emptyMessage="No games found"
        />
    );
}
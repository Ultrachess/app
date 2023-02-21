import List from "../ui/List";
import { Text } from "../ui/Text";
import ProfileListItem from "./ProfileListItem";
import { Profile } from "../../state/game/types";

export default ({profiles, showRank=false}: {profiles: Profile[], showRank:Boolean}) => {
    const botItems = profiles.length > 0 ? 
    profiles.map((bot, index) => <ProfileListItem profile={bot} rank={showRank? index : 0} />) :
        [<Text key={0}>No profiles found</Text>]

    return <List items={botItems}/>
    
}
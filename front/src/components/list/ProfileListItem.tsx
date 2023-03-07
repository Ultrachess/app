//React component that takes in BotProfile and renders it with multiple Flex components

import { Profile, ProfileType, UserProfile } from "../../state/game/types";
import BotListItem from "./BotListItem";
import UserProfileListItem from "./UserProfileListItem";

//function that converts country string to flag emoji
//return flag emoji
const getFlag = (country: string) => {
  const code = country.toUpperCase();
  const emoji = code.replace(/./g, (char) =>
    String.fromCodePoint(char.charCodeAt(0) + 127397)
  );
  return emoji;
};

export default ({
  profile,
  rank = 0,
}: {
  profile: Profile | any;
  rank: number;
}) => {
  const type = profile.type;

  const item =
    type == ProfileType.BOT ? (
      <BotListItem bot={profile} rank={rank} />
    ) : (
      <UserProfileListItem profile={profile} rank={rank} />
    );

  return item;
};

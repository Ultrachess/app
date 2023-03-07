import "./Address.css";

import { Row } from "react-bootstrap";
import { Link } from "react-router-dom";

import { truncateAddress } from "../ether/utils";
import ProfileImage from "./ProfileImage";
import { Text } from "./ui/Text";

export default ({ id }: { id: string }) => {
  return (
    <Link to={"/game/" + id}>
      <Text bold>{id}</Text>
    </Link>
  );
};

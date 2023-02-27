import "./Address.css"
import { Link } from 'react-router-dom';
import { Row } from 'react-bootstrap';
import ProfileImage from "./ProfileImage";
import { truncateAddress } from "../ether/utils";
import { Text } from "./ui/Text";

export default ({id}: {id: String}) => {
  return (
      <Link to={"/game/" + id}>
          <Text bold>{id}</Text>
      </Link>
  );
}

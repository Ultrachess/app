import "./Address.css"
import { Link } from 'react-router-dom';
import { Row } from 'react-bootstrap';
import ProfileImage from "./ProfileImage";
import { truncateAddress } from "../ether/utils";
import { Text } from "./Text";

export default ({id}: {id: String}) => {
  return (
    <div className='addressView'>
      <Link to={"/game/" + id}>
        <Row>
          <Text bold>{id}</Text>
        </Row>
      </Link>
    </div>
  );
}

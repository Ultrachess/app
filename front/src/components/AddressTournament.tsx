import "./Address.css";

import { Row } from "react-bootstrap";
import { Link } from "react-router-dom";

import { truncateAddress } from "../ether/utils";
import ProfileImage from "./ProfileImage";
import { Text } from "./ui/Text";

export default ({ id }: { id: string }) => {
  return (
    <div className="addressView">
      <Link to={"/tournament/" + id}>
        <Row>
          <Text bold>{id}</Text>
        </Row>
      </Link>
    </div>
  );
};

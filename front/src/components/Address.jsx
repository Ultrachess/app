import React, { useMemo, useRef } from 'react'
import { Grid, User } from "@nextui-org/react";
import { createIcon } from '@download/blockies';
import "./Address.css"
import { Link } from 'react-router-dom';
import { Row } from 'react-bootstrap';
import ProfileImage from "./ProfileImage";
import { truncateAddress } from "../ether/utils";
import { Text } from "./Text";

export default (props) => {
  const { value } = props
  const isBot = useMemo(()=>!value.includes("0x"))
  return (
    <div className='addressView'>
      <Link to={ (isBot? "/bot/":"/users/") + value}>
        <Row>
          <ProfileImage address={address} />
          <Text bold>{truncateAddress(address)}</Text>
        </Row>
      </Link>
    </div>
  );
}

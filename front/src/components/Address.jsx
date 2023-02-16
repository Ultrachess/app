import React, { useMemo, useRef } from 'react'
import { Grid, User } from "@nextui-org/react";
import { createIcon } from '@download/blockies';
import "./Address.css"
import { Link } from 'react-router-dom';
import { Row } from 'react-bootstrap';
import ProfileImage from "./ProfileImage";
import { truncateAddress } from "../ether/utils";
import { Text } from "./ui/Text";
import ProfileHover from './ProfileHover';

export default ({value, hoverable = false}) => {
  const isBot = useMemo(()=>!value.includes("0x"))
  const temp = 
    <div className='addressView'>
      <Link to={ (isBot? "/bot/":"/users/") + value}>
        <Row>
          <ProfileImage address={value} />
          <Text bold>{truncateAddress(value)}</Text>
        </Row>
      </Link>
    </div>

  return (
    <>
      {hoverable ? <ProfileHover triggerElement={temp} profileId={value}/>: temp}
    </>
  );
}

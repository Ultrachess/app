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
import Flex from './ui/Flex';

export default ({value, hoverable = false, isImageBig=false}) => {
  const isBot = useMemo(()=>!value.includes("0x"))
  const addressView = 
    <div className='addressView'>
      <Link to={ (isBot? "/bot/":"/users/") + value}>
        <Row>
          <ProfileImage address={value} />
          <Text bold>{truncateAddress(value)}</Text>
        </Row>
      </Link>
    </div>
  
  //bigAddressView is used for the profile page
  //It renders the ProfileImage component with a bigger size
  //in a flex column
  const bigAddressView =
    <div className='addressView'>
      <Link to={ (isBot? "/bot/":"/users/") + value}>
        <Flex css={{flexDirection: "column", alignItems: "center"}}>
          <ProfileImage address={value} diameter={100} />
          <Text bold>{truncateAddress(value)}</Text>
        </Flex>
      </Link>
    </div>

  const component = isImageBig? bigAddressView: addressView;

  return (
    <>
      {hoverable ? <ProfileHover triggerElement={component} profileId={value}/>: component}
    </>
  );
}

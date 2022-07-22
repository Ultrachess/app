import React, { useRef } from 'react'
import { Text, Grid, User } from "@nextui-org/react";
import { truncateAddress } from "../ether/utils";
import { createIcon } from '@download/blockies';
import { Avatar } from '@nextui-org/react';
import "./Address.css"
export default (props) => {
  const { value } = props
  var dataUrlSrc = createIcon({ // All options are optional
      seed: value, // seed used to generate icon data, default: random
      color: '#dfe', // to manually specify the icon color, default: random
      bgcolor: '#aaa', // choose a different background color, default: white
      size: 10, // width/height of the icon in blocks, default: 10
      scale: 3 // width/height of each block in pixels, default: 5
  }).toDataURL();
  return (
    <div className='addressView'>
      <User
        src={dataUrlSrc} 
        name={ truncateAddress(value) }
      />
    </div>
  );
}
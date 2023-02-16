import React from 'react';
import * as HoverCard from '@radix-ui/react-hover-card';
import { styled, keyframes } from '@stitches/react';
import { mauve } from '@radix-ui/colors';
import { useProfile } from '../state/game/hooks';
import { Profile, ProfileType, BotProfile, UserProfile } from '../state/game/types';
import Address from './Address';
import AssetDisplay from './AssetDisplay';
import ModalCreateChallenge from './ModalCreateChallenge';
import Button from './ui/Button';
import ModalCreateOffer from './ModalCreateOffer';
import BotMoveStatisticsView from './BotMoveStatisticsView';
import Flex from './ui/Flex';
import {Text} from './ui/Text';
import { BotMoveStats } from '../state/game/types';

const GameBotMoveStatisticsHoverable = ({triggerElement, botMoveStat}: {triggerElement: React.ReactNode, botMoveStat: BotMoveStats | null}) => {
    return (

        <HoverCard.Root 
          openDelay={10}
          closeDelay={10}
        >
            <HoverCard.Trigger asChild>
                {triggerElement}
            </HoverCard.Trigger>
            <HoverCard.Portal>
            <HoverCardContent sideOffset={5}>
                {botMoveStat ?
                    <BotMoveStatisticsView botMoveStat={botMoveStat} flexDir="column" />
                    :<Flex css={{gap:1, flexDirection:'column'}}>
                        <Text faded>
                            Normal human move, 
                            <br/>
                            nothing to see here
                        </Text>
                    </Flex>
                }
            </HoverCardContent>
            </HoverCard.Portal>
        </HoverCard.Root>
    )
};

const slideUpAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateY(2px)' },
  '100%': { opacity: 1, transform: 'translateY(0)' },
});

const slideRightAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateX(-2px)' },
  '100%': { opacity: 1, transform: 'translateX(0)' },
});

const slideDownAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateY(-2px)' },
  '100%': { opacity: 1, transform: 'translateY(0)' },
});

const slideLeftAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateX(2px)' },
  '100%': { opacity: 1, transform: 'translateX(0)' },
});

const HoverCardContent = styled(HoverCard.Content, {
  borderRadius: 6,
  padding: 20,
  width: 300,
  backgroundColor: 'white',
  boxShadow: 'hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px',
  animationDuration: '400ms',
  animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
  willChange: 'transform, opacity',
  '&[data-state="open"]': {
    '&[data-side="top"]': { animationName: slideDownAndFade },
    '&[data-side="right"]': { animationName: slideLeftAndFade },
    '&[data-side="bottom"]': { animationName: slideUpAndFade },
    '&[data-side="left"]': { animationName: slideRightAndFade },
  },
});

const HoverCardArrow = styled(HoverCard.Arrow, {
  fill: 'white',
});

const ImageTrigger = styled('a', {
  all: 'unset',
  cursor: 'pointer',
  borderRadius: '100%',
  display: 'inline-block',
  '&:focus': { boxShadow: `0 0 0 2px white` },
});

const Img = styled('img', {
  display: 'block',
  borderRadius: '100%',
  variants: {
    size: {
      normal: { width: 45, height: 45 },
      large: { width: 60, height: 60 },
    },
  },
  defaultVariants: {
    size: 'normal',
  },
});

export default GameBotMoveStatisticsHoverable;
import * as React from 'react';
import { styled } from '@stitches/react';
import { Button } from './Button';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { Text } from './Text';


const NotificationDropdown = ({dropdownTrigger}) => {
    const [bookmarksChecked, setBookmarksChecked] = React.useState(true);
    const [urlsChecked, setUrlsChecked] = React.useState(false);
    const [person, setPerson] = React.useState('pedro');
  
    return (
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          {dropdownTrigger}
        </DropdownMenu.Trigger>
  
        <DropdownMenu.Portal>
          <DropdownMenuContent sideOffset={5}>
            <DropdownMenuLabel>Profile</DropdownMenuLabel>
            <DropdownMenuItem>
              View Profile <RightSlot css={{display:"flex"}}><ProfileImage address={address} /><Text bold>{truncateAddress(address)}</Text></RightSlot>
            </DropdownMenuItem>
            
            <DropdownMenuItem>
              Withdraw <Text>&nbsp;(from portal) </Text><RightSlot><AssetDisplay isL2={true} tokenAddress={USDC_ADDRESS_ON_NETWORKS[chainId]}/></RightSlot>
            </DropdownMenuItem>
  
            <DropdownMenuItem>
              Create game
            </DropdownMenuItem>
  
            <DropdownMenuItem>
              Create tournament
            </DropdownMenuItem>
  
            <DropdownMenuItem>
              Upload Bot
            </DropdownMenuItem>
  
            <DropdownMenuItem>
              Challenge
            </DropdownMenuItem>
            
            <DropdownMenuSeparator/>
            <DropdownMenuLabel>Settings</DropdownMenuLabel>
            <DropdownMenuItem>
              Generate new burner wallet <RightSlot css={{display:"flex"}}><ProfileImage address={address} /><Text bold>{truncateAddress(address)}</Text></RightSlot>
            </DropdownMenuItem>
            <DropdownMenu.Sub>
              <DropdownMenuSubTrigger>
                Toggle Light/Dark mode <RightSlot>⌘+S</RightSlot>
                <RightSlot>
                  <ChevronRightIcon />
                </RightSlot>
              </DropdownMenuSubTrigger>
              <DropdownMenu.Portal>
                <DropdownMenuSubContent sideOffset={2} alignOffset={-5}>
                <DropdownMenuCheckboxItem
              checked={bookmarksChecked}
              onCheckedChange={setBookmarksChecked}
            >
              <DropdownMenuItemIndicator>
                <CheckIcon />
              </DropdownMenuItemIndicator>
              Light mode <RightSlot>⌘+B</RightSlot>
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={!setBookmarksChecked} onCheckedChange={setUrlsChecked}>
              <DropdownMenuItemIndicator>
                <CheckIcon />
              </DropdownMenuItemIndicator>
              Dark mode
            </DropdownMenuCheckboxItem>
                </DropdownMenuSubContent>
              </DropdownMenu.Portal>
            </DropdownMenu.Sub>
            <DropdownMenuSeparator />
            
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuItem><Text>none</Text></DropdownMenuItem>
  
            <DropdownMenuArrow />
          </DropdownMenuContent>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    );
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
  
  const contentStyles = {
    minWidth: 220,
    backgroundColor: 'white',
    borderRadius: 6,
    padding: 5,
    boxShadow:
      '0px 10px 38px -10px rgba(22, 23, 24, 0.35), 0px 10px 20px -15px rgba(22, 23, 24, 0.2)',
    animationDuration: '400ms',
    animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
    willChange: 'transform, opacity',
    '&[data-state="open"]': {
      '&[data-side="top"]': { animationName: slideDownAndFade },
      '&[data-side="right"]': { animationName: slideLeftAndFade },
      '&[data-side="bottom"]': { animationName: slideUpAndFade },
      '&[data-side="left"]': { animationName: slideRightAndFade },
    },
  };
  
  const DropdownMenuContent = styled(DropdownMenu.Content, contentStyles);
  const DropdownMenuSubContent = styled(DropdownMenu.SubContent, contentStyles);
  
  const DropdownMenuArrow = styled(DropdownMenu.Arrow, { fill: 'white' });
  
  const itemStyles = {
    all: 'unset',
    fontSize: 13,
    lineHeight: 1,
    color: violet.violet11,
    borderRadius: 3,
    display: 'flex',
    alignItems: 'center',
    height: 25,
    padding: '0 5px',
    position: 'relative',
    paddingLeft: 25,
    userSelect: 'none',
  
    '&[data-disabled]': {
      color: mauve.mauve8,
      pointerEvents: 'none',
    },
  
    '&[data-highlighted]': {
      backgroundColor: violet.violet9,
      color: violet.violet1,
    },
  };
  
  const DropdownMenuItem = styled(DropdownMenu.Item, itemStyles);
  const ClickableDropdownMenuItem = styled('div', itemStyles);
  const DropdownMenuCheckboxItem = styled(DropdownMenu.CheckboxItem, itemStyles);
  const DropdownMenuRadioItem = styled(DropdownMenu.RadioItem, itemStyles);
  const DropdownMenuSubTrigger = styled(DropdownMenu.SubTrigger, {
    '&[data-state="open"]': {
      backgroundColor: violet.violet4,
      color: violet.violet11,
    },
    ...itemStyles,
  });
  
  const DropdownMenuLabel = styled(DropdownMenu.Label, {
    paddingLeft: 25,
    fontSize: 12,
    lineHeight: '25px',
    color: mauve.mauve11,
  });
  
  const DropdownMenuSeparator = styled(DropdownMenu.Separator, {
    height: 1,
    backgroundColor: violet.violet6,
    margin: 5,
  });
  
  const DropdownMenuItemIndicator = styled(DropdownMenu.ItemIndicator, {
    position: 'absolute',
    left: 0,
    width: 25,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  });
  
  const RightSlot = styled('div', {
    marginLeft: 'auto',
    paddingLeft: 20,
    color: mauve.mauve11,
    '[data-highlighted] > &': { color: 'white' },
    '[data-disabled] &': { color: mauve.mauve8 },
  });
  
  const IconButton = styled('button', {
    all: 'unset',
    fontFamily: 'inherit',
    borderRadius: '100%',
    height: 35,
    width: 35,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: violet.violet11,
    backgroundColor: 'white',
    boxShadow: `0 2px 10px ${blackA.blackA7}`,
    '&:hover': { backgroundColor: violet.violet3 },
  });
  
  const Button = styled('button', {
    all: 'unset',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    padding: '0 15px',
    fontSize: 15,
    lineHeight: 1,
    fontWeight: 300,
    height: 35,
  
    variants: {
      variant: {
        violet: {
          backgroundColor: 'white',
          color: violet.violet11,
          boxShadow: `0 2px 10px ${blackA.blackA7}`,
          '&:hover': { backgroundColor: mauve.mauve3 },
          //'&:focus': { boxShadow: `0 0 0 2px black` },
        },
        red: {
          backgroundColor: red.red4,
          color: red.red11,
          '&:hover': { backgroundColor: red.red5 },
          '&:focus': { boxShadow: `0 0 0 2px ${red.red7}` },
        },
        mauve: {
          backgroundColor: mauve.mauve4,
          color: mauve.mauve11,
          '&:hover': { backgroundColor: mauve.mauve5 },
          '&:focus': { boxShadow: `0 0 0 2px ${mauve.mauve7}` },
        },
      },
    },
  
    defaultVariants: {
      variant: 'violet',
    },
  });
  
  const SeparatorRoot = styled(Separator.Root, {
    backgroundColor: violet.violet6,
    '&[data-orientation=horizontal]': { height: 0.5, width: '80%' },
    '&[data-orientation=vertical]': { height: '50%', width: 1 },
  });
  
export default NotificationDropdown;
  
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal, Modal, Row } from "@nextui-org/react";
import { FaUser } from 'react-icons/fa';
import { toHex, truncateAddress } from "../ether/utils";
import { setChainId, setAccounts, setError, setIsActivating, setIsActive, setProvider } from "../state/auth/authSlice";
import { useEffect } from 'react'
import { hooks, metaMask } from '../ether/connectors/metaMask'
import { initContracts } from "../state/game/gameSlice";
import AssetDisplay from "./AssetDisplay";
import { useAppSelector } from "../state/hooks";
import { useTime } from "./ActionView";
import "./Auth.css"
import AuthNetwork from "./AuthNetwork";
import * as Separator from "@radix-ui/react-separator"
import * as Popover from '@radix-ui/react-popover';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { styled, keyframes } from '@stitches/react';
import { violet, mauve, blackA, red } from '@radix-ui/colors';
import {
  HamburgerMenuIcon,
  DotFilledIcon,
  CheckIcon,
  ChevronRightIcon,
  ChevronDownIcon,
} from '@radix-ui/react-icons';
import { useWeb3React } from "@web3-react/core";
import ProfileImage from "./ProfileImage";
import { USDC_ADDRESS_ON_NETWORKS } from "../ether/chains";
import { SelectIcon } from "@radix-ui/react-select";
import { Text } from "./ui/Text";
import ModalNewDepositFunds from "./ModalNewDepositFunds";
import NotificationDropdown from "./NotificationDropdown";
import { Link } from "react-router-dom";
import { useBalance } from "../state/game/hooks";

const { useChainId, useAccounts, useError, useIsActivating, useIsActive, useProvider, useENSNames } = hooks

export default () => {
  const { setVisible, bindings } = useModal();
  const auth = useSelector(state => state.auth);
  const now = useTime(2000)
  const lastStepTimestamp = useAppSelector(state => state.game.lastStepTimestamp)
  const dispatch = useDispatch();
  
  const chainId = useChainId()
  const accounts = useAccounts()
  const error = useError()
  const isActivating = useIsActivating()
  const isActive = useIsActive()
  const provider = useProvider()
  const ENSNames = useENSNames(provider)
  const { account } = useWeb3React()

  //create newtork dropdown

  //create wallet dropdown

  // attempt to connect eagerly on mount
  useEffect(() => {
    void metaMask.connectEagerly()
  }, [])

  useEffect(()=>{
    dispatch(setChainId(chainId))
    dispatch(setAccounts(accounts))
    //dispatch(setError(error))
    dispatch(setIsActivating(isActivating))
    dispatch(setIsActive(isActive))
    //dispatch(setProvider(provider))
    if(provider)
      dispatch(initContracts(provider.getSigner(0), chainId))
  }, [
    chainId, 
    accounts, 
    error, 
    isActivating, 
    isActive, 
    provider, 
  ])
  
  return (
    <div>
      <div>
      {isActive ? (
        <Row justify="space-evenly">
          {/* {lastStepTimestamp == 0 ? 
            <Row><Text className="smallText" css={{
              textGradient: "45deg, $blue600 -20%, $pink600 50%",
          }}>waiting on cycle update</Text></Row> :
            <Text className="smallText" css={{
              textGradient: "45deg, $blue600 -20%, $pink600 50%",
          }}>cycle: {Math.max(Math.round((now/1000)-lastStepTimestamp), 0)} secs ago</Text>
          } */}
          <NotificationDropdown/>
          <AuthNetwork chainId={chainId}/>
          
          <DropdownMenuMain address = {account} chainId = {chainId}/>
        </Row>
      ) : (
        <Button shadow icon={<FaUser/>} flat color="primary" auto onClick={() => setVisible(true)}>
          Connect to a wallet
        </Button>
      )}
      </div>
      
      
      <Modal 
        scroll 
        width="600px" 
        aria-labelledby="modal-title"   
        aria-describedby="modal-description" 
        {...bindings}
      >
        <Modal.Header>
          <Text id="modal-title" size={18}>
            Select Wallet
          </Text>
        </Modal.Header>
        <Modal.Body>
            <Button
              variant="outline"
              onClick={() => {
                metaMask.activate()
                //console.log("metamask")
              }}
              w="100%"
            >
                <Text>Metamask</Text>
            </Button>
        </Modal.Body>
        <Modal.Footer>
          <Button auto flat color="error" onClick={() => setVisible(false)}>
            Close
          </Button>
          <Button auto onClick={() => setVisible(false)}>
            Agree
          </Button>
        </Modal.Footer>
    </Modal>
    </div>
    
    
    
  );
}




const DropdownMenuMain = ({address, chainId}) => {
  const [bookmarksChecked, setBookmarksChecked] = React.useState(true);
  const [urlsChecked, setUrlsChecked] = React.useState(false);
  const [person, setPerson] = React.useState('pedro');
  const balance = useBalance(address, USDC_ADDRESS_ON_NETWORKS[chainId])

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button>
          <AssetDisplay balance={balance} tokenAddress={USDC_ADDRESS_ON_NETWORKS[chainId]}/>
          <SeparatorRoot decorative orientation="vertical" css={{ margin: '0 15px' }} />
          <SelectIcon>
          <ProfileImage address={address} />
          </SelectIcon>
          <Text bold>{truncateAddress(address)}</Text>
          <SelectIcon>
          <ChevronDownIcon />
          </SelectIcon>
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenuContent sideOffset={5}>
          <DropdownMenuLabel>Profile</DropdownMenuLabel>
          <DropdownMenuItem>
            <Link to={"/users/" + address}>
              View Profile <RightSlot css={{display:"flex"}}><ProfileImage address={address} /><Text bold>{truncateAddress(address)}</Text></RightSlot>
            </Link>
          </DropdownMenuItem>
          <ModalNewDepositFunds triggerElement={
            <ClickableDropdownMenuItem>Deposit <Text>&nbsp;(to portal)</Text> <RightSlot><AssetDisplay tokenAddress={USDC_ADDRESS_ON_NETWORKS[chainId]}/></RightSlot></ClickableDropdownMenuItem>
          }/>
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

const Box = styled('div', {});
const Flex = styled('div', { display: 'flex' });


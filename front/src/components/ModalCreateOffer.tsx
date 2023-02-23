import React, { useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { styled, keyframes } from '@stitches/react';
import { violet, blackA, mauve, green } from '@radix-ui/colors';
import { Cross2Icon } from '@radix-ui/react-icons';
import * as Slider from '@radix-ui/react-slider';
import { Text } from './ui/Text';
import { useTokenFromList, useTokenPortalBalance, useTokenBalance } from '../hooks/token';
import { USDC_ADDRESS_ON_NETWORKS } from '../ether/chains';
import AssetDisplay from './AssetDisplay';
import { useWeb3React } from '@web3-react/core';
import { useActionCreator } from '../state/game/hooks';
import { TransactionType } from '../common/types';
import Address from './Address';
import { useProfile } from '../state/game/hooks';
import { BotProfile } from '../state/game/types';

export default ({triggerElement, botId}) => {
    const { chainId, account } = useWeb3React()
    const [amount, setAmount ] = useState<any>(0)
    const max = 100
    const token = useTokenFromList(USDC_ADDRESS_ON_NETWORKS[chainId]);
    const portalBalance = useTokenPortalBalance(token, account) 

    const addAction = useActionCreator()

    //const bot: BotProfile = useProfile(botId)

    const handleOffer = async () => {
      const [approvalActionId, wait] = await addAction({
        type: TransactionType.CREATE_OFFER,
        botId: botId,
        token: token.address,
        price: amount,
      })
      await wait
    }


    //console.log("amount", amount)
    return (
        <Dialog.Root>
        <Dialog.Trigger asChild>
          {triggerElement}
        </Dialog.Trigger>
        <Dialog.Portal>
          <DialogOverlay />
          <DialogContent>
            <DialogTitle>Create offer for <Address value={botId} /></DialogTitle>
            <DialogDescription>
              You are offering to buy this bot for <AssetDisplay tokenAddress={token?.address} balance={amount} isL2={true}/>. 
              Make sure to deposit funds to the portal first if you have not done so.
            </DialogDescription>
            
            <Fieldset>
                <Label>Price</Label>
                <RightSlot>
                  <Text>Balance if offer accepted:</Text>
                  <AssetDisplay tokenAddress={token?.address} balance={portalBalance + amount} isL2={true}/>
                </RightSlot>
            </Fieldset>
            <Fieldset>
              <Input id="amount" value={amount} defaultValue={0} onChange={(event)=>{ setAmount(event.target.value)}}>
                </Input>
                <RightSlot onClick={()=>setAmount(max)}>MAX</RightSlot>
            </Fieldset>
            <Fieldset>
                <SliderMain value={amount} max={100} onChangeFunction={([value])=>{ setAmount(value)}} />
            </Fieldset>
            <Flex css={{ marginTop: 25, justifyContent: 'flex-end' }}>
              <Dialog.Close asChild>
                <Button 
                  variant="green"
                  onClick={handleOffer}
                >
                  Make offer
                </Button>
              </Dialog.Close>
            </Flex>
            <Dialog.Close asChild>
              <IconButton aria-label="Close">
                <Cross2Icon />
              </IconButton>
            </Dialog.Close>
          </DialogContent>
        </Dialog.Portal>
      </Dialog.Root>
  )
}

const overlayShow = keyframes({
    '0%': { opacity: 0 },
    '100%': { opacity: 1 },
  });
  
  const contentShow = keyframes({
    '0%': { opacity: 0, transform: 'translate(-50%, -48%) scale(.96)' },
    '100%': { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
  });
  
  const DialogOverlay = styled(Dialog.Overlay, {
    backgroundColor: blackA.blackA9,
    position: 'fixed',
    inset: 0,
    animation: `${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
  });
  
  const DialogContent = styled(Dialog.Content, {
    backgroundColor: 'white',
    borderRadius: 6,
    boxShadow: 'hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px',
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90vw',
    maxWidth: '450px',
    maxHeight: '85vh',
    padding: 25,
    animation: `${contentShow} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
    '&:focus': { outline: 'none' },
  });
  
  const DialogTitle = styled(Dialog.Title, {
    margin: 0,
    fontWeight: 500,
    color: mauve.mauve12,
    fontSize: 17,
  });
  
  const DialogDescription = styled(Dialog.Description, {
    margin: '10px 0 20px',
    color: mauve.mauve11,
    fontSize: 15,
    lineHeight: 1.5,
  });

const RightSlot = styled('div', {
  marginLeft: 'auto',
  paddingLeft: 0,
  display: 'flex',
  color: violet.violet11,
  '[data-highlighted] > &': { color: 'white' },
  '[data-disabled] &': { color: violet.violet4 },
});

const LeftSlot = styled('div', {
    marginRight: 'auto',
    paddingRight: 0,
    display: 'flex',
    color: violet.violet11,
    '[data-highlighted] > &': { color: 'white' },
    '[data-disabled] &': { color: violet.violet4 },
  });
  
  const Flex = styled('div', { display: 'flex' });
  
  const Button = styled('button', {
    all: 'unset',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    padding: '0 15px',
    fontSize: 15,
    lineHeight: 1,
    fontWeight: 500,
    height: 35,
  
    variants: {
      variant: {
        violet: {
          backgroundColor: 'white',
          color: violet.violet11,
          boxShadow: `0 2px 10px ${blackA.blackA7}`,
          '&:hover': { backgroundColor: mauve.mauve3 },
          '&:focus': { boxShadow: `0 0 0 2px black` },
        },
        green: {
          backgroundColor: green.green4,
          color: green.green11,
          '&:hover': { backgroundColor: green.green5 },
          '&:focus': { boxShadow: `0 0 0 2px ${green.green7}` },
        },
      },
    },
  
    defaultVariants: {
      variant: 'violet',
    },
  });
  
  const IconButton = styled('button', {
    all: 'unset',
    fontFamily: 'inherit',
    borderRadius: '100%',
    height: 25,
    width: 25,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: violet.violet11,
    position: 'absolute',
    top: 10,
    right: 10,
  
    '&:hover': { backgroundColor: violet.violet4 },
    '&:focus': { boxShadow: `0 0 0 2px ${violet.violet7}` },
  });
  
  const Fieldset = styled('fieldset', {
    all: 'unset',
    display: 'flex',
    gap: 20,
    alignItems: 'center',
    marginBottom: 15,
  });

  const Label = styled('label', {
    fontSize: 13,
    lineHeight: 1,
    marginBottom: 10,
    color: violet.violet12,
    display: 'block',
  });
  
  const Input = styled('input', {
    all: 'unset',
    width: '100%',
    flex: '1',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    padding: '0 10px',
    fontSize: 15,
    lineHeight: 1,
    color: violet.violet11,
    boxShadow: `0 0 0 1px ${violet.violet7}`,
    height: 35,
  
    '&:focus': { boxShadow: `0 0 0 2px ${violet.violet8}` },
  });


  const SliderMain = ({value, max, onChangeFunction}) => (
    <form>
      <SliderRoot min={0} value={[value]} max={max} step={0.1} onValueChange={(event)=>onChangeFunction(event)} aria-label="Volume">
        <SliderTrack>
          <SliderRange />
        </SliderTrack>
        <SliderThumb />
      </SliderRoot>
    </form>
  );
  
  const SliderRoot = styled(Slider.Root, {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    userSelect: 'none',
    touchAction: 'none',
    width: 200,
  
    '&[data-orientation="horizontal"]': {
      height: 20,
    },
  
    '&[data-orientation="vertical"]': {
      flexDirection: 'column',
      width: 20,
      height: 100,
    },
  });
  
  const SliderTrack = styled(Slider.Track, {
    backgroundColor: blackA.blackA10,
    position: 'relative',
    flexGrow: 1,
    borderRadius: '9999px',
  
    '&[data-orientation="horizontal"]': { height: 3 },
    '&[data-orientation="vertical"]': { width: 3 },
  });
  
  const SliderRange = styled(Slider.Range, {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: '9999px',
    height: '100%',
  });
  
  const SliderThumb = styled(Slider.Thumb, {
    display: 'block',
    width: 20,
    height: 20,
    backgroundColor: 'white',
    boxShadow: `0 2px 10px ${blackA.blackA7}`,
    borderRadius: 10,
    '&:hover': { backgroundColor: violet.violet3 },
    '&:focus': { outline: 'none', boxShadow: `0 0 0 5px ${blackA.blackA8}` },
  });
import { CHAINS, DEFAULT_NETWORK_URI, DEFAULT_TOKEN_URI } from '../ether/chains'
import React, { useMemo } from 'react';
import * as Select from '@radix-ui/react-select';
import { styled } from '@stitches/react';
import { violet, mauve, blackA } from '@radix-ui/colors';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import { toHex } from '../ether/utils';
import {Text} from './ui/Text';
import TokenIcon from './TokenIcon';

const switchEthereumChain = async (chainId) => {
    var chain = CHAINS[chainId];
    //console.log(chain)
    //console.log(chainId)
    //console.log(toHex(chainId))
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: toHex(chainId) }],
      });
    } catch (e) {
      if (e.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: toHex(chainId),
                chainName: chain.name,
                nativeCurrency: {
                  name: chain.nativeCurrency.name,
                  symbol: chain.nativeCurrency.symbol, // 2-6 characters long
                  decimals: chain.nativeCurrency.decimals,
                },
                blockExplorerUrls: chain.blockExplorerUrls,
                rpcUrls: chain.urls,
              },
            ],
          });
        } catch (addError) {
          console.error(addError);
        }
      }
      // console.error(e)
    }
  }


export default ({chainId}) => {
    const current = useMemo(() => CHAINS[chainId], [chainId]);
    return (
            <Select.Root 
                value={current.name}
                onValueChange={async (value) => {
                    var { id } = Object?.values(CHAINS).find((chain) => chain.name === value);
                    await switchEthereumChain(id);
                }}
            >
              <SelectTrigger aria-label="Chain">
                  <Select.Value><Text>{current.name}</Text></Select.Value>
                  <TokenIcon uri={current.networkImg ?? DEFAULT_NETWORK_URI} />
                <SelectIcon>
                  <ChevronDownIcon />
                </SelectIcon>
              </SelectTrigger>
              <Select.Portal>
                <SelectContent>
                  <SelectScrollUpButton>
                    <ChevronUpIcon />
                  </SelectScrollUpButton>
                  <SelectViewport>
                    <Select.Group>
                      <SelectLabel>Networks</SelectLabel>
                        {Object?.values(CHAINS).map((chain) => (
                            <SelectItem value={chain.name}>{chain.name}</SelectItem>
                        ))}
                    </Select.Group>
          
                  </SelectViewport>
                  <SelectScrollDownButton>
                    <ChevronDownIcon />
                  </SelectScrollDownButton>
                </SelectContent>
              </Select.Portal>
            </Select.Root>
        )
};

const SelectTrigger = styled(Select.SelectTrigger, {
  all: 'unset',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 4,
  padding: '0 15px',
  fontSize: 13,
  lineHeight: 1,
  height: 35,
  display: 'flex',
  flexDirection: 'row',
  gap: 5,
  backgroundColor: 'white',
  color: violet.violet11,
  //boxShadow: `0 2px 10px ${blackA.blackA7}`,
  '&:hover': { backgroundColor: mauve.mauve3 },
  //'&:focus': { boxShadow: `0 0 0 2px black` },
  '&[data-placeholder]': { color: violet.violet9 },
});

const SelectIcon = styled(Select.SelectIcon, {
  color: violet.violet11,
});

const SelectContent = styled(Select.Content, {
  overflow: 'hidden',
  backgroundColor: 'white',
  borderRadius: 6,
  boxShadow:
    '0px 10px 38px -10px rgba(22, 23, 24, 0.35), 0px 10px 20px -15px rgba(22, 23, 24, 0.2)',
});

const SelectViewport = styled(Select.Viewport, {
  padding: 5,
});

const SelectItem = React.forwardRef(({ children, ...props }, forwardedRef) => {
  return (
    <StyledItem {...props} ref={forwardedRef}>
      <Select.ItemText>{children}</Select.ItemText>
      <StyledItemIndicator>
        <CheckIcon />
      </StyledItemIndicator>
    </StyledItem>
  );
});

const SelectValue = styled(Select.Value, {
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'row',
});

const StyledItem = styled(Select.Item, {
  fontSize: 13,
  lineHeight: 1,
  color: violet.violet11,
  borderRadius: 3,
  display: 'flex',
  alignItems: 'center',
  height: 25,
  padding: '0 35px 0 25px',
  position: 'relative',
  userSelect: 'none',

  '&[data-disabled]': {
    color: mauve.mauve8,
    pointerEvents: 'none',
  },

  '&[data-highlighted]': {
    outline: 'none',
    backgroundColor: violet.violet9,
    color: violet.violet1,
  },
});

const SelectLabel = styled(Select.Label, {
  padding: '0 25px',
  fontSize: 12,
  lineHeight: '25px',
  color: mauve.mauve11,
});

const SelectSeparator = styled(Select.Separator, {
  height: 1,
  backgroundColor: violet.violet6,
  margin: 5,
});

const StyledItemIndicator = styled(Select.ItemIndicator, {
  position: 'absolute',
  left: 0,
  width: 25,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const scrollButtonStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 25,
  backgroundColor: 'white',
  color: violet.violet11,
  cursor: 'default',
};

const SelectScrollUpButton = styled(Select.ScrollUpButton, scrollButtonStyles);

const SelectScrollDownButton = styled(Select.ScrollDownButton, scrollButtonStyles);

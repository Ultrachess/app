//create a modal that takes in a trigger element and renders a modal with a form to create a bot
//then makes a CREATE_BOT action to the backend
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
import Button from './ui/Button';
import Flex from './ui/Flex';

export default ({triggerElement}) => {
    const [selectedFile, setSelectedFile] = useState<File>();
    const addAction = useActionCreator();

    const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]);
        }
    }

    const handleSubmission = async () => {
        let file = selectedFile;
        var binary = new Uint8Array(await file.arrayBuffer());
        await addAction({
            type: TransactionType.DEPLOY_BOT_INPUT,
            binary: binary,
            name: "test",
        })
    }

    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                {triggerElement}
            </Dialog.Trigger>
            <Dialog.Portal>
                <DialogOverlay />
                <DialogContent>
                    <DialogTitle>Upload bot bytecode</DialogTitle>
                    <DialogDescription>
                        Upload a file containing the bytecode of your bot. 
                        The bytecode you upload must be compiled to RISCV and be a UCI compliant chess engine
                    </DialogDescription>
                    <Fieldset>
                        <Label>Drag and drop your RISC-V executable</Label>
                        <FileUploadBlock>
                            {selectedFile ? selectedFile.name : 'Upload file'}
                            <input style={{display: 'none'}} type="file" name="file" onChange={changeHandler}/>
                        </FileUploadBlock>
                    </Fieldset>

                    <Flex css={{ marginTop: 25, justifyContent: 'flex-end' }}>
                        <Dialog.Close asChild>
                            <Button 
                                disabled={!selectedFile}
                                variant={'mauve'}
                                onClick={handleSubmission}
                            >
                                Submit
                            </Button>
                        </Dialog.Close>
                    </Flex>
                    <Dialog.Close asChild>
                        <IconButton>
                        <Cross2Icon />
                        </IconButton>
                    </Dialog.Close>
                </DialogContent>
            </Dialog.Portal>
        </Dialog.Root>
    )
}

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

const Label = styled('label', {
    fontSize: 13,
    lineHeight: 1,
    marginBottom: 10,
    color: violet.violet12,
    display: 'block',
  });

const overlayShow = keyframes({
    '0%': { opacity: 0 },
    '100%': { opacity: 1 },
  });

  const contentShow = keyframes({
    '0%': { opacity: 0, transform: 'translate(-50%, -48%) scale(.96)' },
    '100%': { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
  });
  

const Fieldset = styled('fieldset', {
    all: 'unset',
    display: 'flex',
    gap: 20,
    alignItems: 'center',
    marginBottom: 15,
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

const FileUploadBlock = styled('input', {
    display: 'block',
    border: `2px white dashed`,
    color: 'white',
    borderRadius: 4,
    fontSize: 15,
    userSelect: 'none',
    padding: '45px 0',
    width: 300,
    textAlign: 'center',
  });






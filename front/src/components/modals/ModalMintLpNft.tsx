import { blackA, green, mauve, violet } from "@radix-ui/colors";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { keyframes, styled } from "@stitches/react";
import { useWeb3React } from "@web3-react/core";
import { useState } from "react";

import { TransactionType } from "../../common/types";
import { CHAINS } from "../../ether/chains";
import { USDC_ADDRESS_ON_NETWORKS } from "../../ether/chains";
import { CONTRACTS } from "../../ether/contracts";
import { useTokenFromList } from "../../hooks/token";
import { useActionCreator } from "../../state/game/hooks";
import AssetDisplay from "./../AssetDisplay";

export default ({ triggerElement }) => {
  const { chainId, account } = useWeb3React();
  const [amount, setAmount] = useState(0);
  const token = useTokenFromList(USDC_ADDRESS_ON_NETWORKS[chainId]);

  const addAction = useActionCreator();

  const handleDeposit = async () => {
    console.log(`Approving amount ${amount} tokenAddress ${token.address}`);

    // Get network name
    const CHAIN = CHAINS[chainId];
    const networkName =
      CHAIN && CHAIN.networkName ? CHAIN.networkName : "localhost";

    // Fetch abi list
    const contracts = CONTRACTS[networkName];
    const abis =
      contracts && contracts.InputFacet && contracts.ERC20PortalFacet
        ? contracts
        : CONTRACTS.localhost;

    const [, wait] = await addAction({
      type: TransactionType.APPROVE_ERC20,
      tokenAddress: token.address,
      spender: abis.UniV3Staker.address,
      amount: amount.toString(),
    });
    await wait;

    console.log(
      `Minting LP NFT with amount ${amount} tokenAddress ${token.address}`
    );
    const [, wait2] = await addAction({
      type: TransactionType.MINT_LP_NFT,
      stableAddress: token.address,
      stableAmount: amount.toString(),
    });
    await wait2;
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{triggerElement}</Dialog.Trigger>
      <Dialog.Portal>
        <DialogOverlay />
        <DialogContent>
          <DialogTitle>Mint LP NFT</DialogTitle>
          <DialogDescription>
            Mint an LP NFT and deposit stablecoins.
          </DialogDescription>

          <Fieldset>
            <Label>Amount</Label>
            <RightSlot>
              <AssetDisplay tokenAddress={token?.address} balance={amount} />
            </RightSlot>
          </Fieldset>
          <Fieldset>
            <Input
              id="amount"
              value={amount}
              defaultValue={0}
              onChange={(event) => {
                setAmount(parseInt(event.target.value || "0"));
              }}
            ></Input>
          </Fieldset>
          <Flex css={{ marginTop: 25, justifyContent: "flex-end" }}>
            <Dialog.Close asChild>
              <Button variant="green" onClick={handleDeposit}>
                Deposit
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
  );
};

const overlayShow = keyframes({
  "0%": { opacity: 0 },
  "100%": { opacity: 1 },
});

const contentShow = keyframes({
  "0%": { opacity: 0, transform: "translate(-50%, -48%) scale(.96)" },
  "100%": { opacity: 1, transform: "translate(-50%, -50%) scale(1)" },
});

const DialogOverlay = styled(Dialog.Overlay, {
  backgroundColor: blackA.blackA9,
  position: "fixed",
  inset: 0,
  animation: `${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
});

const DialogContent = styled(Dialog.Content, {
  backgroundColor: "white",
  borderRadius: 6,
  boxShadow:
    "hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px",
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90vw",
  maxWidth: "450px",
  maxHeight: "85vh",
  padding: 25,
  animation: `${contentShow} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
  "&:focus": { outline: "none" },
});

const DialogTitle = styled(Dialog.Title, {
  margin: 0,
  fontWeight: 500,
  color: mauve.mauve12,
  fontSize: 17,
});

const DialogDescription = styled(Dialog.Description, {
  margin: "10px 0 20px",
  color: mauve.mauve11,
  fontSize: 15,
  lineHeight: 1.5,
});

const RightSlot = styled("div", {
  marginLeft: "auto",
  paddingLeft: 0,
  display: "flex",
  color: violet.violet11,
  "[data-highlighted] > &": { color: "white" },
  "[data-disabled] &": { color: violet.violet4 },
});

const Flex = styled("div", { display: "flex" });

const Button = styled("button", {
  all: "unset",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 4,
  padding: "0 15px",
  fontSize: 15,
  lineHeight: 1,
  fontWeight: 500,
  height: 35,

  variants: {
    variant: {
      violet: {
        backgroundColor: "white",
        color: violet.violet11,
        boxShadow: `0 2px 10px ${blackA.blackA7}`,
        "&:hover": { backgroundColor: mauve.mauve3 },
        "&:focus": { boxShadow: `0 0 0 2px black` },
      },
      green: {
        backgroundColor: green.green4,
        color: green.green11,
        "&:hover": { backgroundColor: green.green5 },
        "&:focus": { boxShadow: `0 0 0 2px ${green.green7}` },
      },
    },
  },

  defaultVariants: {
    variant: "violet",
  },
});

const IconButton = styled("button", {
  all: "unset",
  fontFamily: "inherit",
  borderRadius: "100%",
  height: 25,
  width: 25,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  color: violet.violet11,
  position: "absolute",
  top: 10,
  right: 10,

  "&:hover": { backgroundColor: violet.violet4 },
  "&:focus": { boxShadow: `0 0 0 2px ${violet.violet7}` },
});

const Fieldset = styled("fieldset", {
  all: "unset",
  display: "flex",
  gap: 20,
  alignItems: "center",
  marginBottom: 15,
});

const Label = styled("label", {
  fontSize: 13,
  lineHeight: 1,
  marginBottom: 10,
  color: violet.violet12,
  display: "block",
});

const Input = styled("input", {
  all: "unset",
  width: "100%",
  flex: "1",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 4,
  padding: "0 10px",
  fontSize: 15,
  lineHeight: 1,
  color: violet.violet11,
  boxShadow: `0 0 0 1px ${violet.violet7}`,
  height: 35,

  "&:focus": { boxShadow: `0 0 0 2px ${violet.violet8}` },
});

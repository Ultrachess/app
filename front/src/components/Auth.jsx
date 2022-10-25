import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, useModal, Modal, Text, Row } from "@nextui-org/react";
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
          {lastStepTimestamp == 0 ? 
            <Row><Text className="smallText" css={{
              textGradient: "45deg, $blue600 -20%, $pink600 50%",
          }}>waiting on cycle update</Text></Row> :
            <Text className="smallText" css={{
              textGradient: "45deg, $blue600 -20%, $pink600 50%",
          }}>cycle: {Math.max(Math.round((now/1000)-lastStepTimestamp), 0)} secs ago</Text>
          }
          <AssetDisplay/>
          <Button shadow icon={<FaUser/>} flat color="primary" auto onClick={() => metaMask.deactivate()}>
            {truncateAddress( accounts[0])}
          </Button>
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
                console.log("metamask")
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
/*
 * Copyright (C) 2022-2023 Ultrachess team
 * This file is part of Ultrachess - https://github.com/Ultrachess/app
 *
 * SPDX-License-Identifier: Apache-2.0
 * See the file LICENSE for more information.
 */

import * as React from "react";
import { Text, Modal, Input, Row, Button } from "@nextui-org/react";
import { useDispatch } from "react-redux";
import { FaCoins } from "react-icons/fa";
import { useActionCreator } from "../../state/game/hooks";
import { TransactionType } from "../../common/types";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import Select from "react-select";
import { useTokenList } from "../../hooks/token";

export default ({ visible, closeHandler }) => {
  const dispatch = useDispatch();
  const addAction = useActionCreator();
  const navigate = useNavigate();
  const [wagerValue, setWagerValue] = React.useState(0);
  const [tokenAddress, setTokenAddress] = React.useState(0);
  const [betDuration, setBetDuration] = React.useState(0);
  const tokenList = useTokenList();
  //get showCreateGameModal from state
  const showCreateGameModal = useSelector(
    (state) => state.ui.showCreateGameModal
  );

  const tokens = tokenList.map((token) => {
    return {
      value: token.address,
      label: token.name,
    };
  });

  const onWagerValueChange = (event) => setWagerValue(event.target.value);
  const onTokenAddressChange = (newValue) => setTokenAddress(newValue.value);
  const onBetDurationChange = (event) => setBetDuration(event.target.value);
  const handleCreateGame = async () => {
    //dispatch(createGame(tokenAddress, wagerValue))
    const [action, wait] = await addAction({
      type: TransactionType.CREATE_GAME_INPUT,
      name: "default",
      isBot: false,
      wagerTokenAddress: tokenAddress,
      wagerAmount: ethers.utils.parseUnits("0"),
      bettingDuration: betDuration,
    });
    const roomId = await wait;
    //console.log("jumping to" + roomId)
    if (roomId) navigate(`game/${roomId}`, { replace: true });
  };

  const jumpToGame = () => {
    var roomId = "ZAKNPJ1XQ5";
    navigate(`game/${roomId}`, { replace: true });
  };

  return (
    <Modal
      closeButton
      aria-labelledby="modal-title"
      open={visible}
      onClose={closeHandler}
    >
      <Modal.Header>
        <Text id="modal-title" size={18}>
          Create your game
        </Text>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Input
            clearable
            bordered
            fullWidth
            color="primary"
            size="lg"
            placeholder="Wager amount"
            contentLeft={<FaCoins />}
            onChange={onWagerValueChange}
          />
          <Select options={tokens} onChange={onTokenAddressChange} />
        </Row>
        <Input
          clearable
          bordered
          fullWidth
          color="primary"
          size="lg"
          placeholder="Betting duration in seconds"
          contentLeft={<FaCoins />}
          onChange={onBetDurationChange}
        />
        <Row justify="space-between">
          <Text size={14}>Need Help?</Text>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button auto onClick={handleCreateGame}>
          Create
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

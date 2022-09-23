import { Button, Card, Input, Row, Text } from '@nextui-org/react';
import { TransactionTypes } from 'ethers/lib/utils';
import React, { useState } from 'react';
import { FaRobot } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { TransactionType } from '../common/types';
import { sendBinary, depositErc20 } from '../state/game/gameSlice';
import { useActionCreator } from '../state/game/hooks';

export default () => {
    const [selectedFile, setSelectedFile] = useState();
    const dispatch = useDispatch()
	const addAction = useActionCreator()

	const changeHandler = (event) => {
		setSelectedFile(event.target.files[0]);
	};

	const handleSubmission = async () => {
        let file = selectedFile;
        var binary = new Uint8Array(await file.arrayBuffer())
		var n = await addAction({
			type: TransactionType.DEPLOY_BOT_INPUT,
			binary
		})
	};

	const handleStep = async () => {
		var n = await addAction({
			type: TransactionType.BOT_STEP,
			hash: "hello"
		})
	};

	return(
        <Row justify='center'>
			<input type="file" name="file" onChange={changeHandler} />
			<Button color="gradient" onClick={handleSubmission}  iconRight={<FaRobot/>} shadow>
				Submit
			</Button>
			<Button color="gradient" onClick={handleStep}  iconRight={<FaRobot/>} shadow>
				Run step
			</Button>
		</Row>
		
	)
}
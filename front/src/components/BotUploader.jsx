import { Button, Card, Input, Row, Text } from '@nextui-org/react';
import React, { useState } from 'react';
import { FaRobot } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { sendBinary, depositErc20 } from '../store/game/gameSlice';

export default () => {
    const [selectedFile, setSelectedFile] = useState();
    const dispatch = useDispatch()

	const changeHandler = (event) => {
		setSelectedFile(event.target.files[0]);
	};

	const handleSubmission = async () => {
        let file = selectedFile;
        var binary = new Uint8Array(await file.arrayBuffer())
        dispatch(sendBinary(binary))
	};

	return(
        <Row justify='center'>
			<input type="file" name="file" onChange={changeHandler} />
			<Button color="gradient" onClick={handleSubmission}  iconRight={<FaRobot/>} shadow>
				Submit
			</Button>
		</Row>
	)
}
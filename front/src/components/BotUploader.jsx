import { Button, Card, Input, Row, Text } from '@nextui-org/react';
import React, { useState } from 'react';
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

	const handleDeposit = async () => {
		dispatch(depositErc20())
	};

	return(
        <div>
			<Card>
                <Card.Header>
                    <Row justify="center">
                        <Text>Upload your bot code.</Text>
                    </Row>
                </Card.Header>

				<Card.Body>
					<input type="file" name="file" onChange={changeHandler} />
					<div>
						<Button color="gradient" onClick={handleSubmission} shadow>
							Submit
						</Button>
						<Button color="gradient" onClick={handleDeposit} shadow>
							Deposit 100
						</Button>
					</div>
				</Card.Body>
			</Card>   
		</div>
	)
}
import * as React from "react";
import { Text, Grid, Card, Divider, Row, Button } from "@nextui-org/react";
import { Chessboard } from "react-chessboard";
import UserItem from "./UserItem";
export default (props) => {
  const [mainItems, setMainItems] = React.useState([]);
  return (
    <Card css={{ mw: "334px" }} shadow={false} bordered={true}>
        <Card.Header>
            
        </Card.Header>
        <Card.Body css={{ py: "$3", px: "$-4" }}>
        <Chessboard 
            boardWidth={330}
        />
        </Card.Body>
        <Card.Footer css={{ py: "$3", px: "$2" }}>
            <Row justify="flex-center">
                <UserItem white={false}/>
                <Text color="red">VS</Text>
                <UserItem white={true}/>
            </Row>
        </Card.Footer>
    </Card>
  );
}

{/* <Table.Row key={item.id}>
<Table.Cell><Link to={"game/" + item.id}>{item.id}</Link></Table.Cell>
<Table.Cell>{item.players}</Table.Cell>
<Table.Cell>blitz</Table.Cell>
<Table.Cell>
    <Chessboard 
        id={item.id}
        position={item.fen}
        boardWidth={150}
    />
</Table.Cell>
</Table.Row> */}

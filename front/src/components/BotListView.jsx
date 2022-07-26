import * as React from "react";
import { Text, Grid, Table, Row, Button, Card,  } from "@nextui-org/react";
import { truncateAddress, formatDate } from "../ether/utils";
import Address from "./Address";
import ModalChallengeBot from "./ModalChallengeBot";

export default ({bots}) => {
    const [createMatchModalVisible, setCreateMatchModalVisible] = React.useState(false)
    const [selectedBot, setSelectedBot] = React.useState()
    
    const columns = [
        {
          key: "botId",
          label: "BOT ID",
        },
        {
          key: "ownerId",
          label: "OWNER ID",
        },
        {
            key: "createdAt",
            label: "CREATED AT"
        },
        {
            key: "challenge",
            label: "",
        }
    ];

    const rows = Object.values(bots).map((bot, index) => {
        var ownerId = truncateAddress(bot.ownerId ?? "not defined")
        var botId = bot.id ?? "not defined"
        var date  = new Date(bot.timestamp * 1000)
        
        return {
            key: index,
            ownerId: ownerId,
            botId: botId,
            createdAt: formatDate(date)
        }
    })

    const handleChallenge = (botId) => {
        setSelectedBot(botId)
        setCreateMatchModalVisible(true)
    }   
    const handleCloseCreateModal = () => {setCreateMatchModalVisible(false)}

    return (
        <div>
            <ModalChallengeBot
                visible={createMatchModalVisible}
                botId = {selectedBot}
                closeHandler = {handleCloseCreateModal}
            />    
            <Table
                aria-label="Example table with dynamic content"
                css={{
                    height: "auto",
                    minWidth: "100%",
                    overflow: "hidden"
                }}
                shadow={false}
                >
                    <Table.Header columns={columns}>
                        {(column) => (
                            <Table.Column key={column.key}>{column.label}</Table.Column>
                        )}
                    </Table.Header>
                    <Table.Body items={rows}>
                        {(item) => (
                            <Table.Row key={item.key}>
                                {(columnKey) => <Table.Cell>{ 
                                    columnKey == "ownerId" ? <Address value={item[columnKey]}/> :
                                    columnKey == "challenge" ? <Button onClick={()=>handleChallenge(item.botId)} color="primary">challenge</Button> : item[columnKey] }</Table.Cell>}
                            </Table.Row>
                        )}
                    </Table.Body>
            </Table>
        </div>
        
    );
}
import * as React from "react";
import { Text, Grid, Table, Row, Button, Card,  } from "@nextui-org/react";
import { truncateAddress, formatDate } from "../ether/utils";
import Address from "./Address";
import ModalChallengeBot from "./ModalChallengeBot";
import ModalManageBot from "./ModalManageBot";
import { useWeb3React } from "@web3-react/core";

export default ({bots}) => {
    const [createMatchModalVisible, setCreateMatchModalVisible] = React.useState(false)
    const [manageBotModalVisible, setManageBotModalVisible] = React.useState(false)
    const [selectedBot, setSelectedBot] = React.useState()
    const { account } = useWeb3React()
    console.log(account)

    const columns = [
        {
          key: "botId",
          label: "BOT ID",
        },
        {
          key: "ownerId",
          label: "OWNER ADDRESS",
        },
        {
            key: "createdAt",
            label: "CREATED AT"
        },
        {
            key: "challenge",
            label: "",
        },
        {
            key: "manage",
            label: "",
        }
    ];

    const rows = Object.values(bots).map((bot, index) => {
        var ownerId = bot.owner ?? "not defined"
        var botId = bot.id ?? "not defined"
        var date  = new Date(bot.timestamp * 1000)

        console.log(ownerId)
        
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
    
    const handleManage = (botId) => {
        setSelectedBot(botId)
        setManageBotModalVisible(true)
    }
    const handleCloseCreateModal = () => {setCreateMatchModalVisible(false)}
    const handleCloseManageModal = () => {setManageBotModalVisible(false)}


    return (
        <div>
            <ModalChallengeBot
                visible={createMatchModalVisible}
                botId = {selectedBot}
                closeHandler = {handleCloseCreateModal}
            />    
            <ModalManageBot
                visible={manageBotModalVisible}
                botId = {selectedBot}
                closeHandler = {handleCloseManageModal}
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
                                    columnKey == "botId" ? <Address value={item[columnKey]}/> :
                                    columnKey == "ownerId" ? <Address value={item[columnKey]}/> :
                                    columnKey == "challenge" ? <Button onClick={()=>handleChallenge(item.botId)} color="primary">challenge</Button> :
                                    columnKey == "manage" ? account?.toLowerCase() == item.ownerId.toLowerCase() ? <Button onClick={()=>handleManage(item.botId)}>manage</Button> : <Text>not your bot</Text>
                                    : item[columnKey] }</Table.Cell>}
                            </Table.Row>
                        )}
                    </Table.Body>
            </Table>
        </div>
        
    );
}
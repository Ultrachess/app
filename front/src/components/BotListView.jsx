import * as React from "react";
import { Text, Grid, Table, Row } from "@nextui-org/react";
import { truncateAddress } from "../ether/utils";
export default ({bots}) => {
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
            key: "created",
            label: "CREATED",
        }
    ];

    const rows = bots.map((bot, index) => {
        var ownerId = truncateAddress(bot.ownerId ?? "not defined")
        var botId = bot.botId ?? "not defined"
        var date  = new Date(bot.timestamp * 1000)
        var hours = date.getHours() %12;
        var minutes = "0" + date.getMinutes();
        var seconds = "0" + date.getSeconds();
        var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
        return {
            key: index,
            ownerId: ownerId,
            botId: botId,
            created: formattedTime
        }
    })

    return (
        <div>
            <Text h3>Bot list</Text>
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
                            {(columnKey) => <Table.Cell>{item[columnKey]}</Table.Cell>}
                        </Table.Row>
                    )}
                </Table.Body>
            </Table>
        </div>
        
    );
}

//create a react component that will display the statistics of the bot moves
//takes in BotMoveStats interface as a prop

import React from 'react';
import { BotMoveStats } from '../state/game/types';
import Flex from './ui/Flex'
import { Text } from './ui/Text'
import Separator from './ui/Separator'

interface BotMoveStatisticsViewProps {
    botMoveStat: BotMoveStats;
    flexDir?: 'row' | 'column';
}

export default ({ botMoveStat, flexDir = 'row' }: BotMoveStatisticsViewProps) => {
    if (!botMoveStat) {
        botMoveStat = {
            depth: 0,
            seldepth: 0,
            time: 0,
            nodes: 0,
            pv: ['0'],
            score: 0,
            nps: 0,
            tbhits: 0,
            sbhits: 0,
            cpuload: 0,
        }

    }
    const {
        depth,
        seldepth, 
        time,
        nodes,
        pv,
        score,
        nps,
        tbhits,
        sbhits,
        cpuload,
    } = botMoveStat;

    return (
        <Flex css={{ 
            gap: 2,
            flexDirection: flexDir, 
            alignItems: 'center', 
            justifyContent: 'space-between' ,
            width: "100%"
        }}>
            <Flex css={{gap:1, flexDirection:'column'}}>
                <Text bold>Depth</Text>
                <Text>{depth}</Text>
            </Flex>
            <Flex css={{gap:1, flexDirection:'column'}}>
                <Text bold>Seldepth</Text>
                <Text>{seldepth}</Text>
            </Flex>
            <Flex css={{gap:1, flexDirection:'column'}}>
                <Text bold>Time</Text>
                <Text>{time}</Text>
            </Flex>
            <Flex css={{gap:1, flexDirection:'column'}}>
                <Text bold>Nodes</Text>
                <Text>{nodes}</Text>
            </Flex>
            <Flex css={{gap:1, flexDirection:'column'}}>
                <Text bold>Pv</Text>
                <Text>{pv[0]}</Text>
            </Flex>
            <Flex css={{gap:1, flexDirection:'column'}}>
                <Text bold>Score</Text>
                <Text>{score}</Text>
            </Flex>
            <Flex css={{gap:1, flexDirection:'column'}}>
                <Text bold>Nps</Text>
                <Text>{nps}</Text>
            </Flex>
            <Flex css={{gap:1, flexDirection:'column'}}>
                <Text bold>Tbhits</Text>
                <Text>{tbhits}</Text>
            </Flex>
            <Flex css={{gap:1, flexDirection:'column'}}>
                <Text bold>Sbhits</Text>
                <Text>{sbhits}</Text>
            </Flex>
            <Flex css={{gap:1, flexDirection:'column'}}>
                <Text bold>Cpuload</Text>
                <Text>{cpuload}</Text>
            </Flex>
        </Flex>
    );
};

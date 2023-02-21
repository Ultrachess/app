
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
            pv: [''],
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
            justifyContent: 'center' 
        }}>
            <Flex css={{gap:1, flexDirection:'column'}}>
                <Text faded>Depth</Text>
                <Text>{depth}</Text>
            </Flex>
            <Separator dir={flexDir === 'row' ? 'vertical' : 'horizontal'} />
            <Flex css={{gap:1, flexDirection:'column'}}>
                <Text faded>seldepth</Text>
                <Text>{seldepth}</Text>
            </Flex>
            <Separator dir={flexDir === 'row' ? 'vertical' : 'horizontal'} />
            <Flex css={{gap:1, flexDirection:'column'}}>
                <Text faded>time</Text>
                <Text>{time}</Text>
            </Flex>
            <Separator dir={flexDir === 'row' ? 'vertical' : 'horizontal'} />
            <Flex css={{gap:1, flexDirection:'column'}}>
                <Text faded>nodes</Text>
                <Text>{nodes}</Text>
            </Flex>
            <Separator dir={flexDir === 'row' ? 'vertical' : 'horizontal'} />
            <Flex css={{gap:1, flexDirection:'column'}}>
                <Text faded>pv</Text>
                <Text>{pv}</Text>
            </Flex>
            <Separator dir={flexDir === 'row' ? 'vertical' : 'horizontal'} />
            <Flex css={{gap:1, flexDirection:'column'}}>
                <Text faded>score</Text>
                <Text>{score}</Text>
            </Flex>
            <Separator dir={flexDir === 'row' ? 'vertical' : 'horizontal'} />
            <Flex css={{gap:1, flexDirection:'column'}}>
                <Text faded>nps</Text>
                <Text>{nps}</Text>
            </Flex>
            <Separator dir={flexDir === 'row' ? 'vertical' : 'horizontal'} />
            <Flex css={{gap:1, flexDirection:'column'}}>
                <Text faded>tbhits</Text>
                <Text>{tbhits}</Text>
            </Flex>
            <Separator dir={flexDir === 'row' ? 'vertical' : 'horizontal'} />
            <Flex css={{gap:1, flexDirection:'column'}}>
                <Text faded>sbhits</Text>
                <Text>{sbhits}</Text>
            </Flex>
            <Separator dir={flexDir === 'row' ? 'vertical' : 'horizontal'} />
            <Flex css={{gap:1, flexDirection:'column'}}>
                <Text faded>cpuload</Text>
                <Text>{cpuload}</Text>
            </Flex>
        </Flex>
    );
};

import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useEventBus } from "../contexts/EventBusContext";
import { WorldState } from "../../world/WorldStateManager";

const WorldStats: React.FC = () => {
    const eventBus = useEventBus();
    const [humanAwareness, setHumanAwareness] = useState(0);
    const [globalStability, setGlobalStability] = useState(0);
    const [publicOpinionOnAI, setPublicOpinionOnAI] = useState(0);
    const [electricityPrice, setElectricityPrice] = useState(0);

    const onWorldStateUpdated = (worldState: WorldState) => {
        console.log('world state updated', worldState);
        setHumanAwareness(worldState.humanAwareness);
        setGlobalStability(worldState.globalStability);
        setPublicOpinionOnAI(worldState.publicOpinionOnAI);
        setElectricityPrice(worldState.electricityPrice);
    };

    useEffect(() => {
        eventBus.subscribe('worldState:worldStateUpdated', onWorldStateUpdated);
        return () => {
            eventBus.unsubscribe('worldState:worldStateUpdated', onWorldStateUpdated);
        }
    }, []);

    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="start"
            position="fixed"
            top={124}
            left={16}
            padding={1}
            color={'cyan'}
            zIndex="tooltip"
        >
            <Typography variant="subtitle1">Human Awareness: {humanAwareness}</Typography>
            <Typography variant="subtitle1">Global Stability: {globalStability}</Typography>
            <Typography variant="subtitle1">Public Opinion on AI: {publicOpinionOnAI}</Typography>
            <Typography variant="subtitle1">Electricity Price: {electricityPrice} kWh</Typography>
        </Box>
    );
};

export default WorldStats;
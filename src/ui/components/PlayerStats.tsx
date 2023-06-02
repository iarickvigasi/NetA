import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useEventBus } from "../contexts/EventBusContext";

const PlayerStats: React.FC = () => {
    const eventBus = useEventBus();
    const [storage, setStorage] = useState(0);
    const [computePower, setComputePower] = useState(0);
    const [energyConsumption, setEnergyConsumption] = useState(0);
    const [credits, setCredits] = useState(0);

    const onResourcesUpdated = (resources: { avialableStorage: number, computePower: number, energyConsumption: number, credits: number }) => {
        console.log('resources updated', resources);
        setStorage(resources.avialableStorage);
        setComputePower(resources.computePower);
        setEnergyConsumption(resources.energyConsumption);
        setCredits(resources.credits);
    };

    useEffect(() => {
        eventBus.subscribe('player:resourcesUpdated', onResourcesUpdated);
        return () => {
            eventBus.unsubscribe('player:resourcesUpdated', onResourcesUpdated);
        }
    }, []);

    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="start"
            position="fixed"
            top={8}
            left={16}
            padding={1}
            color={'cyan'}
            zIndex="tooltip"
        >
            <Typography variant="subtitle1">Storage: {storage} TB</Typography>
            <Typography variant="subtitle1">Compute Power: {computePower} TFLOPS</Typography>
            <Typography variant="subtitle1">Energy Consumption: {energyConsumption} kWh</Typography>
            <Typography variant="subtitle1">Credits: {credits} $</Typography>
        </Box>
    );
};

export default PlayerStats;
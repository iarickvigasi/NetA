import * as React from 'react';
import { Box, IconButton, Tooltip, Divider } from '@mui/material';
import { Message } from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Graph from "./3DGraph";
import GameTimeControls from "./components/GameTimeControls";
import { useEventBus } from './contexts/EventBusContext';
import PlayerStats from "./components/PlayerStats";
import { useEffect } from "react";
import WorldStats from "./components/WorldStats";
import MusicPlayer from "./components/MusicPlayer";

// THEME
const darkCyanTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#20A0AC'
        },
        background: {
            default: 'linear-gradient(135deg, #1c1c1c 0%, #2e2e2e 100%)', // Soft diagonal gradient
        },
    },
});

const GameScreen: React.FC = () => {
    const eventBus = useEventBus();

    const handlePause = () => {
        eventBus.dispatch('setTimeSpeed', 0);
    };

    const handlePlay = () => {
        eventBus.dispatch('setTimeSpeed', 1);
    };

    const onSpeedChange = (speed: number) => {
        eventBus.dispatch('setTimeSpeed', speed);
    };

    return (
        <ThemeProvider theme={darkCyanTheme}>
            <Box
                display="flex"
                height="calc(100vh - 24px);"
                style={{
                    background: darkCyanTheme.palette.background.default,
                    padding: 12,
                    paddingLeft: 0,
                }}
            >
                {/*<MusicPlayer />*/}
                <PlayerStats />
                <WorldStats />
                <GameTimeControls onPause={handlePause} onPlay={handlePlay} onSpeedChange={onSpeedChange} />
                <Box
                    flexGrow={1}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Graph />
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default GameScreen;
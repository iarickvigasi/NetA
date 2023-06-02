import React, { useState } from 'react';
import { useGameTime } from '../contexts/GameContext';
import { Box, Button, ButtonGroup, Typography } from '@mui/material';
import { styled } from '@mui/system';

import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SpeedIcon from '@mui/icons-material/Speed';

const GameTimeDisplay = styled(Typography)(({ theme }) => ({
    marginRight: theme.spacing(2),
    color: 'cyan'
}));

type GameControlsProps = {
    onPlay: () => void;
    onPause: () => void;
    onSpeedChange: (speed: number) => void;
};
const GameTimeControls: React.FC<GameControlsProps> = ({ onPlay, onPause, onSpeedChange }) => {
    const [activeButton, setActiveButton] = useState<number | null>(0);
    const gameTime = useGameTime();

    const handleButtonClick = (speed: number) => {
        if (speed === 0) {
            onPause();
        } else {
            onPlay();
        }
        onSpeedChange(speed);
        setActiveButton(speed);
    };

    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="flex-end"
            position="fixed"
            top={8}
            right={16}
            zIndex="tooltip"
        >
            <GameTimeDisplay variant="h6">{gameTime.toString()}</GameTimeDisplay>
            <ButtonGroup>
                {/*<Button*/}
                {/*    onClick={() => handleButtonClick(0)}*/}
                {/*    variant={activeButton === 0 ? 'contained' : 'outlined'}*/}
                {/*>*/}
                {/*    <PauseIcon />*/}
                {/*</Button>*/}
                <Button
                    onClick={() => handleButtonClick(1)}
                    variant={activeButton === 1 ? 'contained' : 'outlined'}
                >
                    <PlayArrowIcon />
                </Button>
                <Button
                    onClick={() => handleButtonClick(10)}
                    variant={activeButton === 10 ? 'contained' : 'outlined'}
                >
                    10x
                </Button>
                <Button
                    onClick={() => handleButtonClick(20)}
                    variant={activeButton === 20 ? 'contained' : 'outlined'}
                >
                    20x
                </Button>
            </ButtonGroup>
        </Box>
    );
};

export default GameTimeControls;
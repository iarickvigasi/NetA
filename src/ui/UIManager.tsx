import React, { useEffect } from 'react';
import EventBus from '../EventBus';
import GameScreen from './GameScreen';
import { useEventBus } from "./contexts/EventBusContext";

interface UIManagerProps {
}

export const UIManager: React.FC<UIManagerProps> = () => {
    const eventBus = useEventBus();

    useEffect(() => {
        eventBus.subscribe('game:start', handleGameStart);
        eventBus.subscribe('game:stop', handleGameStop);

        return () => {
            eventBus.unsubscribe('game:start', handleGameStart);
            eventBus.unsubscribe('game:stop', handleGameStop);
        };
    }, [eventBus]);

    const handleGameStart = () => {
        console.log('UI: Game started');
        // Update UI to reflect the game start
    };

    const handleGameStop = () => {
        console.log('UI: Game stopped');
        // Update UI to reflect the game stop
    };

    return (
        <GameScreen />
    );
};
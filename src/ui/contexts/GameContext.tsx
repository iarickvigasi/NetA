import React, { useContext, useState, useEffect } from 'react';
import CoreGameEngine from "../../CoreGameEngine";
import Time from "../../world/Time"; // Import the Game class from your previous implementation

const GameContext = React.createContext<{ gameTime: Time | string | null, game: CoreGameEngine | null }>({ gameTime: null, game: null });

export const useGameTime = () => {
    const { gameTime } = useContext(GameContext);
    if (!gameTime) {
        throw new Error('useGameTime must be used within a GameProvider');
    }
    return gameTime;
};

export const useGame = () => {
    const { game } = useContext(GameContext);
    if (!game) {
        throw new Error('useGameTime must be used within a GameProvider');
    }
    return game;
};

export const GameProvider: React.FC<{ game: CoreGameEngine, children: React.ReactNode }> = ({ game, children }) => {
    const [gameTime, setGameTime] = useState(game.world.getGameTime().toString());

    useEffect(() => {
        // Subscribe to time updates from the event bus
        const onTimeUpdate = (newGameTime: Time) => {
            setGameTime(newGameTime.toString());
        };
        game.eventBus.subscribe('timeUpdate', onTimeUpdate);

        return () => {
            // Clean up the event listener on unmount
            game.eventBus.unsubscribe('timeUpdate', onTimeUpdate);
        };
    }, [game]);

    return <GameContext.Provider value={{ gameTime, game }}>{children}</GameContext.Provider>;
};
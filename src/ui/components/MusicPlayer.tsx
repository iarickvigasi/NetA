import React, { useState } from 'react';
import Button from '@mui/material/Button';
import MusicManager from "../../MusicManager";

export default function MusicPlayer() {
    const [musicManager, setMusicManager] = useState<MusicManager | null>(null);

    async function startMusic() {
        if (!musicManager) {
            const manager = new MusicManager();
            setMusicManager(manager);
            await manager.start();
        } else {
            console.log('Music is already playing');
        }
    }

    return (
        <div>
            <Button style={{
                position: 'fixed',
                top: 0,
                right: '200px',
            }}
                    variant="contained" color="primary" onClick={startMusic}>
                Music
            </Button>
        </div>
    );
}
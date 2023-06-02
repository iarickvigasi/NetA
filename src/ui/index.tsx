import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from '../reportWebVitals';
import { UIManager } from "./UIManager";
import { GameProvider } from './contexts/GameContext';
import { EventBusProvider } from './contexts/EventBusContext';
import CoreGameEngine from "../CoreGameEngine";

export default function renderUI(game: CoreGameEngine) {
    const root = ReactDOM.createRoot(
        document.getElementById('root') as HTMLElement
    );

    root.render(
        <React.StrictMode>
            <EventBusProvider eventBus={game.eventBus}>
                <GameProvider game={game}>
                    <UIManager />
                </GameProvider>
            </EventBusProvider>
        </React.StrictMode>
    );
}


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

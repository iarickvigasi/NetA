import React, { useContext } from 'react';
import EventBus from '../../EventBus';

const EventBusContext = React.createContext<EventBus | null>(null);

export const useEventBus = (): EventBus => {
    const eventBus = useContext(EventBusContext);
    if (!eventBus) {
        throw new Error('useEventBus must be used within an EventBusProvider');
    }
    return eventBus;
};

interface EventBusProviderProps {
    eventBus: EventBus;
    children: any
}

export const EventBusProvider: React.FC<EventBusProviderProps> = ({ eventBus, children }) => {
    return <EventBusContext.Provider value={eventBus}>{children}</EventBusContext.Provider>;
};
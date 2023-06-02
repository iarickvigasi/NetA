class EventBus {
    private listeners: { [event: string]: Function[] } = {};

    private logEvent(eventName: string, action: string): void {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] Event: "${eventName}" | Action: "${action}"`);
    }

    public subscribe(event: string, callback: Function): void {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
        this.logEvent(event, "subscribed");
    }

    public unsubscribe(event: string, callback: Function): void {
        if (this.listeners[event]) {
            this.listeners[event] = this.listeners[event].filter((listener) => listener !== callback);
            this.logEvent(event, "unsubscribed");
        }
    }

    public dispatch(event: string, ...args: any[]): void {
        if (event !== 'timeUpdate') {
            this.logEvent(event, "dispatched");
        }
        if (this.listeners[event]) {
            this.listeners[event].forEach((callback) => callback(...args));
        }
    }
}

export default EventBus;
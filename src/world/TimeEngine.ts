import Time from "./Time";
import EventBus from "../EventBus";

export default class TimeEngine {

    private eventBus: EventBus;
    private gameTime: Time;
    private timeSetting: number;
    private intervalId: NodeJS.Timer | null;

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;
        this.gameTime = new Time();
        this.timeSetting = 1;
        this.intervalId = null;

        this.initialize();
    }

    initialize(): void {
        this.eventBus.subscribe('setTimeSpeed', this.setTimeSetting);
    }

    start(): void {
        if (this.intervalId !== null) {
            console.warn('Game is already running.');
            return;
        }

        const updateInterval = 1000; // Real-time milliseconds between updates

        this.intervalId = setInterval(() => {
            this.update(updateInterval);
        }, updateInterval);
    }

    stop(): void {
        if (this.intervalId === null) {
            console.warn('Game is not running.');
            return;
        }

        clearInterval(this.intervalId);
        this.intervalId = null;
    }

    private update(elapsedTime: number): void {
        const gameMinutesPerRealSecond = 1 * this.timeSetting; // Adjust this value to change the base game speed
        const gameMinutesElapsed = (elapsedTime / 1000) * gameMinutesPerRealSecond;
        this.gameTime.increment(gameMinutesElapsed);

        this.eventBus.dispatch('timeUpdate', this.gameTime);
        // Update game world, render, etc.
        console.log(this.gameTime.toString());
    }

    setTimeSetting = (setting: number): void => {
        console.log('Setting time speed to ' + setting + 'x.')
        this.timeSetting = setting;
    }

    getGameTime(): Time {
        return this.gameTime;
    }
}
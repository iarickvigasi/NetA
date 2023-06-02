export default class Time {
    private _day: number;
    private _hour: number;
    private _minute: number;

    constructor(day: number = 1, hour: number = 0, minute: number = 0) {
        this._day = day;
        this._hour = hour;
        this._minute = minute;
    }

    get day(): number {
        return this._day;
    }

    get hour(): number {
        return this._hour;
    }

    get minute(): number {
        return this._minute;
    }

    increment(minutes: number): void {
        this._minute += minutes;

        while (this._minute >= 60) {
            this._minute -= 60;
            this._hour++;
        }

        while (this._hour >= 24) {
            this._hour -= 24;
            this._day++;
        }
    }

    toString(): string {
        return `Day ${this._day}, ${this._hour.toString().padStart(2, '0')}:${this._minute.toString().padStart(2, '0')}`;
    }
}
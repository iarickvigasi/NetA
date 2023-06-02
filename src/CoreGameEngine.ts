import EventBus from './EventBus';
import renderUI from "./ui";
import WorldManager from "./world/WorldManager";
import MusicManager from "./MusicManager";
export default class CoreGameEngine {
    public eventBus: EventBus;
    public world: WorldManager;

    public musicManager: MusicManager;
    constructor() {
        this.eventBus = new EventBus();
        this.world = new WorldManager(this.eventBus);

        this.musicManager = new MusicManager();

        this.initialize();
    }

    private initialize(): void {
        this.eventBus.subscribe('game:start', this.startGame);
        this.eventBus.subscribe('game:stop', this.stopGame);

        renderUI(this);
        setTimeout(() => {
            this.musicManager.start()
        }, 10000)
    }

    private startGame = (): void => {
        console.log('Starting game...');
    }

    private stopGame = (): void => {
        console.log('Stopping game...');
    }
}
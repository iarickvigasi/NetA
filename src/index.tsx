import CoreGameEngine from './CoreGameEngine';

const gameEngine = new CoreGameEngine();

gameEngine.eventBus.dispatch('game:start');
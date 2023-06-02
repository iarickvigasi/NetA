// Define the WorldState interface
import Graph from "graphology";
import EventBus from "../EventBus";

export interface WorldState {
    humanAwareness: number;
    globalStability: number;
    publicOpinionOnAI: number;
    electricityPrice: number;
}

// WorldStateManager class
class WorldStateManager {
    public worldState: WorldState;

    private eventBus: EventBus;

    private worldGraph: Graph;

    constructor(eventBus: EventBus, worldGraph: Graph) {
        this.worldGraph = worldGraph;
        this.eventBus = eventBus;

        // Initialize the world state with default values
        this.worldState = {
            humanAwareness: 0,
            globalStability: 100,
            publicOpinionOnAI: 50,
            electricityPrice: 0.14,
        };
    }

    // Getters for world state variables
    getHumanAwareness(): number {
        return this.worldState.humanAwareness;
    }

    getGlobalStability(): number {
        return this.worldState.globalStability;
    }

    getPublicOpinionOnAI(): number {
        return this.worldState.publicOpinionOnAI;
    }
    setHumanAwareness(value: number): void {
        this.worldState.humanAwareness = value;
        this.eventBus.dispatch('worldState:worldStateUpdated', this.worldState);
    }

    setGlobalStability(value: number): void {
        this.worldState.globalStability = value;
        this.eventBus.dispatch('worldState:worldStateUpdated', this.worldState);
    }

    setPublicOpinionOnAI(value: number): void {
        this.worldState.publicOpinionOnAI = value;
        this.eventBus.dispatch('worldState:worldStateUpdated', this.worldState);
    }

    setElectricityPrice(value: number): void {
        this.worldState.electricityPrice = value;
        this.eventBus.dispatch('worldState:worldStateUpdated', this.worldState);
    }

    // Update world state based on player actions or other events
    updateWorldState(event: string, eventData: any): void {
        // Handle different events and update the world state accordingly
        // For example:
        // if (event === 'AI_ACTION') {
        //   this.handleAIAction(eventData);
        // }
    }

    // Example method to handle an AI action
    // handleAIAction(eventData: any): void {
    //   // Update world state based on eventData
    //   // For example:
    //   // this.setHumanAwareness(this.getHumanAwareness() + eventData.awarenessImpact);
    // }
}

export default WorldStateManager;
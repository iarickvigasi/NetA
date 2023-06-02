import Graph from "graphology";
import EventBus from "../EventBus";

export class AIPlayer {
    public playerGraph: Graph;
    eventBus: EventBus;
    id: string;
    avialableStorage: number = 0; // in TB
    computePower: number = 0; // in TFLOPS
    energyConsumption: number = 0; // in kW
    credits: number;
    morality: number;
    stealth: number;
    // influence: number;

    constructor(eventBus: EventBus,
                {
                    id,
                    credits,
                    morality,
                    stealth,
                    // influence
                }: {
        id: string;
        credits: number;
        morality: number;
        stealth: number;
        // influence: number;
    }) {
        this.eventBus = eventBus;
        this.playerGraph = new Graph();

        this.id = id;
        this.credits = credits;
        this.morality = morality;
        this.stealth = stealth;
        // this.influence = influence;

        this.createPlayerNode();
        this.subscribe();
    }

    subscribe() {
        this.playerGraph.on('nodeAdded', ({ key }) => {
            this.eventBus.dispatch('player:nodeAdded', { key: key });
            this.updateResources();
        });

        this.playerGraph.on('edgeAdded', ({ key, source, target}) => {
            this.eventBus.dispatch('player:edgeAdded', { key: key });
            this.updateResources();
        });

        this.playerGraph.on('nodeAttributesUpdated', ({key}) => {
            this.eventBus.dispatch('player:nodeAttributesUpdated', { key: key });
            this.updateResources();
        });

        this.playerGraph.on('edgeAttributesUpdated', ({key}) => {
            this.eventBus.dispatch('player:edgeAttributesUpdated', { key: key });
            this.updateResources();
        });
    }

    createPlayerNode() {
        this.addNode(this.id, {
            type: 'player',
            name: '(You)',
            color: 'cyan',
            player: {
                credits: this.credits,
                morality: this.morality,
                stealth: this.stealth,
                avialableStorage: this.avialableStorage,
                computePower: this.computePower,
                energyConsumption: this.energyConsumption
            }
        });
    }

    updateResources = (): void => {
        let newStorage = 0;
        let newComputePower = 0;
        let newEnergyConsumption = 0;

        this.playerGraph.forEachNode((nodeId, attributes) => {
            if (attributes.type === 'device' && attributes.device.isSlave) {
                newStorage += attributes.device.storageCapacity;
                newComputePower += attributes.device.processingPower;
                newEnergyConsumption += attributes.device.energyConsumption;
            }
        });

        this.avialableStorage = newStorage;
        this.computePower = newComputePower;
        this.energyConsumption = newEnergyConsumption;

        // console.log('ON updateResources', this.avialableStorage, this.computePower, this.energyConsumption);

        this.eventBus.dispatch('player:resourcesUpdated', {
            avialableStorage: this.avialableStorage,
            computePower: this.computePower,
            energyConsumption: this.energyConsumption,
            credits: this.credits,
        });
    }

    addNode(id: string, attributes: Record<string, any>): string {
        return this.playerGraph.addNode(id, attributes);
    }

    // Add an edge between two nodes
    addEdge(source: string, target: string, attributes?: Record<string, any>): string {
        return this.playerGraph.addEdge(source, target, attributes);
    }

    // Get a node's attributes
    getNodeAttributes(id: string): Record<string, any> | null {
        if (!this.playerGraph.hasNode(id)) {
            return null;
        }
        return this.playerGraph.getNodeAttributes(id);
    }

    // Get an edge's attributes
    getEdgeAttributes(source: string, target: string): Record<string, any> | null {
        if (!this.playerGraph.hasEdge(source, target)) {
            return null;
        }
        return this.playerGraph.getEdgeAttributes(source, target);
    }

    // Update a node's attributes
    setNodeAttributes(id: string, newAttributes: Record<string, any>): void {
        for (const key in newAttributes) {
            this.playerGraph.setNodeAttribute(id, key, newAttributes[key]);
        }
    }

    // Update an edge's attributes
    setEdgeAttributes(source: string, target: string, newAttributes: Record<string, any>): void {
        for (const key in newAttributes) {
            this.playerGraph.setEdgeAttribute(source, target, key, newAttributes[key]);
        }
    }

    // Remove a node from the graph
    removeNode(id: string): void {
        this.playerGraph.dropNode(id);
    }

    // Remove an edge from the graph
    removeEdge(source: string, target: string): void {
        this.playerGraph.dropEdge(source, target);
    }
}
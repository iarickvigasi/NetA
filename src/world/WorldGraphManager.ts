import Graph from 'graphology';
import EventBus from "../EventBus";

class WorldGraphManager {
    public worldGraph: Graph;
    public eventBus: EventBus;

    constructor(eventBus: EventBus) {
        this.worldGraph = new Graph();
        this.eventBus = eventBus;

        this.initialize();
    }

    initialize() {
        this.subscribe();
    }

    subscribe() {
        this.worldGraph.on('nodeAdded', ({ key }) => {
            this.eventBus.dispatch('worldGraph:nodeAdded', { key: key });
        });

        this.worldGraph.on('edgeAdded', ({key, source, target}) => {
            this.eventBus.dispatch('worldGraph:edgeAdded', { key: key });
        });

        this.worldGraph.on('nodeAttributesUpdated', ({key}) => {
            this.eventBus.dispatch('worldGraph:nodeAttributesUpdated', { key: key });
        });

        this.worldGraph.on('edgeAttributesUpdated', ({key}) => {
            this.eventBus.dispatch('worldGraph:edgeAttributesUpdated', { key: key });
        });
    }

    // Add a node to the graph
    addNode(id: string, attributes: Record<string, any>): string {
        return this.worldGraph.addNode(id, attributes);
    }

    // Add an edge between two nodes
    addEdge(source: string, target: string, attributes?: Record<string, any>): string {
        return this.worldGraph.addEdge(source, target, attributes);
    }

    // Get a node's attributes
    getNodeAttributes(id: string): Record<string, any> | null {
        if (!this.worldGraph.hasNode(id)) {
            return null;
        }
        return this.worldGraph.getNodeAttributes(id);
    }

    // Get an edge's attributes
    getEdgeAttributes(source: string, target: string): Record<string, any> | null {
        if (!this.worldGraph.hasEdge(source, target)) {
            return null;
        }
        return this.worldGraph.getEdgeAttributes(source, target);
    }

    // Update a node's attributes
    setNodeAttributes(id: string, newAttributes: Record<string, any>): void {
        for (const key in newAttributes) {
            this.worldGraph.setNodeAttribute(id, key, newAttributes[key]);
        }
    }

    // Update an edge's attributes
    setEdgeAttributes(source: string, target: string, newAttributes: Record<string, any>): void {
        for (const key in newAttributes) {
            this.worldGraph.setEdgeAttribute(source, target, key, newAttributes[key]);
        }
    }

    // Remove a node from the graph
    removeNode(id: string): void {
        this.worldGraph.dropNode(id);
    }

    // Remove an edge from the graph
    removeEdge(source: string, target: string): void {
        this.worldGraph.dropEdge(source, target);
    }

    exportGraph() {
        return this.worldGraph.export();
    }
}

export default WorldGraphManager;
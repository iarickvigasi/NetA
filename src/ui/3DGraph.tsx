import * as React from 'react';
import { useEffect, useRef, useState } from "react";
import { default as GGraph } from 'graphology';
import ForceGraph3D, { GraphData } from 'react-force-graph-3d';
import { useGame } from "./contexts/GameContext";
// @ts-ignore
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { NodeDetailsPanel } from "./components/NodeDetailsPanel";
import { useEventBus } from "./contexts/EventBusContext";

function convertGraphologyToForceGraphData(graph: GGraph): GraphData {
    const nodes: any[] = [];
    const links: any[] = [];

    graph.forEachNode((node: any, attributes: any) => {
        let additionalAttributes:any = {
            name: attributes.name || (attributes.type && attributes[attributes.type].name ) || attributes.id || node,
        };

        if (attributes.type) {
            switch (attributes.type) {
                case 'bot':
                    additionalAttributes['color'] = 'red';
                    break;
                case 'player':
                    additionalAttributes['color'] = 'cyan';
                    break;
                case 'device':
                    additionalAttributes['color'] = 'green';
                    break;
                case 'human':
                    additionalAttributes['color'] = 'blue';
                    break;
            }
        }
        nodes.push({ id: node, ...attributes, ...additionalAttributes });
    });

    graph.forEachEdge((edge: any, attributes: any, source: any, target: any) => {
        links.push({ source, target, ...attributes });
    });

    return { nodes, links };
}

const Graph: React.FC = () => {
    const game = useGame();
    const eventBus = useEventBus();

    const graph = game.world.player?.playerGraph;

    const [selectedNode, setSelectedNode] = useState<any>(null);
    const [graphData, setGraphData] = useState<GraphData>( convertGraphologyToForceGraphData(graph!));

    const onGraphUpdate = () => {
        const graph = game.world.player?.playerGraph;
        const graphData = convertGraphologyToForceGraphData(graph!);
        setGraphData(graphData);
        console.log('Graphs', graph, graphData)
    }

    useEffect(() => {

        eventBus.subscribe('player:nodeAdded', onGraphUpdate);
        eventBus.subscribe('player:graphUpdated', onGraphUpdate);
        eventBus.subscribe('player:edgeAdded', onGraphUpdate);

        return () => {
            eventBus.unsubscribe('player:nodeAdded', onGraphUpdate);
            eventBus.unsubscribe('player:graphUpdated', onGraphUpdate);
            eventBus.unsubscribe('player:edgeAdded', onGraphUpdate);
        }
    }, []);

    const fgRef = useRef();

    useEffect(() => {
        if (fgRef.current === undefined) return;
        const bloomPass = new UnrealBloomPass();
        bloomPass.strength = 1;
        bloomPass.radius = 1;
        bloomPass.threshold = 0.1;
        // @ts-ignore
        fgRef.current.postProcessingComposer().addPass(bloomPass);
    }, []);

    return (
        <>
            <ForceGraph3D
                ref={fgRef}
                graphData={graphData}
                linkLabel={'type'}
                linkDirectionalArrowLength={3.5}
                linkDirectionalArrowRelPos={1}
                linkCurvature={0.25}

                onNodeClick={(node) => {
                    setSelectedNode(node);
                }}
            />
            <NodeDetailsPanel selectedNode={selectedNode} relations={[]} />
        </>
    );
};

export default Graph;
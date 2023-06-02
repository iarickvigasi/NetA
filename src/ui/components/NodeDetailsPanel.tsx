import React from 'react';
import {
    Box,
    Paper,
    Typography,
} from '@mui/material';
import CreateBotDialog from "./CreateBotDialog";
import ExpandablePanel from "./ExpandablePanel";
import BotActions from "./BotActions";

interface NodeDetailsPanelProps {
    selectedNode: any | null;
    relations: any[];
}

export const NodeDetailsPanel: React.FC<NodeDetailsPanelProps> = ({ selectedNode, relations }) => {

    if (!selectedNode) {
        return null;
    }

    // @ts-ignore
    const node = window.worldManager.player.getNodeAttributes(selectedNode.id);

    return (
        <Box
            position="absolute"
            paddingTop='54px'
            right={0}
            width="30%"
            height="90vh"
            maxHeight="90vh"
            display="flex"
            flexDirection="column"
            justifyContent="start"
            alignItems="center"
        >
            <Paper
                elevation={2}
                style={{
                    padding: '1rem',
                    margin: '1rem',
                    width: '90%',
                    overflowY: 'auto',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    maxHeight: '80%',
                    overflow: 'auto',
                }}
            >
                <Typography variant="h5" gutterBottom>
                    Node Details
                </Typography>
                <Typography variant="subtitle1">Node ID: {node.id}</Typography>
                <Typography variant="subtitle1">Name: {node.name}</Typography>
                <ExpandablePanel title={`Type: ${node.type}`} value={node[node.type]} />

                {relations.map((relation) => (
                    <Typography key={relation.id} variant="subtitle1">
                        {relation.type} - {relation.targetNode.type}:{' '}
                        {relation.targetNode.id}
                    </Typography>
                ))}

                {selectedNode.type === 'bot' && (
                    <>
                        <Typography
                            variant="h6"
                            gutterBottom
                            style={{ marginTop: '1rem' }}
                        >
                            Actions
                        </Typography>
                        <BotActions bot={selectedNode.bot} />
                    </>
                )}

                {selectedNode.type !== 'bot' && (
                    <>
                        <Typography
                            variant="h6"
                            gutterBottom
                            style={{ marginTop: '1rem' }}
                        >
                            Actions
                        </Typography>
                        <CreateBotDialog target={selectedNode} />
                    </>
                )}
            </Paper>
        </Box>
    );
};
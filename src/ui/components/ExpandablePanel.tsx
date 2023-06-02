import React, { useState } from 'react';
import {
    Box,
    Typography,
    ListItem,
    ListItemText,
    List,
    Collapse,
    IconButton,
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon } from '@mui/icons-material';

interface ExpandablePanelProps {
    title: string;
    value: any;
}

const BLACK_LIST = ['eventBus', 'worldGraph'];

const ExpandablePanel: React.FC<ExpandablePanelProps> = ({ title, value }) => {
    const [open, setOpen] = useState(false);

    if (BLACK_LIST.includes(title)) {
        return null;
    }
    const handleClick = () => {
        setOpen(!open);
    };

    const renderValue = (value: any) => {
        if (value === null) {
            return 'null';
        }
        if (Array.isArray(value)) {
            return (
                <List dense>
                    {value.map((item, index) => (
                        <ListItem key={index}>
                            {typeof item === 'object' ? (
                                <ExpandablePanel title={`Item ${index}`} value={item} />
                            ) : (
                                <ListItemText primary={JSON.stringify(item)} />
                            )}
                        </ListItem>
                    ))}
                </List>
            );
        } else if (typeof value === 'object') {
            return (
                <List dense>
                    {Object.keys(value).map((key) => (
                        <ListItem key={key}>
                            {typeof value[key] === 'object' ? (
                                <ExpandablePanel title={key} value={value[key]} />
                            ) : (
                                <ListItemText primary={`${key}: ${JSON.stringify(value[key])}`} />
                            )}
                        </ListItem>
                    ))}
                </List>
            );
        } else {
            return JSON.stringify(value);
        }
    };

    return (
        <Box>
            <Typography
                variant="subtitle1"
                onClick={handleClick}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                }}
            >
                {title}
                <IconButton
                    size="small"
                    onClick={handleClick}
                    sx={{
                        marginLeft: 'auto',
                    }}
                >
                    {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
            </Typography>
            <Collapse in={open}>{renderValue(value)}</Collapse>
        </Box>
    );
};

export default ExpandablePanel;

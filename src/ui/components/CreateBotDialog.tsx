import React, { useState } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from "@mui/material";
import { useEventBus } from "../contexts/EventBusContext";

const CreateBotDialog = ({ target } : { target?: any }) => {
    const [open, setOpen] = useState(false);
    // const [botType, setBotType] = useState("");
    const [botDescription, setBotDescription] = useState("");
    const eventBus = useEventBus();
    const handleClose = () => {
        setOpen(false);
    };

    const handleCreateBot = () => {
        // Logic for creating the bot goes here
        console.log("UI Creating bot:", { botDescription });
        eventBus.dispatch("ui:createBot", { target, botDescription });
        handleClose();
    };

    return (
        <>
            <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
                Create Bot
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Create a new bot</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        disabled
                        margin="normal"
                        label="Target"
                        value={target.name}
                    />

                    <TextField
                        fullWidth
                        margin="normal"
                        label="Task Description"
                        placeholder="Describe what you want this bot to achieve"
                        value={botDescription}
                        onChange={(e) => setBotDescription(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleCreateBot} disabled={!botDescription}>
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default CreateBotDialog;
import React from "react";
import {
    Button,
} from "@mui/material";
import { useEventBus } from "../contexts/EventBusContext";
import Bot from "../../enteties/Bot";

const BotActions = ({ bot } : { bot: Bot }) => {
    const eventBus = useEventBus();

    const handleExecution = () => {
        console.log("Execute bot task:", bot);
        eventBus.dispatch("ui:executeBotTask", { bot });
    };

    return (
        <>
            <Button variant="contained" color="primary" onClick={() => handleExecution()} disabled={bot.task.isExecuting || !bot.task.compilingResult?.isPossible}>
                Execute Task
            </Button>
        </>
    );
};

export default BotActions;
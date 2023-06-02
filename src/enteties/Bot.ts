import { Task, TaskCompilingResult } from "./common";

let id = 0;
function getUniqueBotId(): string {
    return id++ + '';
}

export default class Bot {
    id: string;
    task: Task;
    constructor ({ taskDescription, target } : { taskDescription: string, target: string }) {
        this.id = `bot_${getUniqueBotId()}`;

        this.task = {
            description: taskDescription,
            isCompleted: false,
            isExecuting: false,
            isCompiling: true,
            target: target,
            compilingResult: null,
        };
    }

    setCompilingResult(result: TaskCompilingResult) {
        this.task.compilingResult = result;
        this.task.isCompiling = false;
    }

    startExecuting() {
        this.task.isExecuting = true;
    }

    // Methods for handling different tasks depending on the bot type
}
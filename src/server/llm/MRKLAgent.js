const { ChatOpenAI } = require("langchain/chat_models");
const { initializeAgentExecutor } = require("langchain/agents");
const { Calculator } = require("langchain/tools");

const openAIApiKey = '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';
const run = async (input) => {
    const model = new ChatOpenAI({ openAIApiKey, temperature: 0 });
    const tools = [new Calculator()];

    const executor = await initializeAgentExecutor(
        tools,
        model,
        "chat-zero-shot-react-description"
    );
    console.log("Loaded agent.");

    console.log(`Executing with input "${input}"...`);

    const result = await executor.call({ input });

    console.log(`Got output ${result.output}`);

    console.log(
        `Got intermediate steps ${JSON.stringify(
            result.intermediateSteps,
            null,
            2
        )}`
    );

    return result;
};

module.exports = {
    run,
}
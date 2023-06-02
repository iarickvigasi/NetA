const { OpenAI } = require("langchain");
const { ChatOpenAI } = require("langchain/chat_models");
const { HumanChatMessage, SystemChatMessage } = require("langchain/schema");

const openAIApiKey = '';

const runLLM = async (input) => {
    // const model = new OpenAI({ openAIApiKey, topP: 0.2 });
    // const result = await model.call(input);
    const chat = new ChatOpenAI({ modelName: "gpt-3.5-turbo", temperature: 0.2, openAIApiKey, maxTokens: 2048 });
    console.log(`Executing with input "${input}"...`);

    const response = await chat.call([
        new SystemChatMessage(input),
        new HumanChatMessage("json:"),
    ]);

    console.log(`Got output ${response.text}`);

    return response;
};

module.exports = {
    runLLM,
}
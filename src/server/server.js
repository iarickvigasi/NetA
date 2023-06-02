const { runLLM } = require('./llm/LLMChain')

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.post('/llmChain', async (req, res) => {
    const inputString = req.body.input;

    if (!inputString) {
        return res.status(400).send({ error: 'Input string is required' });
    }

    const result = await runLLM(inputString);

    res.send({ result });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
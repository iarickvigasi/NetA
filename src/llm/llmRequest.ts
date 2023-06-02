
const SERVER_PORT = 3001
const llmRequest = async (inputString: string): Promise<any> => {
    try {
        const response = await fetch(`http://localhost:${SERVER_PORT}/llmChain`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ input: inputString }),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('mrklRequest Error:', error);
        return null;
    }
}

export default llmRequest;
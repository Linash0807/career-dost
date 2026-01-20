import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const chatWithAI = async (req, res) => {
    try {
        const { message, history } = req.body;

        if (!message) {
            return res.status(400).json({ message: 'Message is required.' });
        }

        if (!process.env.GEMINI_API_KEY) {
            console.warn('GEMINI_API_KEY is not set');
            // Fallback for when key is missing (so app doesn't crash)
            return res.json({
                response: "I'm ready to help, but my brain (API Key) is missing! Please configure the GEMINI_API_KEY in the backend."
            });
        }

        // For simplicity, we use the gemini-pro model
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // Construct chat history if provided, or start fresh
        // Note: Gemini API expects history in specific format { role: 'user'|'model', parts: string }
        const chat = model.startChat({
            history: history || [],
            generationConfig: {
                maxOutputTokens: 500,
            },
        });

        const result = await chat.sendMessage(message);
        const response = result.response;
        const text = response.text();

        res.json({ response: text });
    } catch (error) {
        console.error('Error in chatWithAI:', error);
        res.status(500).json({
            message: 'Failed to generate response',
            error: error.message
        });
    }
};

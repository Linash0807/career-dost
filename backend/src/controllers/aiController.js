import { GoogleGenerativeAI } from '@google/generative-ai';

export const chatWithAI = async (req, res) => {
    // Initialize Gemini API inside the handler to ensure process.env is loaded
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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

        // Use gemini-flash-latest model
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        // Construct chat history if provided, or start fresh
        const chat = model.startChat({
            history: history || [],
            generationConfig: {
                maxOutputTokens: 1000,
            },
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;

        // Handle potential blocking or empty response
        if (response.promptFeedback?.blockReason) {
            return res.status(400).json({
                message: 'Response was blocked by safety filters',
                reason: response.promptFeedback.blockReason
            });
        }

        const text = response.text();
        res.json({ response: text });
    } catch (error) {
        console.error('Error in chatWithAI:', error);

        // Provide more helpful error messages for common API issues
        let errorMessage = 'Failed to generate response';
        if (error.message?.includes('API key')) {
            errorMessage = 'Invalid or expired API key. Please check the backend configuration.';
        } else if (error.message?.includes('model not found')) {
            errorMessage = 'The AI model is currently unavailable. Please try again later.';
        }

        res.status(500).json({
            message: errorMessage,
            error: error.message
        });
    }
};

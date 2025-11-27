import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
    console.error("❌ VITE_GEMINI_API_KEY is missing in .env");
    process.exit(1);
}

async function listModels() {
    try {
        console.log("Fetching available models from v1 endpoint...");
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${API_KEY}`);

        if (!response.ok) {
            const err = await response.json();
            console.error("❌ Failed to list models:", err);
            return;
        }

        const data = await response.json();

        if (data.models) {
            console.log("✅ Available Models (v1):");
            data.models.forEach(m => {
                if (m.supportedGenerationMethods.includes("generateContent")) {
                    console.log(`- ${m.name.replace('models/', '')}`);
                }
            });
        } else {
            console.error("❌ No models found in response:", data);
        }

    } catch (error) {
        console.error("❌ Error:", error);
    }
}

listModels();

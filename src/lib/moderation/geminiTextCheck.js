export async function checkTextSafety(text) {
    const models = ["gemini-2.0-flash", "gemini-flash-latest", "gemini-1.5-flash"];

    for (const model of models) {
        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        contents: [
                            {
                                parts: [
                                    {
                                        text: `Check if this text is toxic, abusive, hateful, sexual, or unsafe. 
Return ONLY "safe" or "unsafe". Text: ${text}`
                                    }
                                ]
                            }
                        ]
                    }),
                }
            );

            if (!response.ok) {
                if (response.status === 404) {
                    console.warn(`Model ${model} not found, trying next...`);
                    continue;
                }
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();
            const aiOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

            if (aiOutput.toLowerCase().includes("unsafe")) {
                return { safe: false, reason: "Flagged by AI moderation" };
            }

            return { safe: true, reason: "" };

        } catch (err) {
            console.error(`Gemini Safety Check Error (${model}):`, err);
            // If it's the last model, return default safe
            if (model === models[models.length - 1]) {
                return { safe: true, reason: "AI failed, allowing temporarily" };
            }
        }
    }

    return { safe: true, reason: "AI failed, allowing temporarily" };
}

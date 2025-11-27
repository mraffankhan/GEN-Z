import { supabase } from "../../lib/supabase";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const MODEL_NAME = import.meta.env.VITE_GEMINI_MODEL || "gemini-2.5-flash";
const MODEL_ENDPOINT = `https://generativelanguage.googleapis.com/v1/models/${MODEL_NAME}:generateContent`;

/**
 * Verifies an ID card image using Gemini Vision via direct REST API.
 * @param {string} userId - The user's ID.
 * @param {string} base64Image - The base64 encoded image string.
 * @param {string} mimeType - The mime type of the image.
 */
export const verifyIDWithGemini = async (userId, base64Image, mimeType = "image/jpeg") => {
    console.log("🤖 Starting Privacy-First AI Verification for:", userId);

    if (!API_KEY) {
        console.error("❌ API Key missing");
        return { success: false, error: "API Key missing" };
    }

    try {
        // 1. Prepare Request Body
        const requestBody = {
            contents: [{
                parts: [
                    {
                        text: `You are an ID verification system for college students. Analyze this image.
Determine if it is a valid Student ID card.

Strictly check for:
- Presence of a photo
- Student details (Name, Course, etc.) - DO NOT EXTRACT THEM, just check they exist.
- College/University branding.
- Validity (not expired).

Return ONLY a JSON object with this exact structure:
{
  "is_student": true,
  "confidence": 85,
  "reason": "Clear ID card with visible student details and college logo."
}

Rules:
- "is_student": true ONLY if it looks like a real physical ID card.
- "confidence": 0-100.
- "reason": Short explanation.
- Do not include Markdown formatting (no \`\`\`json).` },
                    {
                        inline_data: {
                            mime_type: mimeType,
                            data: base64Image
                        }
                    }
                ]
            }],
            // generationConfig: {
            //     response_mime_type: "application/json"
            // }
        };

        // 2. Call Gemini API via fetch
        const response = await fetch(`${MODEL_ENDPOINT}?key=${API_KEY}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("❌ Gemini API Error:", errorData);
            throw new Error(errorData.error?.message || "Gemini API request failed");
        }

        const data = await response.json();
        console.log("🤖 Gemini Raw Response:", data);

        // 3. Parse Response
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) throw new Error("No response text from Gemini");

        let analysis;
        try {
            analysis = JSON.parse(text);
        } catch (e) {
            // Fallback cleanup if markdown is present despite instructions
            const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
            analysis = JSON.parse(cleanJson);
        }

        console.log("🤖 Parsed Analysis:", analysis);

        // 4. Determine Status
        const isApproved = analysis.is_student === true && analysis.confidence > 60;
        const newStatus = isApproved ? 'approved' : 'rejected';

        console.log(`🤖 Verification Status: ${newStatus}`);

        // 5. Update Supabase (ONLY Status, NO PII)
        const updateData = {
            verification_status: newStatus,
        };

        if (isApproved) {
            updateData.verified_at = new Date().toISOString();
        }

        // Try update with fallback for missing column
        try {
            const { error } = await supabase
                .from('profiles')
                .update(updateData)
                .eq('id', userId);

            if (error) throw error;
        } catch (err) {
            if (err.code === 'PGRST204' && updateData.verified_at) {
                console.warn("⚠️ 'verified_at' column missing. Retrying with only status...");
                delete updateData.verified_at;
                const { error: retryError } = await supabase
                    .from('profiles')
                    .update(updateData)
                    .eq('id', userId);

                if (retryError) throw retryError;
            } else {
                throw err;
            }
        }

        return { success: true, status: newStatus, analysis };

    } catch (error) {
        console.error("❌ AI Verification Failed:", error);
        return { success: false, error: error.message };
    }
};

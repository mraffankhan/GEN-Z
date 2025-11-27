import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "../../lib/supabase";

// Initialize Gemini
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * Verifies an ID card image using Gemini Vision.
 * @param {string} userId - The user's ID.
 * @param {string} imageUrl - The public URL of the uploaded ID image.
 */
export const verifyIDWithGemini = async (userId, imageUrl) => {
    console.log("🤖 Starting AI Verification for:", userId);

    try {
        // 1. Fetch the image
        const imageResp = await fetch(imageUrl);
        const imageBlob = await imageResp.blob();
        const base64Image = await blobToBase64(imageBlob);

        // 2. Prepare Gemini Request
        // Use gemini-1.5-flash for speed and vision capabilities
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
      You are an ID verification system for college students in India. Analyze this ID card image. 
      Determine if it is real or fake.  
      Extract: student name, college name, department, year.  
      If the card seems edited, blurred, photoshopped, or a screenshot, mark it unsafe.
      
      Return ONLY a JSON object with this exact structure:
      {
        "real": true, 
        "score": 85, 
        "name": "Extracted Name", 
        "college": "Extracted College", 
        "issues": ["List of issues if any"]
      }
      
      Rules:
      - Score 0-100 (100 is perfect real ID).
      - If "real" is false, score should be < 50.
      - If text is blurry or unreadable, mention it in issues.
      - Do not include Markdown formatting (no \`\`\`json).
    `;

        const imagePart = {
            inlineData: {
                data: base64Image,
                mimeType: imageBlob.type || "image/jpeg",
            },
        };

        // 3. Call Gemini
        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        const text = response.text();

        console.log("🤖 Gemini Raw Response:", text);

        // 4. Parse JSON
        const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const analysis = JSON.parse(cleanJson);

        console.log("🤖 Parsed Analysis:", analysis);

        // 5. Determine Status
        // Threshold: Score > 70 and Real = true
        const isApproved = analysis.real && analysis.score > 70;
        const newStatus = isApproved ? 'approved' : 'rejected';

        // 6. Update Supabase
        const { error } = await supabase
            .from('profiles')
            .update({
                verification_status: newStatus,
                ai_score: analysis.score,
                ai_name: analysis.name,
                ai_college: analysis.college,
                ai_issues: analysis.issues
            })
            .eq('id', userId);

        if (error) throw error;

        return { success: true, status: newStatus, analysis };

    } catch (error) {
        console.error("❌ AI Verification Failed:", error);
        // Fallback: Set to pending if AI crashes, so manual review can happen (or reject if strict)
        // For this MVP, we'll leave it as is or set to pending.
        return { success: false, error: error.message };
    }
};

// Helper to convert Blob to Base64
function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result.split(',')[1]; // Remove data:image/jpeg;base64,
            resolve(base64String);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

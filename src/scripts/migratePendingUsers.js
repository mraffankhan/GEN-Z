import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env vars
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const GEMINI_API_KEY = process.env.VITE_GEMINI_API_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY || !GEMINI_API_KEY) {
  console.error('❌ Missing environment variables.');
  console.error('URL:', SUPABASE_URL ? 'Set' : 'Missing');
  console.error('KEY:', SUPABASE_KEY ? 'Set' : 'Missing');
  console.error('GEMINI:', GEMINI_API_KEY ? 'Set' : 'Missing');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Using gemini-2.0-flash as it is reliable and supports vision
const MODEL_NAME = 'gemini-2.0-flash';

async function migrate() {
  console.log('🚀 Starting Migration: Verifying Pending Users...');

  // 1. Fetch pending users
  const { data: users, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('verification_status', 'pending');

  if (error) {
    console.error('❌ Error fetching users:', error);
    return;
  }

  console.log(`Found ${users.length} pending users.`);

  let approvedCount = 0;
  let rejectedCount = 0;
  let resubmitCount = 0;

  for (const user of users) {
    console.log(`\n--------------------------------------------------`);
    console.log(`Verifying user ${user.id}...`);

    if (!user.id_image_url) {
      console.log('⚠️ No ID Image URL found. Skipping.');
      continue;
    }

    try {
      // 2. Download Image
      // console.log(`Downloading ID: ${user.id_image_url}`);
      const imageResp = await fetch(user.id_image_url);
      if (!imageResp.ok) throw new Error(`Failed to fetch image: ${imageResp.statusText}`);

      const imageBlob = await imageResp.blob();
      const arrayBuffer = await imageBlob.arrayBuffer();
      const base64Image = Buffer.from(arrayBuffer).toString('base64');

      // 3. Call Gemini
      // console.log(`Sending to Gemini (${MODEL_NAME})...`);
      const model = genAI.getGenerativeModel({ model: MODEL_NAME });

      const prompt = `
        You are an ID verification system for Indian college students. 
        Analyze this ID card image. Determine if it is real or fake. 
        Extract: student name, college name, year, department. 
        Detect if the ID is edited, blurred, photoshopped, or a screenshot.
        
        Return ONLY a JSON object with this exact structure:
        {
          "real": true,
          "score": 85,
          "name": "Extracted Name",
          "college": "Extracted College",
          "issues": []
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
          mimeType: imageBlob.type || 'image/jpeg',
        },
      };

      const result = await model.generateContent([prompt, imagePart]);
      const response = await result.response;
      const text = response.text();

      // Parse JSON
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      let analysis;
      try {
        analysis = JSON.parse(cleanJson);
      } catch (e) {
        console.error('❌ Failed to parse Gemini JSON:', text);
        throw new Error('Invalid JSON from AI');
      }

      // 4. Logic
      let newStatus = 'rejected';
      if (analysis.score > 70 && (!analysis.issues || analysis.issues.length === 0)) {
        newStatus = 'approved';
        console.log(`Approved with score ${analysis.score}`);
      } else {
        console.log(`Rejected: issues [${analysis.issues?.join(', ') || 'Low Score'}]`);
      }

      // 5. Update Supabase
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          verification_status: newStatus,
          ai_score: analysis.score,
          ai_name: analysis.name,
          ai_college: analysis.college,
          ai_issues: analysis.issues
        })
        .eq('id', user.id);

      if (updateError) {
        console.error('❌ Failed to update Supabase:', updateError);
        resubmitCount++;
      } else {
        if (newStatus === 'approved') approvedCount++;
        else rejectedCount++;
      }

    } catch (err) {
      console.error('❌ Error processing user:', err.message);

      // Mark as needs_resubmit if API failed
      const { error: errorUpdate } = await supabase
        .from('profiles')
        .update({ verification_status: 'needs_resubmit' })
        .eq('id', user.id);

      if (errorUpdate) console.error('Failed to mark as needs_resubmit');

      resubmitCount++;
    }
  }

  console.log(`\n==================================================`);
  console.log(`Migration Complete.`);
  console.log(`Total Processed: ${users.length}`);
  console.log(`Approved: ${approvedCount}`);
  console.log(`Rejected: ${rejectedCount}`);
  console.log(`Errors/Resubmit: ${resubmitCount}`);
  console.log(`==================================================`);
}

migrate();

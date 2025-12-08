import { ChatGroq } from "@langchain/groq";
import { configDotenv } from "dotenv";

configDotenv();

/**
 * Groq API Service for AI-powered comment summarization
 * Uses Groq's LLaMA model via LangChain
 */

/**
 * Generate a summary of YouTube comments using Groq AI
 * @param {Array} comments - Array of comment objects with text, author, likeCount
 * @param {Object} videoInfo - Video metadata (title, channelTitle)
 * @returns {Promise<string>} - AI-generated summary
 */
export async function generateGrokSummary(comments, videoInfo = {}) {
  const apiKey = process.env.GROQ_API_KEY;
  
  // Check if API key is configured
  if (!apiKey || apiKey === 'your_groq_api_key_here') {
    throw new Error('Groq API key not configured');
  }

  try {
    // Prepare comment data for the prompt
    const totalComments = comments.length;
    const topComments = comments
      .sort((a, b) => b.likeCount - a.likeCount)
      .slice(0, 75); // Top 75 most liked comments

    // Create a concise representation of comments
    const commentTexts = topComments.map((c, idx) => 
      `${idx + 1}. "${c.text}" (${c.likeCount} likes)`
    ).join('\n');

    // Build the user prompt
    const userPrompt = `Analyze these YouTube comments for the video "${videoInfo.title || 'a video'}" by ${videoInfo.channelTitle || 'a creator'}.

Here are the top ${topComments.length} most-liked comments out of ${totalComments} total comments:

${commentTexts}

Please provide a concise, professional summary (2-3 sentences) that includes:
1. Overall sentiment (positive/negative/mixed)
2. Main themes or topics discussed
3. Key takeaways from viewer reactions

Keep it factual and insightful. Format the response as plain text without markdown.`;

    // Initialize Groq LLM
    const llm = new ChatGroq({
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      maxTokens: 300,
      maxRetries: 2,
    });

    // Call Groq API
    const aiMsg = await llm.invoke([
      {
        role: "system",
        content: "You are a helpful assistant that analyzes YouTube comments and provides concise, insightful summaries."
      },
      {
        role: "user",
        content: userPrompt
      }
    ]);

    // Extract the summary
    const summary = aiMsg.content?.trim();
    
    if (!summary) {
      throw new Error('No summary generated from Groq API');
    }

    console.log('✅ Groq AI summary generated successfully');
    return summary;

  } catch (error) {
    console.error('Groq API error:', error.message);
    
    // Throw error to allow fallback
    throw new Error(`Groq API failed: ${error.message}`);
  }
}

/**
 * Test the Groq API connection
 * @returns {Promise<boolean>} - True if API is working
 */
export async function testGrokConnection() {
  const apiKey = process.env.GROQ_API_KEY;
  
  if (!apiKey || apiKey === 'your_groq_api_key_here') {
    return false;
  }

  try {
    const llm = new ChatGroq({
      model: "llama-3.3-70b-versatile",
      temperature: 0,
      maxTokens: 10,
      maxRetries: 1,
    });

    const response = await llm.invoke([
      { role: 'user', content: 'Hello' }
    ]);

    return response && response.content;
  } catch (error) {
    console.error('Groq API test failed:', error.message);
    return false;
  }
}
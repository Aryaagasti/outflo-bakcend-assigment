const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config(); // Load environment variables from .env file
// Initialize Gemini API with the API key from environment variables
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error('GEMINI_API_KEY is not set in the environment variables');
}
const genAI = new GoogleGenerativeAI(apiKey);

// Function to generate a LinkedIn message based on profile data
exports.generateLinkedInMessage = async (profile) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' }); // Use the same model as in the curl command
    const prompt = `
      Generate a personalized LinkedIn outreach message for:
      Name: ${profile.name}
      Job Title: ${profile.job_title}
      Company: ${profile.company}
      Location: ${profile.location}
      Summary: ${profile.summary}
      
      The message should be professional, concise, and tailored to their profile.
    `;
    
    // Structure the content to match the curl command's payload
    const result = await model.generateContent({
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ]
    });
    
    // Access the generated text from the response
    const generatedText = result.response.text();
    return generatedText;
  } catch (error) {
    console.error('Error generating message:', error);
    throw new Error('Failed to generate message');
  }
};
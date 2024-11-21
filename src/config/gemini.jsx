import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const apiKey = "AIzaSyBrXB-sYiyHbjLvKd9lKJZhjwWCNJM-heM";
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

async function runChat(prompt) {
  try {
    // Create the chat session
    const chatSession = await model.startChat({
      generationConfig,
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_HIGH,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.ALLOW_MEDIUM,
        },
      ],

      history: [],
    });

  
    const result = await chatSession.sendMessage(prompt);
    const ResponseText=await result.response.text();
    
    return ResponseText;;

  } catch (error) {
    console.error("Error:", error);
    return "Sorry, something went wrong.";
  }
}

export default runChat;

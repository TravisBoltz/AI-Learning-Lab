import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

function IdeaGenerator() {
  const [userKeyword, setUserKeyword] = useState('');
  const [aiIdea, setAiIdea] = useState('Your AI idea will appear here!');
  const [isLoadingIdea, setIsLoadingIdea] = useState(false);

  // Get the Gemini API key from environment variables
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

  /**
   * Generates an AI idea using the Gemini API.
   */
  const generateAIIdea = async () => {
    // Validate API key
    if (!apiKey) {
      setAiIdea("Google API key not configured. Please check your environment variables.");
      return;
    }

    if (!userKeyword.trim()) {
      setAiIdea("Please enter a keyword to generate an idea!");
      return;
    }

    setIsLoadingIdea(true);
    setAiIdea(''); // Clear previous idea

    const prompt = `Generate a fun, creative, and slightly futuristic AI idea based on the keyword "${userKeyword}". Make it sound exciting and briefly explain what it does. Keep it to 1-2 sentences.`;

    let chatHistory = [];
    chatHistory.push({ role: "user", parts: [{ text: prompt }] });

    const payload = {
      contents: chatHistory,
      generationConfig: {
        temperature: 0.9,
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048,
      }
    };

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const result = await response.json();

      // Check for API errors
      if (result.error) {
        throw new Error(`API Error: ${result.error.message || 'Unknown error'}`);
      }

      if (result.candidates && result.candidates.length > 0 &&
        result.candidates[0].content && result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0) {
        const text = result.candidates[0].content.parts[0].text;
        setAiIdea(text);
      } else {
        setAiIdea("Could not generate an idea. Please try again!");
        console.error("Unexpected API response structure:", result);
      }
    } catch (error) {
      setAiIdea("Error generating idea. Please check your connection or try again later.");
      console.error("Error fetching AI idea:", error);
    } finally {
      setIsLoadingIdea(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-100 p-4">
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-4 text-purple-400">AI Idea Generator!</h1>
        <p className="text-lg mb-6 text-gray-300">Think of a word or a short phrase. What kind of AI would you create with it?</p>
        <input
          type="text"
          className="w-full p-3 rounded-lg bg-gray-700 text-white text-center text-xl mb-4 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="e.g., 'pets', 'homework', 'games'"
          value={userKeyword}
          onChange={(e) => setUserKeyword(e.target.value)}
          onKeyPress={(e) => { if (e.key === 'Enter') generateAIIdea(); }}
          disabled={isLoadingIdea}
        />
        <button
          onClick={generateAIIdea}
          className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-5 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
          disabled={isLoadingIdea}
        >
          Generate AI Idea!
        </button>
        <div className="bg-gray-700 p-4 rounded-lg text-gray-200 text-sm italic min-h-[120px] flex items-center justify-center mt-6">
          {isLoadingIdea ? (
            <div className="loading-spinner"></div>
          ) : (
            <ReactMarkdown>{aiIdea}</ReactMarkdown>
          )}
        </div>
      </div>
    </div>
  );
}

export default IdeaGenerator;

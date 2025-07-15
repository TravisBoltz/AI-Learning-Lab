import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

function WordScramble() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userGuess, setUserGuess] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [explanation, setExplanation] = useState('Explanation will appear here!');
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [currentScrambledWord, setCurrentScrambledWord] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [hintsUsed, setHintsUsed] = useState(0);

  const words = [
    { original: "ROBOT", scrambled: "BOTRO" },
    { original: "CHATBOT", scrambled: "TBOHACT" },
    { original: "ALGORITHM", scrambled: "MOLGIRATH" },
    { original: "LEARNING", scrambled: "NINGRAEL" },
    { original: "DATA", scrambled: "ATAD" },
    { original: "VISION", scrambled: "NOISIV" },
    { original: "LANGUAGE", scrambled: "GEGNALAU" },
    { original: "INTELLIGENCE", scrambled: "GENCELINTELI" },
    { original: "AUTOMATION", scrambled: "NOITAMOTUA" },
    { original: "PREDICT", scrambled: "TCDIERP" },
    { original: "COMPUTER", scrambled: "RETCOMPU" },
    { original: "ARTIFICIAL", scrambled: "LCAIFITRA" },
  ];

  // Get the Gemini API key from environment variables
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

  /**
   * Shuffles the characters of a string.
   * @param {string} word - The word to shuffle.
   * @returns {string} The shuffled word.
   */
  const shuffleWord = (word) => {
    let a = word.split("");
    let n = a.length;
    for (let i = n - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
    }
    return a.join("");
  };

  /**
   * Loads the current scrambled word.
   */
  const loadWord = () => {
    setIsLoading(true);
    if (currentWordIndex < words.length) {
      const wordData = words[currentWordIndex];
      let scrambled = shuffleWord(wordData.original.toUpperCase());
      while (scrambled === wordData.original.toUpperCase()) {
        scrambled = shuffleWord(wordData.original.toUpperCase());
      }
      // Update the scrambled word display with state
      setCurrentScrambledWord(scrambled);
      setUserGuess('');
      setFeedback('');
      setIsCorrect(false);
      setExplanation('Explanation will appear here!');
      setIsLoadingExplanation(false);
      setHintsUsed(0);
    } else {
      setFeedback("Great job unscrambling all the words!");
      setIsCorrect(true); // Use isCorrect for final message styling
      setExplanation(`You've mastered all the AI terms! Final score: ${score}`);
      setCurrentScrambledWord('');
    }
    setIsLoading(false);
  };

  // Effect to load word when index changes
  useEffect(() => {
    loadWord();
  }, [currentWordIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Checks the user's guess against the original word.
   */
  const checkGuess = () => {
    const userGuessUpper = userGuess.toUpperCase().trim();
    const originalWord = words[currentWordIndex].original.toUpperCase();

    if (userGuessUpper === originalWord) {
      const pointsEarned = Math.max(10 - hintsUsed * 2, 1); // Reduce points based on hints used
      setScore(prevScore => prevScore + pointsEarned);
      setFeedback(`Correct! 🎉 +${pointsEarned} points`);
      setIsCorrect(true);
    } else {
      setFeedback("Not quite. Try again!");
      setIsCorrect(false);
    }
  };

  /**
   * Moves to the next word in the list.
   */
  const nextWord = () => {
    setCurrentWordIndex(prevIndex => prevIndex + 1);
  };

  /**
   * Provides a hint by revealing one letter of the word.
   */
  const getHint = () => {
    if (hintsUsed >= 3) {
      setFeedback("Maximum hints used!");
      return;
    }

    const originalWord = words[currentWordIndex].original.toUpperCase();
    const currentGuess = userGuess.toUpperCase();
    let hintedGuess = currentGuess;
    
    // Find a position to reveal
    let position = -1;
    for (let i = 0; i < originalWord.length; i++) {
      if (i >= currentGuess.length || currentGuess[i] !== originalWord[i]) {
        position = i;
        break;
      }
    }
    
    if (position === -1) {
      // If no position found, just add the next letter
      position = currentGuess.length;
    }
    
    // Create the new guess with the hint
    if (position < currentGuess.length) {
      hintedGuess = currentGuess.substring(0, position) + originalWord[position] + currentGuess.substring(position + 1);
    } else {
      hintedGuess = currentGuess + originalWord[position];
    }
    
    setUserGuess(hintedGuess);
    setHintsUsed(prev => prev + 1);
    setFeedback(`Hint used! (${hintsUsed + 1}/3)`);
  };
  
  /**
   * Skips the current word and moves to the next one.
   */
  const skipWord = () => {
    setFeedback(`Skipped! The word was: ${words[currentWordIndex].original.toUpperCase()}`);
    setTimeout(() => {
      nextWord();
    }, 2000);
  };

  /**
   * Explains the current word using the Gemini API.
   */
  const explainWord = async () => {
    // Validate API key
    if (!apiKey) {
      setExplanation("Google API key not configured. Please check your environment variables.");
      setIsLoadingExplanation(false);
      return;
    }

    const wordToExplain = words[currentWordIndex].original;
    setIsLoadingExplanation(true);
    setExplanation(''); // Clear previous explanation

    const prompt = `Explain the AI term "${wordToExplain}" in a simple, engaging way for a 13-16 year old, in 1-2 sentences.`;

    let chatHistory = [];
    chatHistory.push({ role: "user", parts: [{ text: prompt }] });

    const payload = {
      contents: chatHistory,
      generationConfig: {
        temperature: 0.7,
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
        setExplanation(text);
      } else {
        setExplanation("Could not get an explanation. Try again!");
        console.error("Unexpected API response structure:", result);
      }
    } catch (error) {
      setExplanation("Error fetching explanation. Please try again later.");
      console.error("Error fetching AI explanation:", error);
    } finally {
      setIsLoadingExplanation(false);
    }
  };

  // We now use the state variable currentScrambledWord instead of calculating it on each render

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-100 p-4">
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-4 text-purple-400">AI Word Scramble!</h1>
        <div className="flex justify-between items-center mb-4">
          <div className="bg-gray-700 px-3 py-1 rounded-md">
            <span className="text-sm text-gray-300">Word </span>
            <span className="text-sm font-bold text-blue-400"> {currentWordIndex + 1 < words.length ? currentWordIndex + 1 : words.length}</span>
            <span className="text-sm text-gray-300">/{words.length}</span>
          </div>
          <div className="bg-gray-700 px-3 py-1 rounded-md">
            <span className="text-sm text-gray-300">Score: </span>
            <span className="text-sm font-bold text-yellow-400">{score}</span>
          </div>
        </div>
        <p className="text-gray-300 text-lg mb-6">Unscramble the AI-related word below. Type your answer and hit 'Check!'</p>
        {currentWordIndex < words.length ? (
          <>
            <div className="text-5xl font-extrabold tracking-widest mb-8 text-blue-300 min-h-[80px] flex items-center justify-center">
              {isLoading ? (
                <div className="loading-spinner"></div>
              ) : (
                currentScrambledWord
              )}
            </div>
            <input
              type="text"
              className="w-full p-3 rounded-lg bg-gray-700 text-white text-center text-xl mb-4 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your answer here..."
              value={userGuess}
              onChange={(e) => setUserGuess(e.target.value)}
              onKeyPress={(e) => { if (e.key === 'Enter') checkGuess(); }}
              disabled={isCorrect}
            />
            <div className="flex justify-center space-x-4 mb-4">
              {!isCorrect && (
                <>
                  <button
                    onClick={checkGuess}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-5 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Check!
                  </button>
                  <button
                    onClick={getHint}
                    className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-5 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2"
                    disabled={hintsUsed >= 3}
                  >
                    Hint ({3 - hintsUsed} left)
                  </button>
                  <button
                    onClick={skipWord}
                    className="bg-rose-500 hover:bg-rose-600 text-white font-semibold py-2 px-5 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2"
                  >
                    Skip
                  </button>
                </>
              )}
              {isCorrect && currentWordIndex < words.length && (
                <button
                  onClick={nextWord}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-5 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2"
                >
                  Next Word
                </button>
              )}
              {isCorrect && (
                <button
                  onClick={explainWord}
                  className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-5 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                >
                  ✨ Explain Word
                </button>
              )}
            </div>
            <div className={`text-lg font-semibold ${feedback.includes('Correct') ? 'text-green-400' : 'text-red-400'} min-h-[28px] mb-4`}>
              {feedback}
            </div>
            <div className="bg-gray-700 p-4 rounded-lg text-gray-200 text-sm italic min-h-[80px] flex items-center justify-center">
              {isLoadingExplanation ? (
                <div className="loading-spinner"></div>
              ) : (
                <ReactMarkdown>{explanation}</ReactMarkdown>
              )}
            </div>
          </>
        ) : (
          <div className="text-2xl font-bold text-green-400">
            {feedback}
          </div>
        )}
      </div>
    </div>
  );
}

export default WordScramble;

import React, { useState } from 'react';

function AIOrNotQuiz() {
  const [currentRiddleIndex, setCurrentRiddleIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);

  const riddles = [
    {
      title: "The Face Finder",
      preamble: "I unlock your phone just by looking at your face, recognizing your unique features in a split second. I remember you, even if you change your hairstyle!",
      isAI: true,
      explanation: "This is AI! Face recognition uses machine learning to identify unique facial features and adapt to changes in your appearance."
    },
    {
      title: "The Simple Sum Solver",
      preamble: "I can add, subtract, multiply, and divide numbers faster than anyone. But I only know the rules you give me; I can't learn new math on my own.",
      isAI: false,
      explanation: "Not AI! This is just a calculator following programmed rules. It doesn't learn or adapt - it just executes mathematical operations."
    },
    {
      title: "The Movie Matchmaker",
      preamble: "You finish a show, and I immediately suggest another one you'll probably love, based on everything you've watched before. It's like I know your taste better than you do!",
      isAI: true,
      explanation: "This is AI! Recommendation systems use machine learning to analyze your viewing patterns and predict what you'll enjoy."
    },
    {
      title: "The Voice Listener",
      preamble: "You speak a command, and I understand your words, even your accent, and then perform a task like playing music or setting a timer. I can even tell you a joke!",
      isAI: true,
      explanation: "This is AI! Voice assistants use natural language processing and speech recognition to understand and respond to human speech."
    },
    {
      title: "The Snack Dispenser",
      preamble: "You put in money, press a button, and I drop your chosen snack. If you press the wrong button, I still drop whatever is assigned to it. I don't care if you're hungry, only if you paid.",
      isAI: false,
      explanation: "Not AI! A vending machine follows simple programmed logic - if payment received and button pressed, dispense item. No learning or decision-making."
    },
    {
      title: "The Email Guard",
      preamble: "I guard your inbox, tirelessly sorting through thousands of emails to catch the junk and keep it out of your sight. I learn what 'junk' looks like by seeing millions of examples.",
      isAI: true,
      explanation: "This is AI! Spam filters use machine learning to identify patterns in junk emails and continuously improve their detection abilities."
    },
    {
      title: "The Road Navigator",
      preamble: "I navigate busy streets, identify traffic lights, pedestrians, and other vehicles, making decisions about when to stop, go, or turn, all without a human touching the wheel.",
      isAI: true,
      explanation: "This is AI! Self-driving cars use computer vision, sensor fusion, and machine learning to make real-time driving decisions."
    },
    {
      title: "The Time Teller",
      preamble: "I wake you up at the exact time you set, every single day, without fail. I don't care if it's a holiday or if you're tired; my job is just to make noise at a specific time.",
      isAI: false,
      explanation: "Not AI! An alarm clock follows a simple timer program - when current time equals set time, make sound. No intelligence required."
    },
    {
      title: "The Quick Reply Helper",
      preamble: "When you get an email or a message, I read it and then suggest a few short, quick responses you can tap to send. It's like I'm trying to help you reply faster!",
      isAI: true,
      explanation: "This is AI! Smart reply systems use natural language processing to understand message content and generate contextually appropriate responses."
    },
    {
      title: "The Mood Reader",
      preamble: "I listen to your voice or read your text, trying to figure out if you're happy, frustrated, or confused, so a system can respond better to your mood.",
      isAI: true,
      explanation: "This is AI! Sentiment analysis uses machine learning to detect emotions from text or voice patterns and adapt responses accordingly."
    }
  ];

  const currentRiddle = riddles[currentRiddleIndex];

  const handleAnswer = (answer) => {
    setUserAnswer(answer);
    setShowAnswer(true);
    
    if (answer === currentRiddle.isAI) {
      setScore(score + 1);
    }
  };

  const nextRiddle = () => {
    if (currentRiddleIndex < riddles.length - 1) {
      setCurrentRiddleIndex(currentRiddleIndex + 1);
      setUserAnswer(null);
      setShowAnswer(false);
    } else {
      setGameCompleted(true);
    }
  };

  const resetGame = () => {
    setCurrentRiddleIndex(0);
    setUserAnswer(null);
    setShowAnswer(false);
    setScore(0);
    setGameCompleted(false);
  };

  if (gameCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white flex items-center justify-center p-4">
        <div className="bg-gray-800/80 backdrop-blur-sm p-8 rounded-xl shadow-2xl max-w-md w-full text-center border border-gray-700">
          <h1 className="text-3xl font-bold mb-4 text-purple-400">🎉 Quiz Complete! 🎉</h1>
          <div className="text-6xl font-bold mb-4 text-blue-400">{score}/{riddles.length}</div>
          <p className="text-lg mb-6 text-gray-300">
            {score >= 8 ? "Outstanding! You're an AI detective!" :
             score >= 6 ? "Great job! You've got a good eye for AI!" :
             score >= 4 ? "Not bad! Keep learning about AI!" :
             "Keep exploring! AI is everywhere once you know how to spot it!"}
          </p>
          <button
            onClick={resetGame}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
          >
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="bg-gray-800/80 backdrop-blur-sm p-8 rounded-xl shadow-2xl max-w-2xl w-full text-center relative z-10 border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-gray-300">
            Riddle {currentRiddleIndex + 1}/{riddles.length}
          </div>
          <div className="text-sm text-gray-300">
            Score: <span className="text-blue-400 font-semibold">{score}</span>
          </div>
        </div>

        <h1 className="text-4xl font-bold mb-2 text-purple-400">AI or Not AI?</h1>
        <h2 className="text-2xl font-semibold mb-6 text-blue-300">The Riddle Challenge! 🤖</h2>

        <div className="bg-gray-700/50 p-6 rounded-lg mb-6 border border-gray-600">
          <h3 className="text-xl font-bold mb-4 text-yellow-300">{currentRiddle.title}</h3>
          <p className="text-lg leading-relaxed text-gray-200 italic">
            "{currentRiddle.preamble}"
          </p>
        </div>

        {!showAnswer ? (
          <div className="space-y-4">
            <p className="text-lg mb-6 text-gray-300">What do you think? 🤔</p>
            <div className="flex justify-center space-x-6">
              <button
                onClick={() => handleAnswer(true)}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-8 rounded-lg shadow-lg border-2 border-green-500 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 text-lg"
              >
                👍 AI
              </button>
              <button
                onClick={() => handleAnswer(false)}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-4 px-8 rounded-lg shadow-lg border-2 border-red-500 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 text-lg"
              >
                👎 Not AI
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className={`p-4 rounded-lg ${userAnswer === currentRiddle.isAI ? 'bg-green-600/30 border border-green-500' : 'bg-red-600/30 border border-red-500'}`}>
              <p className="text-xl font-semibold mb-2">
                {userAnswer === currentRiddle.isAI ? '✅ Correct!' : '❌ Incorrect!'}
              </p>
              <p className="text-lg">
                The answer is: <span className="font-bold">{currentRiddle.isAI ? 'AI' : 'Not AI'}</span>
              </p>
            </div>

            <div className="bg-gray-700/50 p-4 rounded-lg text-left border border-gray-600">
              <h4 className="font-semibold mb-2 text-blue-300">Explanation:</h4>
              <p className="text-gray-200">{currentRiddle.explanation}</p>
            </div>

            <button
              onClick={nextRiddle}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
            >
              {currentRiddleIndex < riddles.length - 1 ? 'Next Riddle' : 'View Results'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AIOrNotQuiz;

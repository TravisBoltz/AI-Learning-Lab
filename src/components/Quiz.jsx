import React, { useState, useEffect } from 'react';
import { collection, addDoc } from 'firebase/firestore';

// --- Quiz Component ---
function Quiz({ db, userId, appId, isAuthReady }) {
  const quizData = [
    {
      question: "Which AI superpower helps machines 'see' and interpret images?",
      options: ["Natural Language Processing", "Machine Learning", "Computer Vision", "Emotion AI"],
      answer: "Computer Vision"
    },
    {
      question: "What is an example of Machine Learning in action?",
      options: ["A calculator solving 2+2", "Netflix recommending shows", "A simple alarm clock", "A vending machine dispensing a drink"],
      answer: "Netflix recommending shows"
    },
    {
      question: "Which AI technology allows systems like Siri or Alexa to understand your voice?",
      options: ["Computer Vision", "Predictive Support", "Natural Language Processing", "Hyper-Personalization"],
      answer: "Natural Language Processing"
    },
    {
      question: "By 2030, what percentage of customer service interactions are expected to be handled by AI?",
      options: ["10%", "50%", "70%", "90%"],
      answer: "90%"
    },
    {
      question: "Which of these is something humans are generally better at than AI?",
      options: ["Recognizing patterns", "Performing repetitive tasks", "Empathy", "Processing large datasets quickly"],
      answer: "Empathy"
    }
  ];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [quizActive, setQuizActive] = useState(true); // Flag to prevent multiple checks
  const [showSubmitModal, setShowSubmitModal] = useState(false); // State for submit modal
  const [submitDisplayName, setSubmitDisplayName] = useState(''); // State for display name input
  const [isSubmitting, setIsSubmitting] = useState(false); // State for submission loading

  const loadQuestion = () => {
    if (currentQuestionIndex < quizData.length) {
      setSelectedOption(null);
      setFeedback('');
      setQuizActive(true);
      setShowSubmitModal(false); // Hide modal when new question loads
      setSubmitDisplayName(''); // Clear display name
    } else {
      setFeedback(`Quiz Complete! You scored ${score} out of ${quizData.length}! Great job!`);
      // Show submit button/modal trigger when quiz is complete
      setShowSubmitModal(true);
    }
  };

  useEffect(() => {
    loadQuestion();
  }, [currentQuestionIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  const selectOption = (optionText) => {
    if (!quizActive) return;
    setSelectedOption(optionText);
  };

  const checkAnswer = () => {
    if (!quizActive || selectedOption === null) {
      setFeedback("Please select an answer!");
      return;
    }

    const currentQuestion = quizData[currentQuestionIndex];
    setQuizActive(false);

    if (selectedOption === currentQuestion.answer) {
      setFeedback("Correct! 🎉");
      setScore(prevScore => prevScore + 1);
    } else {
      setFeedback(`Incorrect. The correct answer was: "${currentQuestion.answer}"`);
    }
  };

  const nextQuestion = () => {
    setCurrentQuestionIndex(prevIndex => prevIndex + 1);
  };

  const currentQuestion = quizData[currentQuestionIndex];

  // Function to handle score submission to Firestore
  const handleSubmitScore = async () => {
    if (!isAuthReady || !db || !userId) {
      console.warn("Firebase not ready or user not authenticated. Cannot submit score.");
      setFeedback("App is not ready to submit score. Please try again.");
      return;
    }

    setIsSubmitting(true);
    try {
      const leaderboardRef = collection(db, `artifacts/${appId}/public/data/leaderboardSubmissions`);
      await addDoc(leaderboardRef, {
        timestamp: new Date().toISOString(),
        userId: userId,
        activityType: "quiz",
        score: score,
        totalQuestions: quizData.length,
        displayName: submitDisplayName.trim() || `Anon-${userId.substring(0, 6)}` // Use Anon-UUID if no name
      });
      setFeedback("Score submitted successfully! 🎉");
      setShowSubmitModal(false); // Close modal
    } catch (error) {
      console.error("Error submitting score:", error);
      setFeedback("Failed to submit score. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-100 p-4">
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg max-w-2xl w-full text-center">
        <h1 className="text-3xl font-bold mb-4 text-green-400">Quick AI Quiz!</h1>
        <div className="flex justify-between items-center mb-4">
          <div className="bg-gray-700 px-3 py-1 rounded-md">
            <span className="text-sm text-gray-300">Question </span>
            <span className="text-sm font-bold text-blue-400">{currentQuestionIndex + 1 < quizData.length ? currentQuestionIndex + 1 : quizData.length}</span>
            <span className="text-sm text-gray-300">/{quizData.length}</span>
          </div>
          <div className="bg-gray-700 px-3 py-1 rounded-md">
            <span className="text-sm text-gray-300">Score: </span>
            <span className="text-sm font-bold text-green-400">{score}</span>
          </div>
        </div>
        <p className="text-lg mb-6 text-gray-300">Test your knowledge about Artificial Intelligence!</p>

        {currentQuestionIndex < quizData.length ? (
          <>
            <p className="text-2xl font-semibold mb-6 text-blue-300">{currentQuestion.question}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => selectOption(option)}
                  className={`
                                        w-full p-3 rounded-lg text-lg font-medium transition duration-200 ease-in-out
                                        ${selectedOption === option ? 'border-2 border-blue-500 bg-blue-700' : 'bg-gray-700 hover:bg-gray-600'}
                                        ${!quizActive && option === currentQuestion.answer ? 'bg-green-600' : ''}
                                        ${!quizActive && selectedOption === option && selectedOption !== currentQuestion.answer ? 'bg-red-600' : ''}
                                        ${!quizActive ? 'cursor-not-allowed opacity-80' : 'cursor-pointer transform hover:scale-105'}
                                    `}
                  disabled={!quizActive}
                >
                  {option}
                </button>
              ))}
            </div>
            <div className="flex justify-center space-x-4">
              {quizActive ? (
                <button
                  onClick={checkAnswer}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                >
                  Check Answer
                </button>
              ) : (
                <button
                  onClick={nextQuestion}
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-5 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                >
                  Next Question
                </button>
              )}
            </div>
            <div className="mt-4 text-lg font-semibold min-h-[30px]">
              <span className={`${feedback.includes('Correct') ? 'text-green-400' : 'text-red-400'}`}>
                {feedback}
              </span>
            </div>
          </>
        ) : (
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400 mb-6">
              {feedback}
            </div>
            <button
              onClick={() => setShowSubmitModal(true)}
              className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-5 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
            >
              Submit to Leaderboard
            </button>
          </div>
        )}

        {/* Submission Modal */}
        {showSubmitModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 p-6 rounded-xl shadow-xl max-w-md w-full">
              <h2 className="text-xl font-bold mb-4 text-green-400">Submit Your Score</h2>
              <p className="mb-4 text-gray-300">Enter a display name for the leaderboard:</p>
              <input
                type="text"
                className="w-full p-3 rounded-lg bg-gray-700 text-white mb-4 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Your display name (optional)"
                value={submitDisplayName}
                onChange={(e) => setSubmitDisplayName(e.target.value)}
                disabled={isSubmitting}
              />
              <div className="flex justify-between">
                <button
                  onClick={handleSubmitScore}
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-5 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                  disabled={isSubmitting}
                >
                  Submit
                </button>
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-5 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
              </div>
              {isSubmitting && (
                <div className="loading-spinner mt-4"></div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Quiz;

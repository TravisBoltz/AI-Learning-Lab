import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import './App.css';

// Import components
import WordScramble from './components/WordScramble';
import Quiz from './components/Quiz';
import IdeaGenerator from './components/IdeaGenerator';

function App() {
  const [activeComponent, setActiveComponent] = useState('icebreaker'); // Default to icebreaker
  const [userId, setUserId] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // Firebase setup
  const firebaseConfig = {
    apiKey: "AIzaSyDvnmK8XUg-M1hkIGHOFgPJf_VwBNQYYoY",
    authDomain: "ai-camp-canvas.firebaseapp.com",
    projectId: "ai-camp-canvas",
    storageBucket: "ai-camp-canvas.appspot.com",
    messagingSenderId: "1046689531453",
    appId: "1:1046689531453:web:d4d8c8e7e2a22a3f2b7e2f"
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);
  const appId = "ai-camp-canvas"; // Used for Firestore collection paths

  // Firebase authentication setup
  useEffect(() => {
    const setupAuth = async () => {
      try {
        const userCredential = await signInAnonymously(auth);
        setUserId(userCredential.user.uid);
        setIsAuthReady(true);
      } catch (error) {
        console.error("Error signing in anonymously:", error);
        setIsAuthReady(true); // Mark auth as ready even if failed
      }
    };

    setupAuth();
  }, [auth]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="bg-gray-800 p-4 shadow-md">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-400 mb-4 md:mb-0">AI Learning Lab</h1>
          <div className="flex flex-wrap justify-center space-x-2 space-y-2 md:space-y-0">
            <button
              onClick={() => setActiveComponent('icebreaker')}
              className={`px-4 py-2 rounded-md ${activeComponent === 'icebreaker' ? 'bg-purple-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
            >
              Word Scramble
            </button>
            <button
              onClick={() => setActiveComponent('quiz')}
              className={`px-4 py-2 rounded-md ${activeComponent === 'quiz' ? 'bg-green-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
            >
              AI Quiz
            </button>
            <button
              onClick={() => setActiveComponent('ideaGenerator')}
              className={`px-4 py-2 rounded-md ${activeComponent === 'ideaGenerator' ? 'bg-purple-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
            >
              Idea Generator
            </button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto p-4">
        {activeComponent === 'icebreaker' && <WordScramble />}
        {activeComponent === 'quiz' && <Quiz db={db} userId={userId} appId={appId} isAuthReady={isAuthReady} />}
        {activeComponent === 'ideaGenerator' && <IdeaGenerator />}
      </main>
    </div>
  );
}

export default App;

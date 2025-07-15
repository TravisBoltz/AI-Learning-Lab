import React, { useState, useEffect } from 'react';
// import { initializeApp } from 'firebase/app';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import './App.css';

// Import components
import AIOrNotQuiz from './components/AIOrNotQuiz';
import WordScramble from './components/WordScramble';
import Quiz from './components/Quiz';
import IdeaGenerator from './components/IdeaGenerator';

function App() {
  const [activeComponent, setActiveComponent] = useState('aiOrNot'); // Default to AI or Not quiz
  const [userId, setUserId] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // Firebase configuration from environment variables
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
  };

  // Validate Firebase configuration
  const validateFirebaseConfig = () => {
    const requiredKeys = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
    const missingKeys = requiredKeys.filter(key => !firebaseConfig[key]);
    
    if (missingKeys.length > 0) {
      console.error('Missing Firebase configuration keys:', missingKeys);
      return false;
    }
    return true;
  };

  // Initialize Firebase only if configuration is valid
  let app, analytics, db, auth;
  const appId = "ai-camp-canvas"; // Used for Firestore collection paths

  if (validateFirebaseConfig()) {
    try {
      app = initializeApp(firebaseConfig);
      analytics = getAnalytics(app);
      db = getFirestore(app);
      auth = getAuth(app);
    } catch (error) {
      console.error('Firebase initialization error:', error);
    }
  }

  // Firebase authentication setup
  useEffect(() => {
    const setupAuth = async () => {
      if (!auth) {
        console.error('Firebase auth not initialized. Please check your Firebase configuration.');
        setIsAuthReady(true);
        return;
      }

      try {
        const userCredential = await signInAnonymously(auth);
        setUserId(userCredential.user.uid);
        setIsAuthReady(true);
        console.log('Anonymous authentication successful');
      } catch (error) {
        console.error("Error signing in anonymously:", error);
        
        if (error.code === 'auth/configuration-not-found') {
          console.error('Firebase Authentication is not enabled. Please enable it in your Firebase console.');
        } else if (error.code === 'auth/api-key-not-valid') {
          console.error('Invalid Firebase API key. Please check your configuration.');
        }
        
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
              onClick={() => setActiveComponent('aiOrNot')}
              className={`px-4 py-2 rounded-md ${activeComponent === 'aiOrNot' ? 'bg-indigo-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
            >
              🤖 AI or Not?
            </button>
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

      {/* AI or Not Quiz has its own full-screen layout */}
      {activeComponent === 'aiOrNot' && <AIOrNotQuiz />}
      
      {/* Other components use the container layout */}
      {activeComponent !== 'aiOrNot' && (
        <main className="container mx-auto p-4">
          {activeComponent === 'icebreaker' && <WordScramble />}
          {activeComponent === 'quiz' && <Quiz db={db} userId={userId} appId={appId} isAuthReady={isAuthReady} />}
          {activeComponent === 'ideaGenerator' && <IdeaGenerator />}
        </main>
      )}
    </div>
  );
}

export default App;

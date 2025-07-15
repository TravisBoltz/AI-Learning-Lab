
# AI Learning Lab

An interactive React + Vite web app for learning about Artificial Intelligence through games and quizzes.

## Features
- **AI or Not? Riddle Challenge**: Spot AI in everyday tech with fun riddles
- **Word Scramble**: Unscramble AI-related terms, get instant explanations
- **AI Quiz**: Test your knowledge with multiple-choice questions
- **Idea Generator**: Get creative AI project ideas powered by Google Gemini

## Getting Started

### 1. Clone the repository
```bash
git clone <repo-url>
cd AI-Learning-Lab
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/) and create a new project (or use an existing one).
2. In your project, go to **Project Settings > General > Your apps** and add a new Web app.
3. Copy the Firebase config object (apiKey, authDomain, etc).
4. In the Firebase Console, go to **Authentication > Sign-in method** and enable **Anonymous** authentication.
5. (Optional) Set up Firestore if you want to persist quiz results.

### 4. Set up Google Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey) and generate an API key.
2. Copy the key for use in your environment variables.

### 5. Configure environment variables

Create a `.env` file in the project root (see `.env.example` for reference):

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
VITE_GOOGLE_API_KEY=your_gemini_api_key
```

> **Note:** Never commit your `.env` file with real keys to version control.

### 6. Start the development server
```bash
npm run dev
```
Visit [http://localhost:5173](http://localhost:5173) to use the app.

## Usage

- **Home (AI or Not?)**: Play the riddle challenge and learn to spot AI
- **Word Scramble**: Unscramble words, get AI explanations
- **AI Quiz**: Take a multiple-choice quiz
- **Idea Generator**: Generate creative AI project ideas

Switch between activities using the navigation bar at the top.

## Firebase Notes
- Make sure Anonymous Auth is enabled for sign-in to work
- Firestore is used for quiz results (optional, but recommended)
- You can find your Firebase config in Project Settings > General > Your apps

## Gemini API Notes
- The Google Gemini API key is required for the Idea Generator and explanations
- Get your key from [Google AI Studio](https://makersuite.google.com/app/apikey)

## Project Structure

- `src/components/` — All React components (games, quizzes, etc)
- `src/lib/` — Utility functions
- `public/` — Static assets (images, icons)
- `.env.example` — Example environment config

## Contributing
Pull requests are welcome! Please follow the code style and keep components modular.

## License
MIT

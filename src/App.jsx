import { useState } from 'react';
import popchoiceLogo from './assets/branding.png';
import './App.css';
import InitialQuestions from './components/screens/InitialQuestions';
import Questions from './components/screens/Questions';
import Results from './components/screens/Results';
import { Routes, Route } from 'react-router';
import { QuestionContextProvider } from './context/QuestionContext';

function App() {
  return (
    <QuestionContextProvider>
      <Routes>
        <Route index element={<InitialQuestions />} />
        <Route path="questions" element={<Questions />} />
        <Route path="results" element={<Results />} />
      </Routes>
    </QuestionContextProvider>
  );
}

export default App;

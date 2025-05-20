import { createContext, useContext, useState } from 'react';

const QuestionContext = createContext({});
export default QuestionContext;

export const QuestionContextProvider = ({ children }) => {
  const [initialQuestionAnswers, setInitialQuestionAnswers] = useState({
    numPeople: '2',
    time: '2',
  });

  const [questionAnswers, setQuestionAnswers] = useState({
    0: {
      favouriteMovie: 'spiderman',
      newOrClassic: 'new',
      genre: 'thriller',
      famousPerson: 'tom holland',
    },
  });
  
  const [recommendations, setRecommendations] = useState([]);

  const value = {
    initialQuestionAnswers,
    setInitialQuestionAnswers,
    questionAnswers,
    setQuestionAnswers,
    recommendations,
    setRecommendations
  };

  return (
    <QuestionContext.Provider value={value}>
      {children}
    </QuestionContext.Provider>
  );
};

export const useQuestionContext = () => useContext(QuestionContext);

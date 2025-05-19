import Logo from '../Logo';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useQuestionContext } from '../../context/QuestionContext';

const InitialQuestions = () => {
  const navigate = useNavigate();

  const { initialQuestionAnswers, setInitialQuestionAnswers } =
    useQuestionContext();
  const [formData, setFormData] = useState(initialQuestionAnswers);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: Number(value) });
  };

  const handleStart = () => {
    setInitialQuestionAnswers(formData);
    navigate('/questions');
  };

  return (
    <>
      <Logo />
      <div className="flex flex-col gap-4 items-center mt-10">
        <input
          className="bg-blue-300 text-blue-900 p-1 text-center outline-none border-none"
          placeholder="How many people?"
          name="numPeople"
          value={formData.numPeople}
          onChange={handleChange}
        />
        <input
          className="bg-blue-300 text-blue-900 p-1 text-center outline-none border-none"
          placeholder="How much time do you have?"
          name="time"
          value={formData.time}
          onChange={handleChange}
        />
        <button
          className="bg-green-300 cursor-pointer w-[100px] rounded-sm h-[40px]"
          onClick={handleStart}
        >
          Start
        </button>
      </div>
    </>
  );
};

export default InitialQuestions;

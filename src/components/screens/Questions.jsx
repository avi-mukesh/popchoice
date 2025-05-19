import Logo from '../Logo';
import { useContext, useEffect, useState } from 'react';
import { useQuestionContext } from '../../context/QuestionContext';

const blank = {
  favouriteMovie: '',
  newOrClassic: '',
  genre: '',
  famousPerson: '',
};

const Questions = () => {
  const [currentPerson, setCurrentPerson] = useState(0);
  const [prevPerson, setPrevPerson] = useState(null);

  const { initialQuestionAnswers, questionAnswers, setQuestionAnswers } =
    useQuestionContext();

  const [formData, setFormData] = useState(questionAnswers[currentPerson]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNextPerson = () => {
    setPrevPerson(currentPerson);
    setCurrentPerson((prev) => prev + 1);
  };

  const handlePrevPerson = () => {
    setPrevPerson(currentPerson);
    setCurrentPerson((prev) => prev - 1);
  };

  useEffect(() => {
    const newQuestionAnswers = {
      ...questionAnswers,
      [prevPerson]: formData,
    };
    let newFormData = blank;
    if (currentPerson in questionAnswers) {
      newQuestionAnswers[[currentPerson]] = blank;
      newFormData = questionAnswers[currentPerson];
    }
    setFormData(newFormData);
    setQuestionAnswers(newQuestionAnswers);
  }, [currentPerson]);

  const handleGetMovie = () => {
    console.log('getting movie...');
  };

  return (
    <>
      <Logo />
      <div className="flex flex-col gap-4 items-center mt-10 max-w-[70%] mx-auto">
        <h2 className="text-3xl text-slate-400">{currentPerson + 1}</h2>
        <div className="flex flex-col items-start">
          <label className="text-slate-100">
            What's your favourite movie and why?
          </label>
          <input
            className="bg-blue-300 text-blue-900 p-1 text-center outline-none border-none rounded-sm w-full"
            name="favouriteMovie"
            value={formData.favouriteMovie}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col items-start">
          <label className="text-slate-100">
            Are you in the mood for something new or classic?
          </label>
          <input
            className="bg-blue-300 text-blue-900 p-1 text-center outline-none border-none rounded-sm w-full"
            name="newOrClassic"
            value={formData.newOrClassic}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col items-start">
          <label className="text-slate-100">
            What genre are you in the mood for?
          </label>
          <input
            className="bg-blue-300 text-blue-900 p-1 text-center outline-none border-none rounded-sm w-full"
            name="genre"
            value={formData.genre}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col items-start">
          <label className="text-slate-100">
            Which famous film person would you love to be stranded on an island
            with and why?
          </label>
          <input
            className="bg-blue-300 text-blue-900 p-1 text-center outline-none border-none rounded-sm w-full"
            name="famousPerson"
            value={formData.famousPerson}
            onChange={handleChange}
          />
        </div>

        {currentPerson + 1 < initialQuestionAnswers.numPeople ? (
          <button
            className="bg-green-300 cursor-pointer w-[100px] rounded-sm h-[40px]"
            onClick={handleNextPerson}
          >
            Next
          </button>
        ) : (
          <button
            className="bg-green-300 cursor-pointer w-[100px] rounded-sm h-[40px]"
            onClick={handleGetMovie}
          >
            Get Movie
          </button>
        )}
        {initialQuestionAnswers.numPeople > 1 && currentPerson > 0 && (
          <button
            className="bg-green-300 cursor-pointer w-[100px] rounded-sm h-[40px]"
            onClick={handlePrevPerson}
          >
            Prev
          </button>
        )}
      </div>
    </>
  );
};

export default Questions;

import Logo from '../Logo';
import { useEffect, useState } from 'react';
import { useQuestionContext } from '../../context/QuestionContext';
import {openai, createEmbedding, findNearestMatches } from '../../util/openaiClient';
import { useNavigate } from 'react-router';


const blank = {
  favouriteMovie: 'spiderman',
  newOrClassic: 'new',
  genre: 'action',
  famousPerson: 'tom hanks',
};

const Questions = () => {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [currentPerson, setCurrentPerson] = useState(0);
  const [prevPerson, setPrevPerson] = useState(0);

  const { initialQuestionAnswers, questionAnswers, setQuestionAnswers, setRecommendations } =
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
      [prevPerson]: formData
    }
    console.log('newquestionanswers', newQuestionAnswers)
    setQuestionAnswers(newQuestionAnswers);
    
    let newFormData = blank;
    if (currentPerson in questionAnswers) {
      newFormData = questionAnswers[currentPerson];
    }
    setFormData(newFormData);
  }, [currentPerson]);

  const handleGetMovie = async () => {
    setLoading(true);
    let answers = {...questionAnswers, [initialQuestionAnswers.numPeople-1]: formData};

    let input = '';

    for(let key in answers) {
      console.log('key', key=='null');
      if(key) {
        let personAnswer = answers[key];

        let personInput = `
Person ${Number(key)+1} likes ${personAnswer.favouriteMovie}. 
They are in the mood for a ${personAnswer.newOrClassic} ${personAnswer.genre} movie.
The famous film person they would love to be stranded on an island with is ${personAnswer.famousPerson}
        `
        input += personInput;
      }
    }
    let query_embedding = await createEmbedding(input);
    console.log(query_embedding);
    let matches = await findNearestMatches(query_embedding);

    const userMessage = `Context: ${matches}.\nWhat people like: ${input}. They have ${initialQuestionAnswers.time} hours to spare`;
    console.log(userMessage);

    let res = await openai.chat.completions.create({
        model:'gpt-4.1', 
        temperature: 0.65,
        messages: [
          {
            role: 'system',
            content: "You are an enthusiastic movie expert who loves recommending movies to people. You will be given two pieces of information - some context about movies and the answers from a few different people about what their movie preferences are. Your main job is to recommend between 2 and 4 movies using the provided context. For each movie, give a short reason why you recommend it gien the people preferences and the amount of time they have. Return the recommendations in the order of most to least recommended. Separate each recommendation by a new line and separate the movie title from it's recommendation by ***. Do not write an introduction or a conclusion."
          },
          // TODO: give a sample answer so it knows how to respond
          {
            role: 'user',
            content: userMessage
          }
        ]
    })

    let responseContent = res.choices[0].message.content;
    let recommendations = responseContent.split('\n\n');
    setRecommendations(recommendations);
    setLoading(false);
    navigate('/results');
  };

  return (
    <>
      <Logo />
      {
        loading ? <p className='text-slate-300 text-2xl text-center'>Hold on tight!</p> :
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
          
          
          <div className='flex gap-2'>
              {initialQuestionAnswers.numPeople > 1 && currentPerson > 0 && (
                <button
                  className="bg-green-300 cursor-pointer w-[100px] rounded-sm h-[40px]"
                  onClick={handlePrevPerson}
                >
                  Prev
                </button>
              )}
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
          </div>
          
        </div>
      }
    </>
  );
};

export default Questions;

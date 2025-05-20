import { useEffect, useState } from "react";
import { useQuestionContext } from "../../context/QuestionContext";

const Results = () => {
  const { recommendations } = useQuestionContext();
  let movieTitles = recommendations.map(recommendations => recommendations.split('***')[0].trim());
  let recommendationTexts = recommendations.map(recommendations => recommendations.split('***')[1].trim());
  const [posterUrls, setPosterUrls] = useState([]);
  const [recommendationIndex, setRecommendationIndex] = useState(0);

  useEffect(() => {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzMWQyNTg4YTUxZjZlYmUyMGU4YzYyZWUyODI5ZDYwMCIsIm5iZiI6MTc0NzczMTg2OC4wNTUsInN1YiI6IjY4MmM0NTljZDVlNjc2ZWE5MjBiZGUxNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.-1zYp2RqQdBh4jUIWuEI_UkDqGanjgWzS3BfZAitmr8'
      }
    };
    async function fetchMoviePosters() {
      const ids = await Promise.all(movieTitles.map(async title => {
        const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURI(title)}&include_adult=true&language=en-US&page=1`;

        const res = await fetch(url, options)
        const json = await res.json()
        const id = json.results[0].id
        return Promise.resolve(id);
      }));

      const posters = await Promise.all(ids.map(async id => {
        const url = `https://api.themoviedb.org/3/movie/${id}/images`;
        
        const res = await fetch(url, options)
        const json = await res.json()
        const posterPath = json.posters[0].file_path;
        const posterUrl = `https://image.tmdb.org/t/p/original/${posterPath}`;
        return Promise.resolve(posterUrl);       
      }));
      
      return Promise.resolve(posters);
    }
    console.log(movieTitles.length);
    fetchMoviePosters().then(res => setPosterUrls(res));
  }, []) 

  return (
    <div className="p-5 flex flex-col items-center gap-2 max-w-[80%] mx-auto">
      <p className="text-4xl text-slate-400">{movieTitles[recommendationIndex]}</p>
      <img className="w-[300px]" src={posterUrls[recommendationIndex]}/>
      <p className="text-lg text-slate-300">{recommendationTexts[recommendationIndex]}</p>
      {recommendationIndex > 0 && <button className="bg-green-300 cursor-pointer w-[100px] rounded-sm h-[40px]" onClick={() => setRecommendationIndex(prev=>prev-1)}>Prev Movie</button>}
      {recommendationIndex < recommendations.length-1 && <button className="bg-green-300 cursor-pointer w-[100px] rounded-sm h-[40px]" onClick={() => setRecommendationIndex(prev=>prev+1)}>Next Movie</button>}
    </div>
  );
};

export default Results;

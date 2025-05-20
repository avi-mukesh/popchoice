import { useEffect, useState } from "react";
import { useQuestionContext } from "../../context/QuestionContext";

const Results = () => {
  const { recommendations } = useQuestionContext();
  let movieTitles = recommendations.map(recommendations => recommendations.split('***')[0].trim());
  const [posterUrls, setPosterUrls] = useState([]);

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
    console.log(movieTitles);
    fetchMoviePosters().then(res => console.log(res));
  }, []) 

      //TODO use api to query for movie title

  return <h1>Results</h1>;
};

export default Results;

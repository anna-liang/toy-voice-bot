import axios, { AxiosRequestConfig } from 'axios';

import { Movies } from '../services/data'

import { StateTypes, States } from '../config/types'

import { FSM } from '../state_machine/FSM'

import { invalid } from '../utils/utils'

Movies.set('NUM_OF_MOVIES', 250);
Movies.set('IMDB_URL', "https://imdb-api.com/en/");
Movies.set('IMDB_API_KEY', "k_5fyel97z");
Movies.set('GameChoices', ["Hint", "Guess", "Forfeit"]);
Movies.set('HintChoices', ["Genre", "Year", "Tagline", "Leads", "Director"]);

export const gameStates: States = {
    'Game': {
        type: StateTypes.Statement,
        next: "GameMenu",
        before: async() => {
            let allMovies = [];
            if (Movies.has('movies')) {
                allMovies = Movies.get('movies');
            }
            // Fetch all movies for the first time
            else {
                const allMoviesOptions: AxiosRequestConfig = {
                    method: 'GET',
                    url: Movies.get('IMDB_URL') + 'API/Top250Movies',
                    params: {
                        apiKey: Movies.get('IMDB_API_KEY')
                    }
                };
                try {
                    const allMoviesResponse = await axios.request(allMoviesOptions);
                    allMovies = allMoviesResponse.data.items;
                    Movies.set('movies', allMovies);
                } catch(err) {
                    console.error(err);
                }
            }
            // Pick a movie
            const movieIndex = Math.floor((Math.random() * Movies.get('NUM_OF_MOVIES')));
            const id = allMovies[movieIndex].id;
            const moviesOptions: AxiosRequestConfig = {
                method: 'GET',
                url: Movies.get('IMDB_URL') + 'API/Title',
                params: {
                    apiKey: Movies.get('IMDB_API_KEY'),
                    id: id
                }
            };
            try {
                const movieResponse = await axios.request(moviesOptions);
                const movie = movieResponse.data;
                Movies.set('movie', movie);
            } catch(err) {
                console.error(err);
            }
        },
        text: () => "Welcome to the Movie Guessing Game. Try to guess the movie."
    },
    'GameMenu': {
        type: StateTypes.Question,
        text: () => {
            const choices = Movies.get('GameChoices');
            const result = "What's your next move? " + choices.join(', ');
            return result;
        },
        choices: Movies.get('GameChoices')
    },
    'GameInvalid': {
        type: StateTypes.Statement,
        next: "GameMenu",
        text: () => invalid()
    },
    'Hint': {
        type: StateTypes.Question,
        text: () => {
            const choices = Movies.get('HintChoices');
            const result = "Which hint would you like? " + choices.join(', ');
            return result;
        },
        choices: Movies.get('HintChoices')
    },
    'HintInvalid': {
        type: StateTypes.Statement,
        next: "Hint",
        text: () => invalid()
    },
    'Genre': {
        type: StateTypes.Statement,
        next: "GameMenu",
        text: () => {
            const movie = Movies.get('movie');
            return `This movie is considered ${movie.genres}.`;
        }
    },
    'Year': {
        type: StateTypes.Statement,
        next: "GameMenu",
        text: () => {
            const movie = Movies.get('movie');
            return `This movie came out in ${movie.year}.`;
        }
    },
    'Tagline': {
        type: StateTypes.Statement,
        next: "GameMenu",
        text: () => {
            const movie = Movies.get('movie');
            return movie.tagline;
        }
    },
    'Leads': {
        type: StateTypes.Statement,
        next: "GameMenu",
        text: () => {
            const movie = Movies.get('movie');
            return `This movie stars ${movie.stars}.`;
        }
    },
    'Director': {
        type: StateTypes.Statement,
        next: "GameMenu",
        text: () => {
            const movie = Movies.get('movie');
            return `This movie was directed by ${movie.directors}`;
        }
    },
    'Guess': {
        type: StateTypes.Question,
        text: () => "Make your guess!",
        after: async(state) => {
            const movie = Movies.get('movie');
            const searchOptions: AxiosRequestConfig = {
                method: 'GET',
                url: Movies.get('IMDB_URL') + 'API/SearchMovie',
                params: {
                    apiKey: Movies.get('IMDB_API_KEY'),
                    expression: state.answer
                }
            };
            try {
                const searchResponse = await axios.request(searchOptions);
                const searchResults = searchResponse.data.results;
                if (searchResults.length !== 0) {
                    const searchMovie = searchResults[0].title;
                    if (searchMovie === movie.title) {
                        FSM.action('succeed')
                        return;
                    }
                }
                FSM.action('failed')
            } catch(err) {
                console.error(err);
            }
        }
    },
    'Success': {
        type: StateTypes.Statement,
        next: "Menu",
        text: () => "Congratulations! You guessed the movie!"
    },
    'Failure': {
        type: StateTypes.Statement,
        next: "GameMenu",
        text: () => "Nice guess, but that isn't the movie. Give it another try!"
    },
    'Forfeit': {
        type: StateTypes.Statement,
        next: "Menu",
        text: () => {
            const movie = Movies.get('movie');
            return `The movie was ${movie.title}.`;
        }
    }
}
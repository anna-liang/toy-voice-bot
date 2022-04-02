import axios, { AxiosRequestConfig } from 'axios';

import { StateTypes, States } from '../config/types'

import { Weather } from '../services/data'

Weather.set('WEATHER_URL', "https://community-open-weather-map.p.rapidapi.com/weather");
Weather.set('WEATHER_API_KEY', "17e5d1c9a4msh9626219b27e0824p1a0965jsn0f56fbb373c6");
Weather.set('WEATHER_API_HOST', "community-open-weather-map.p.rapidapi.com");

export const weatherStates: States = {
    'Weather': {
        type: StateTypes.Statement,
        next: "Menu",
        before: async() => {
            const options: AxiosRequestConfig = {
                method: 'GET',
                url: Weather.get('WEATHER_URL'),
                params: {
                    q: 'Toronto',
                    units: 'metric'
                },
                headers: {
                    'x-rapidapi-key': Weather.get('WEATHER_API_KEY'),
                    'x-rapidapi-host': Weather.get('WEATHER_API_HOST')
                }
            };
               
            try {
                const response = await axios.request(options);
                const weather = response.data;
                Weather.set('temperature', weather.main.temp)
                return;
            } catch(err) {
                console.error(err);
            }
        },
        text: () => {
            const temperature = Weather.get('temperature');
            return `The weather for Toronto right now is ${temperature} celsius`
        }
    }
}
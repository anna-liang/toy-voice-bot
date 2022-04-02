import { Prompt } from '../services/prompt'
import { Welcome } from '../services/data'

import { StateTypes, States } from '../config/types'

import { invalid } from '../utils/utils'

Welcome.set('MenuChoices', ["Name", "Colour", "Weather", "Game", "Goodbye"]);

export const welcomeStates: States = {
    'Welcome': {
        type: StateTypes.Question,
        text: () => "Welcome to Replicant! I'm a Thinking Machine on a recorded line. Before we begin I'd like to ask you a few questions. First, what is your name?",
        after: (state) => {
            Welcome.set('name', state.answer);
        }
    },
    'Authentication': {
        type: StateTypes.Question,
        text: () => "What is your favourite colour?",
        after: (state) => {
            Welcome.set('colour', state.answer);
        }
    },
    'Menu': {
        type: StateTypes.Question,
        text: () => {
            const choices = Welcome.get('MenuChoices');
            const result = "What can I help you with today? " + choices.join(', ');
            return result;
        },
        choices: Welcome.get('MenuChoices')
    },
    'MenuInvalid': {
        type: StateTypes.Statement,
        next: "Menu",
        text: () => invalid()
    },
    'Name': {
        type: StateTypes.Statement,
        next: "Menu",
        text: () => {
            const name = Welcome.get('name');
            return `Your name is ${name}, of course.`
        }
    },
    'Colour': {
        type: StateTypes.Statement,
        next: "Menu",
        text: () => {
            const colour = Welcome.get('colour');
            return `Your favourite colour is ${colour}, of course.`
        }
    },
    'Goodbye': {
        type: StateTypes.Statement,
        text: () => "Ok. See you.", 
        after: () => {
            Prompt.close();
            process.exit();
        }
    }
}

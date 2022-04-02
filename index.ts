import { StateService } from './services/state'

import { FSM } from './state_machine/FSM'

import { welcomeStates } from './states/welcome'
import { weatherStates } from './states/weather'
import { gameStates } from './states/game'

const StateManager = new StateService(FSM, {
    ...welcomeStates,
    ...weatherStates,
    ...gameStates,
});

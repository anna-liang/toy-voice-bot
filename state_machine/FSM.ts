import { sm } from 'jssm';

export const FSM = sm`
Welcome 'next' -> Authentication 'next' -> Menu;

Menu <-> Weather;
Menu <-> Name;
Menu <-> Colour;
Menu -> Game -> GameMenu;
Menu -> Goodbye;
Menu 'next' -> MenuInvalid;

MenuInvalid -> Menu;

GameMenu -> Hint;
GameMenu -> Guess;
GameMenu -> Forfeit -> Menu;
GameMenu 'next' -> GameInvalid;

GameInvalid -> GameMenu;

Hint -> Genre -> GameMenu;
Hint -> Year -> GameMenu;
Hint -> Tagline -> GameMenu;
Hint -> Leads -> GameMenu;
Hint -> Director -> GameMenu;
Hint 'next' -> HintInvalid;

HintInvalid -> Hint;

Guess 'succeed' -> Success -> Menu;
Guess 'failed' -> Failure -> GameMenu;
`;
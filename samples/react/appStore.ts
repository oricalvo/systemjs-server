import {createStore} from "redux";

export interface AppState {
    counter: number;
}

const initialState: AppState = {
    counter: 0,
};

function reducer(state, action) {
    if(action.type == "INC") {
        const counter = state.counter + 1;

        return Object.assign({}, state, {counter: counter});
    }

    return state;
}

export const appStore = createStore(reducer, initialState);

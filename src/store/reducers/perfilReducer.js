
import * as actions from '../actions';

const initialState = {
    perfis: null
}

export default function (state = initialState, action) {
    switch (action.type) {
        case actions.FETCH_PERFIS:
            return {...state, perfis: action.payload };
        case actions.RESET_PERFIS:
            return {...state, perfis: null };
        default:
            return state;
    }
}
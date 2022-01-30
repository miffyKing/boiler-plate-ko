import {
    LOGIN_USER,
    REGISTER_USER,
}from '../_actions/types';


export default function (state = {}, action) {
    switch(action.type){
        case LOGIN_USER:
            return { ...state, loginSuccess: action.payload }                  //비어있는 상태 그대로 독같이 가져오는거.
            break;
        case REGISTER_USER:
            return {...state, register: action.payload}
            break;

        default:
            return state;
    }
}
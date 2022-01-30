import axios from 'axios';
import {
    LOGIN_USER,
    REGISTER_USER
} from './types';

export function loginUser (dataTosubmit){
    
    const request = axios.post('/api/users/login', dataTosubmit)
        .then(response => response.data)
        //서버에서 받은 데이트ㅓ를 request에 저장
    return {
        type: LOGIN_USER,
        payload: request
    }
}

export function registerUser (dataTosubmit){
    
    const request = axios.post('/api/users/register', dataTosubmit)
        .then(response => response.data)
        //서버에서 받은 데이트ㅓ를 request에 저장
    return {
        type: REGISTER_USER,
        payload: request
    }
}


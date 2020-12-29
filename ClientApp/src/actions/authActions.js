import axios from 'axios';
import { returnErrors } from './errorActions'
import { 
    USER_LOADED,
    USER_LOADING,
    AUTH_ERROR,
    LOGIN_FAIL,
    LOGIN_SUCCESS,
    LOGOUT_SUCCESS,
    REGISTER_FAIL,
    REGISTER_SUCCESS
} from './types'

// Check token & load user
export const loadUser = () => (dispatch, getState) => {
    // User loading
    dispatch({ type: USER_LOADING });

    // Fetch user
    axios.get('/api/auth/user', tokenConfig(getState))
        .then(response => dispatch({
            type: USER_LOADED,
            payload: response.data  // This should be user and token
        }))
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));
            dispatch({
                type: AUTH_ERROR
            })
        });
}

// Register User
export const register = ({ name, email, password }) => dispatch => {
    // Headers
    const config = {
        headers: {
            'Content-type': 'application/json'
        }
    }

    // Create request body
    const body = JSON.stringify({ name, email, password })

    axios.post('/api/users', body, config)
        .then(response => dispatch({
            type: REGISTER_SUCCESS,
            payload: response.data
        }))
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status, 'REGISTER_FAIL'));
            dispatch({
            type: REGISTER_FAIL
        })
    })
}

// Logout User
export const logout = () => {
    return {
        type: LOGOUT_SUCCESS
    }
}

// Login user
export const login = ({ email, password }) => dispatch => {
    // Headers
    const config = {
        headers: {
            'Content-type': 'application/json'
        }
    }

    // Create request body
    const body = JSON.stringify({ email, password })

    axios.post('/api/auth', body, config)
        .then(response => dispatch({
            type: LOGIN_SUCCESS,
            payload: response.data
        }))
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status, 'LOGIN_FAIL'));
            dispatch({
            type: LOGIN_FAIL
        })
    })
}

// Setup config/headers and token
export const tokenConfig = getState => {

    // Get token from local storage
    const token = getState().auth.token;

    // Set headers
    const config = {
        headers: {
            'Content-type': 'application/json'
        }
    }

    // If token, add to headers
    if (token) {
        config.headers['x-auth-token'] = token
    }

    return config;
}
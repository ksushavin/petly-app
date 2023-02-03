import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { setAuthHeader, clearAuthHeader } from './authHeaderUtilities';

axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;

export const registerUser = createAsyncThunk(
  'auth/register',
  async (credentials, thunkAPI) => {
    try {
      await axios.post('/users/register', credentials);
    } catch (error) {
      const errorCode = error.response?.data?.code ?? error.message;

      return thunkAPI.rejectWithValue(errorCode);
    }
  }
);

export const logIn = createAsyncThunk(
  'auth/login',
  async (credentials, thunkAPI) => {
    try {
      const { data } = await axios.post('/users/login', credentials);
      setAuthHeader(data.token);
      return data;
    } catch (error) {
      const errorCode = error.response?.data?.code ?? error.message;

      return thunkAPI.rejectWithValue(errorCode);
    }
  }
);

export const logOut = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    await axios.post('users/logout');
    clearAuthHeader();
  } catch (error) {
    const errorCode = error.response?.data?.code ?? error.message;

    return thunkAPI.rejectWithValue(errorCode);
  }
});

export const refreshUser = createAsyncThunk(
  'auth/refresh',
  async (_, thunkAPI) => {
    const currentState = thunkAPI.getState();
    const persistedToken = currentState.auth.token;

    if (!persistedToken)
      return thunkAPI.rejectWithValue('Error: No user to refresh');

    try {
      setAuthHeader(persistedToken);
      const { data } = await axios.get('users/refresh');
      return data;
    } catch (error) {
      const errorCode = error.response?.data?.code ?? error.message;

      return thunkAPI.rejectWithValue(errorCode);
    }
  }
);

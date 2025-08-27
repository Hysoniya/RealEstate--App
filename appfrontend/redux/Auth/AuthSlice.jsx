// import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
console.log('BASE_URL:', BASE_URL);

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    authUser: false,
    userData: null,
    userType: null,
  },
  reducers: {
    setAuthUser: (state, action) => {
      state.authUser = action.payload.authUser;
      state.userData = action.payload.userData;
      state.userType = action.payload.userType;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.authUser = false;
      state.userData = null;
      state.userType = null;
      state.token = null;
    },
  },
});

export const { setAuthUser, logout } = authSlice.actions;

// Helper function to get token from AsyncStorage
const getToken = async () => {
  try {
    return await AsyncStorage.getItem('authToken');
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

export const checkAuth = () => async (dispatch) => {
  try {
    const token = await getToken();
    if (!token) {
      dispatch(setAuthUser({ authUser: false, userData: null, userType: null, token: null }));
      return;
    }

    const response = await axios.get(`${BASE_URL}/api/check-auth`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      dispatch(setAuthUser({
        authUser: true,
        userData: response.data,
        userType: response.data.userType,
        token: token
      }));
    }
  } catch (error) {
    console.error('Error during authentication check', error);
    // Clear invalid token
    await AsyncStorage.removeItem('authToken');
    dispatch(setAuthUser({ authUser: false, userData: null, userType: null, token: null }));
  }
};

export const login = (credentials) => async (dispatch) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/login`, credentials);
    console.log('Login response:', response.data); // Debugging log

    if (response.status === 200) {
      const { token, userType, ...userData } = response.data;
      
      // Store token securely
      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('email', userData.email);
      // await AsyncStorage.setItem('email', userData.email);
      // console.log("DATAAAAAAAAAAAAAAA",userData);
      
      dispatch(setAuthUser({
        authUser: true,
        userData,
        userType,
        token
      }));
      return response.data;
    }
  } catch (error) {
    throw new Error('Login failed: ' + (error.response?.data?.error || error.message));
  }
};

export const signup = (credentials) => async (dispatch) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/signup`, credentials);

    if (response.status === 200) {
      const { token, userType, ...userData } = response.data;
      
      // Store token securely
      await AsyncStorage.setItem('authToken', token);
      
      dispatch(setAuthUser({
        authUser: true,
        userData,
        userType,
        token
      }));
      return response.data;
    }
  } catch (error) {
    throw new Error('Signup failed: ' + (error.response?.data?.error || error.message));
  }
};
export const addEmployee = (credentials) => async (dispatch) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/signup`, credentials);

    // if (response.status === 200) {
    //   const { token, userType, ...userData } = response.data;
      
    //   // Store token securely
    //   await AsyncStorage.setItem('authToken', token);
      
    //   dispatch(setAuthUser({
    //     authUser: true,
    //     userData,
    //     userType,
    //     token
    //   }));
    //   return response.data;
    // }
      return response.data;
  } catch (error) {
    throw new Error('Signup failed: ' + (error.response?.data?.error || error.message));
  }
};

// Add this to handle token persistence on app start
export const initializeAuth = () => async (dispatch) => {
  const token = await getToken();
  if (token) {
    dispatch(checkAuth());
  }
};


export const performLogout = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch }) => {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('email');
      dispatch(logout()); // Call your existing logout reducer
      return true;
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  }
);


export default authSlice.reducer;
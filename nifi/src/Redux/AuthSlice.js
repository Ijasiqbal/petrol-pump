import { createSlice } from '@reduxjs/toolkit'

const getInitialToken = () => {
  const storedToken = localStorage.getItem("auth_token");
  if (storedToken) {
    try {
      return JSON.parse(storedToken);
    } catch (e) {
      localStorage.removeItem("auth_token");
      return null;
    }
  }
  return null;
}

const initialState = {
  authTokenState: getInitialToken(),
  isAuthenticated: !!getInitialToken(),
}

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthToken: (state, action) => {
      state.authTokenState = action.payload;
      state.isAuthenticated = !!action.payload;
      if (action.payload) {
        localStorage.setItem("auth_token", JSON.stringify(action.payload));
      } else {
        localStorage.removeItem("auth_token");
      }
    },
    clearAuthToken: (state) => {
      state.authTokenState = null;
      state.isAuthenticated = false;
      localStorage.removeItem("auth_token");
    }
  },
})

// Action creators are generated for each case reducer function
export const { setAuthToken, clearAuthToken } = authSlice.actions

export default authSlice.reducer
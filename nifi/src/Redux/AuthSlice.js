import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  authTokenState: localStorage.getItem("auth_token") ? JSON.parse(localStorage.getItem("auth_token")) : null,
}

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthToken: (state, action) => {
        console.log('redux called')
      state.authTokenState = action.payload;
      localStorage.setItem("auth_token", JSON.stringify(action.payload));
    },
  },
})

// Action creators are generated for each case reducer function
export const { setAuthToken } = authSlice.actions

export default authSlice.reducer
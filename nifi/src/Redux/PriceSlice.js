import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  petrol: localStorage.getItem("petrol") || '',
  diesel: localStorage.getItem("diesel")  || '',
  extragreen: localStorage.getItem("extragreen") || '',
  extrapriemium: localStorage.getItem("extrapriemium") || '',
};

// Define resetLocalStorage before createSlice
const resetLocalStorage = () => {
  const now = new Date();
  const midnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1, // Set to the next day
    0, // Midnight
    0,
    0
  );

  const timeUntilMidnight = midnight - now;

  setTimeout(() => {
    localStorage.setItem("petrol", '');
    localStorage.setItem("diesel", '');
    localStorage.setItem("extragreen", '');
    localStorage.setItem("extrapriemium", '');

  }, timeUntilMidnight );
};

export const priceSlice = createSlice({
  name: "price",
  initialState,
  reducers: {
    setPetrol: (state, action) => {
      state.petrol = action.payload;
      localStorage.setItem("petrol", action.payload);
      resetLocalStorage();
    },
    setDiesel: (state, action) => {
      state.diesel = action.payload;
      localStorage.setItem("diesel", action.payload);
      resetLocalStorage(); 
    },
    setExtragreen: (state, action) => {
      state.extragreen = action.payload;
      localStorage.setItem("extragreen", action.payload);
      resetLocalStorage(); 
    },
    setExtrapriemium: (state, action) => {
      state.extrapriemium = action.payload;
      localStorage.setItem("extrapriemium", action.payload);
      resetLocalStorage();
    },
  },
});

export const { setPetrol, setDiesel, setExtragreen, setExtrapriemium } = priceSlice.actions;

export default priceSlice.reducer;
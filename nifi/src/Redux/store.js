import { configureStore } from '@reduxjs/toolkit'
import priceReducer from './PriceSlice'
import authReducer from './AuthSlice'

export const store = configureStore({
  reducer: {
    price: priceReducer,
    auth: authReducer,
  },
})
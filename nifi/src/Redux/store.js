import { configureStore } from '@reduxjs/toolkit'
import priceReducer from './PriceSlice'

export const store = configureStore({
  reducer: {
    price: priceReducer,
  },
})
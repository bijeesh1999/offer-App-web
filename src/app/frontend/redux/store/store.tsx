"use client";
import { configureStore } from "@reduxjs/toolkit";
import productSlice from "../slices/product.slice"
import billslice from "../slices/bill.slice"
import offerSlice from "../slices/offer.slice"


export const store = configureStore({
  reducer: {
    products: productSlice,
    bill: billslice,
    offer: offerSlice,
  },
});

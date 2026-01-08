import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios"; // Add this import
import { createBill } from "../../services/bill.service";

// 1. Define the Item within the Bill
interface BillItem {
  productId: string;
  quantity: number;
  discountAmount: number;
  finalPrice: number;
  _id: string;
}

// 2. Define the main Bill response structure
export interface Bill {
  _id: string;
  items: BillItem[];
  totalDiscount: number;
  finalAmount: number;
  createdAt: string;
  __v?: number;
}

// 3. Define the payload we send to the API
interface CreateBillPayload {
  _id: string; // Product ID
  qty: number;
}

// 4. Define the Slice State
interface BillState {
  bills: Bill[];
  bill: Bill | null;
  status: "idle" | "loading" | "created" | "fail";
  isLoading: boolean;
  error: string | null;
}

const initialState: BillState = {
  bills: [],
  bill: null,
  status: "idle",
  isLoading: false,
  error: null,
};

// 5. Typed Thunk: <ReturnType, ParameterType>
export const createNewBill = createAsyncThunk<Bill, CreateBillPayload[]>(
  "bill/create",
  async (body) => {
    const res = (await createBill(body)) as AxiosResponse<Bill>; // Cast to AxiosResponse<Bill>
    return res.data; // Now TypeScript knows 'data' exists
  }
);

const billSlice = createSlice({
  name: "bills",
  initialState,
  reducers: {
    resetStatus: (state) => {
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNewBill.pending, (state) => {
        state.status = "loading";
        state.isLoading = true;
      })
      .addCase(createNewBill.fulfilled, (state, action: PayloadAction<Bill>) => {
        state.status = "created";
        state.bill = action.payload;
        state.isLoading = false;
        // Optionally add the new bill to the list of bills
        if (action.payload) {
          state.bills.unshift(action.payload);
        }
      })
      .addCase(createNewBill.rejected, (state, action) => {
        state.status = "fail";
        state.isLoading = false;
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export const { resetStatus } = billSlice.actions;

export default billSlice.reducer;
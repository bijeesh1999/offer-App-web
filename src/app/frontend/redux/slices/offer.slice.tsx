import { 
  createAsyncThunk, 
  createSlice, 
  PayloadAction, 
  ActionReducerMapBuilder 
} from "@reduxjs/toolkit";
import { AxiosResponse } from "axios"; // Add this import for typing API responses
import {
  createOffer,
  findAllOffers,
} from "../../services/offer.service";

// 1. Define the Shape of an Offer
export interface Offer {
  _id: string;
  name: string;
  type: string;
  priority?: number; // Add the '?' to allow undefined
  // isActive: boolean;
}

interface CreateOfferPayload {
  name: string;
  type: string;
  priority: number;
  config: any;
  startDate: string;
  endDate: string;
}

// 2. Define the Slice State Interface
interface OfferState {
  offers: Offer[];
  offer: Offer | null;
  status: "idle" | "loading" | "created" | "success" | "updated" | "deleted" | "fail";
  isLoading: boolean;
  error: string | null;
}

const initialState: OfferState = {
  offers: [],
  offer: null,
  status: "idle",
  isLoading: false,
  error: null,
};

// 3. Typed Thunks
// Thunk generics: <ReturnType, PayloadType>
export const createNewOffer = createAsyncThunk<Offer, CreateOfferPayload>(  // Return Offer (API response), not CreateOfferPayload
  "offer/create",
  async (body) => {
    const res = await createOffer(body) as AxiosResponse<Offer>;  // Cast to AxiosResponse<Offer>
    return res.data; 
  }
);

export const listOffer = createAsyncThunk<Offer[]>(
  "offer/list", 
  async () => {
    const res = await findAllOffers() as AxiosResponse<Offer[]>;  // Cast to AxiosResponse<Offer[]>
    return res.data; 
  }
);

// export const putOneOffer = createAsyncThunk<Offer, { id: string; limitCents: number }>(
//   "offer/update",
//   async ({ id, limitCents }) => {
//     const res = await updateOffer({ id, body: { limitCents } }) as AxiosResponse<Offer>;  // Wrap limitCents in body object
//     return res.data;
//   }
// );

// export const deleteOneOffer = createAsyncThunk<string, string>(
//   "offer/delete", 
//   async (id) => {
//     await deleteOffer(id);
//     return id; 
//   }
// );

const offerSlice = createSlice({
  name: "offers",
  initialState,
  reducers: {
    resetStatus: (state) => {
      state.status = "idle";
      state.error = null;
    }
  },
  extraReducers: (builder: ActionReducerMapBuilder<OfferState>) => {
    builder
      // Create Offer
      .addCase(createNewOffer.pending, (state) => {
        state.isLoading = true;
        state.status = "loading";
      })
      .addCase(createNewOffer.fulfilled, (state, action: PayloadAction<Offer>) => {
        state.isLoading = false;
        state.status = "created";
        state.offers.push(action.payload);
      })
      .addCase(createNewOffer.rejected, (state, action) => {
        state.isLoading = false;
        state.status = "fail";
        state.error = action.error.message || "Failed to create offer";
      })
      
      // List Offers
      .addCase(listOffer.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(listOffer.fulfilled, (state, action: PayloadAction<Offer[]>) => {
        state.isLoading = false;
        state.status = "success";
        state.offers = action.payload;
      })
      
      // Update Offer
      // .addCase(putOneOffer.fulfilled, (state, action: PayloadAction<Offer>) => {
      //   state.isLoading = false;
      //   state.status = "updated";
      //   const index = state.offers.findIndex(o => o._id === action.payload._id);
      //   if (index !== -1) {
      //     state.offers[index] = action.payload;
      //   }
      // })
      
      // Delete Offer
      // .addCase(deleteOneOffer.fulfilled, (state, action: PayloadAction<string>) => {
      //   state.isLoading = false;
      //   state.status = "deleted";
      //   state.offers = state.offers.filter(o => o._id !== action.payload);
      // })

      // Global Matcher for any rejected offer actions
      .addMatcher(
        (action) => action.type.startsWith("offer/") && action.type.endsWith("/rejected"),
        (state, action: any) => {
          state.isLoading = false;
          state.status = "fail";
          state.error = action.error?.message || "Operation failed";
        }
      );
  },
});

export const { resetStatus } = offerSlice.actions;
export default offerSlice.reducer;
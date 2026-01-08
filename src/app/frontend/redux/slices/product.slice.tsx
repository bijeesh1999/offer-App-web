import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios"; // Add this import for typing API responses
import {
  createProduct,
  deleteProduct,
  findAllProducts,
  updateProduct,
} from "../../services/product.service";

export interface Product {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  // Change this:
  // offers?: [offer:{name: string}]; 
  // To this (Array of objects):
  offers?: []; 
  isActive: boolean;
}

// 2. Define the State Interface
interface ProductState {
  products: Product[];
  currentProduct: Product | null;
  status: "idle" | "loading" | "created" | "success" | "updated" | "deleted" | "fail";
  isLoading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  currentProduct: null,
  status: "idle",
  isLoading: false,
  error: null,
};

// 3. Typed Async Thunks
export const createNewProduct = createAsyncThunk<Product, Partial<Product>>(
  "product/create",
  async (body) => {
    const res = await createProduct(body) as AxiosResponse<Product>; // Cast to AxiosResponse<Product>
    return res.data; // Adjusted to return res.data assuming axios structure
  }
);

export const listProduct = createAsyncThunk<Product[]>(
  "product/list", 
  async () => {
    const res = await findAllProducts() as AxiosResponse<Product[]>; // Cast to AxiosResponse<Product[]>
    return res.data; 
  }
);

export const putOneProduct = createAsyncThunk<Product, { id: string; updateData: any }>(
  "product/update",
  async ({ id, updateData }) => {
    const res = await updateProduct({ id, ...updateData }) as AxiosResponse<Product>; // Cast to AxiosResponse<Product>
    return res.data;
  }
);

export const deleteOneProduct = createAsyncThunk<string, string>(
  "product/delete",
  async (id) => {
    await deleteProduct(id);
    return id; // Return ID to filter from state
  }
);

const ProductSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    resetProductStatus: (state) => {
      state.status = "idle";
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create
      .addCase(createNewProduct.pending, (state) => {
        state.status = "loading";
        state.isLoading = true;
      })
      .addCase(createNewProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.status = "created";
        state.products.push(action.payload);
        state.isLoading = false;
      })
      .addCase(createNewProduct.rejected, (state, action) => {
        state.status = "fail";
        state.error = action.error.message || "Failed to create";
        state.isLoading = false;
      })
      
      // List
      .addCase(listProduct.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.status = "success";
        state.products = action.payload;
        state.isLoading = false;
      })
      
      // Update
      .addCase(putOneProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.status = "updated";
        const index = state.products.findIndex(p => p._id === action.payload._id);
        if (index !== -1) state.products[index] = action.payload;
        state.isLoading = false;
      })
      
      // Delete
      .addCase(deleteOneProduct.fulfilled, (state, action: PayloadAction<string>) => {
        state.status = "deleted";
        state.products = state.products.filter(p => p._id !== action.payload);
        state.isLoading = false;
      });
  },
});

export const { resetProductStatus } = ProductSlice.actions;
export default ProductSlice.reducer;
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios"; // Add this import for typing API responses
import {
  createProduct,
  fileUpload,
  findAllProducts,
} from "../../services/product.service";

export interface Product {
  _id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  // offers?: [offer:{name: string}];
  // To this (Array of objects):
  offers?: [];
  isActive: boolean;
}

// 2. Define the State Interface
interface ProductState {
  products: Product[];
  image: "";
  currentProduct: Product | null;
  status:
    | "idle"
    | "loading"
    | "created"
    | "success"
    | "updated"
    | "deleted"
    | "fail";
  fileStatus:
    | "idle"
    | "loading"
    | "created"
    | "success"
    | "updated"
    | "deleted"
    | "fail";
  isLoading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  image: "",
  currentProduct: null,
  status: "idle",
  fileStatus: "idle",
  isLoading: false,
  error: null,
};

// The response structure from your Cloudinary/S3/Server
export interface UploadResponse {
  url: string;
}

// 3. Typed Async Thunks
export const createNewProduct = createAsyncThunk<Product, Partial<Product>>(
  "product/create",
  async (body) => {
    const res = (await createProduct(body)) as AxiosResponse<Product>; // Cast to AxiosResponse<Product>
    return res.data; // Adjusted to return res.data assuming axios structure
  }
);

export const listProduct = createAsyncThunk<Product[]>(
  "product/list",
  async () => {
    const res = (await findAllProducts()) as AxiosResponse<Product[]>; // Cast to AxiosResponse<Product[]>
    return res.data;
  }
);

export const uploadFile = createAsyncThunk<UploadResponse, File>(
  "file/upload",
  async (file, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append("image", file); // Binary file is attached here

      // Pass formData directly to the service
      const response = await fileUpload(formData);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const ProductSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    resetProductStatus: (state) => {
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create
      .addCase(createNewProduct.pending, (state) => {
        state.status = "loading";
        state.isLoading = true;
      })
      .addCase(
        createNewProduct.fulfilled,
        (state, action: PayloadAction<Product>) => {
          state.status = "created";
          state.products.push(action.payload);
          state.isLoading = false;
        }
      )
      .addCase(createNewProduct.rejected, (state, action) => {
        state.status = "fail";
        state.error = action.error.message || "Failed to create";
        state.isLoading = false;
      })

      // List
      .addCase(
        listProduct.fulfilled,
        (state, action: PayloadAction<Product[]>) => {
          state.status = "success";
          state.products = action.payload;
          state.isLoading = false;
        }
      )

      // file upload

      .addCase(uploadFile.pending, (state) => {
        state.status = "loading";
        state.isLoading = true;
      })
      .addCase(uploadFile.fulfilled, (state, action: PayloadAction<any>) => {
        state.fileStatus = "created";
        state.image = action.payload?.fileUrl;
        state.isLoading = false;
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.status = "fail";
        state.error = action.error.message || "Failed to create";
        state.isLoading = false;
      });
  },
});

export const { resetProductStatus } = ProductSlice.actions;
export default ProductSlice.reducer;

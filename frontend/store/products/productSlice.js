import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import productService from "./productService";

const initialState = {
  products: [],
  // isError: false,
  // isSuccess: false,
  // isLoading: false,
  // message: "",
};

// // Get user products
// export const getProducts = createAsyncThunk(
//   "products/getAll",
//   async (_, thunkAPI) => {
//     try {
//       const token = thunkAPI.getState().auth.user.token;
//       return await productService.getProducts(token);
//     } catch (error) {
//       const message =
//         (error.response &&
//           error.response.data &&
//           error.response.data.message) ||
//         error.message ||
//         error.toString();
//       return thunkAPI.rejectWithValue(message);
//     }
//   }
// );

// export const getProducts = createAsyncThunk(
//   "products/getAll",
//   async (products, thunkAPI) => {
//     try {
//       console.log("inside slice");
//       console.log(products);
//       return products;
//     } catch (error) {
//       const message =
//         (error.response &&
//           error.response.data &&
//           error.response.data.message) ||
//         error.message ||
//         error.toString();
//       return thunkAPI.rejectWithValue(message);
//     }
//   }
// );

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    reset: (state) => initialState,
    getProducts: (state, action) => {
      console.log("adding to store");
      console.log(action.payload);
      state.products = action.payload;
    },
  },
  extraReducers: (builder) => {
    // builder
    // .addCase(getProducts.pending, (state) => {
    //   state.isLoading = true;
    // })
    // .addCase(getProducts.fulfilled, (state, action) => {
    //   console.log("adding product to redux");
    //   console.log(action.payload);
    //   state.isLoading = false;
    //   state.isSuccess = true;
    //   state.products = action.payload;
    // })
    // .addCase(getProducts.rejected, (state, action) => {
    //   state.isLoading = false;
    //   state.isError = true;
    //   state.message = action.payload;
    // });
  },
});

export const { reset, getProducts } = productSlice.actions;
export default productSlice.reducer;

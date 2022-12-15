import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import cartService from "./cartService";

// Get user from localStorage
let cart;
if (typeof window !== "undefined") {
  console.log("You are on the browser");
  // 👉️ can use localStorage here
  // localStorage.removeItem("cart");
  cart = JSON.parse(localStorage.getItem("cart"));
} else {
  console.log("You are on the server");
  // 👉️ can't use localStorage
}

const initialState = {
  cart: cart ? cart : null,
  // cart: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// Create new goal
export const addToCart = createAsyncThunk(
  "cart/add",
  async (cartData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await cartService.addCart(cartData, token);
    } catch (error) {
      let message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      if (!thunkAPI.getState().auth.user) {
        message = "Please LogIn to add to cart";
      }
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create new goal
export const fetchCart = createAsyncThunk("cart/fetch", async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await cartService.fetchCart(token);
  } catch (error) {
    let message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const removeFromCart = createAsyncThunk(
  "cart/remove",
  async (product_id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await cartService.removeFromCart(product_id, token);
    } catch (error) {
      let message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
    // fetchCart: (state, action) => {
    //   state.isLoading = false;
    //   state.isSuccess = true;
    //   state.cart = action.payload;
    //   localStorage.setItem("cart", JSON.stringify(action.payload));
    // },
    resetCart: (state) => {
      state.cart = null;
      localStorage.removeItem("cart");
    },
  },
  // for backend request
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.cart = action.payload;
        localStorage.setItem("cart", JSON.stringify(action.payload));
        // state.goals.push(action.payload)
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false;
        // state.isSuccess = true;
        state.cart = action.payload;
        localStorage.setItem("cart", JSON.stringify(action.payload));
        // state.goals.push(action.payload)
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(removeFromCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.cart = action.payload;
        localStorage.setItem("cart", JSON.stringify(action.payload));
        // state.goals.push(action.payload)
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, resetCart } = cartSlice.actions;
export default cartSlice.reducer;

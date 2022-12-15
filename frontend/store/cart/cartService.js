import axios from "axios";

const API_URL = "http://localhost:5000/api/cart/";

// Add To Cart
const addCart = async (cartData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL, cartData, config);

  console.log(response.data);

  return response.data;
};

// Add To Cart
const fetchCart = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL, config);

  // console.log(response.data);

  return response.data;
};

const removeFromCart = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.delete(API_URL + id, config);

  console.log(response.data);

  return response.data;
};

const cartService = {
  addCart,
  fetchCart,
  removeFromCart,
};

export default cartService;

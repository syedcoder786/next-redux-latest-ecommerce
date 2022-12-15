const express = require("express");
const router = express.Router();
const {
  addToCart,
  fetchCart,
  removeFromCart,
} = require("../controllers/cartController");

const { protect } = require("../middleware/authMiddleware");

router.route("/").post(protect, addToCart).get(protect, fetchCart);
router.route("/:id").delete(protect, removeFromCart);

module.exports = router;

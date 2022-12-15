const express = require("express");
const router = express.Router();
const {
  orderPayment,
  orderSuccess,
} = require("../controllers/paymentController");

const { protect } = require("../middleware/authMiddleware");

// router.route("/").post(protect, addToCart).get(protect, fetchCart);
// router.route("/:id").delete(protect, removeFromCart);
router.route('/orders').post( orderPayment);
router.route('/success').post( orderSuccess);



module.exports = router;

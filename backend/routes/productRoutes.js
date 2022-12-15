const express = require("express");
const router = express.Router();
const {
  getProducts, //read
  getProductById,
  //admin routes
  //   setProduct, //create
  //   updateProduct, //update
  //   deleteProduct, //delete
} = require("../controllers/productController");

// const { protect } = require('../middleware/authMiddleware')

router.route("/").get(getProducts);
router.route("/:id").get(getProductById);
// // admin routes
// .post(protect, setProduct)
// router.route('/:id').delete(protect, deleteProduct).put(protect, updateProduct)

module.exports = router;

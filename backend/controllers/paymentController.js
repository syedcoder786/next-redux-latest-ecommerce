const asyncHandler = require("express-async-handler");
require("dotenv").config();
const Razorpay = require("razorpay");
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");


const orderPayment = asyncHandler(async (req, res) => {
    const {
        price,
        cart
    } = req.body;
    

    try {
        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_SECRET,
        });

        const options = {
            amount: price*100, // amount in smallest currency unit
            currency: "INR",
            receipt: uuidv4(),
        };
        const order = await instance.orders.create(options);
        if (!order) return res.status(500).json("Some error occured");


        const allProductId = cart.product.map((oneProduct) =>  oneProduct._id )
        console.log(allProductId)
        

        console.log("Old order")
        console.log(await Order.find({}))

        await Order.remove({user:cart.user, paid: false})

        console.log("Removed order")
        console.log(await Order.find({}))

        let newOrder = await Order.create({
            user: cart.user,
            product: allProductId,
            orderId: order.id,
            totalPrice: price,
        });

        newOrder = await newOrder.populate("product user");
        console.log(newOrder);

        console.log(order)

        res.json({newOrder, order_id: order.id, currency:"INR" });

    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
});

const orderSuccess = asyncHandler(async (req, res) => {
    try {
        // getting the details back from our font-end
        const {
            orderCreationId,
            razorpayPaymentId,
            razorpayOrderId,
            razorpaySignature,
            orderId,
            userId,
        } = req.body;

        console.log(orderCreationId)
        console.log(razorpayPaymentId)
        console.log(razorpayOrderId)
        console.log(razorpaySignature)

        // Creating our own digest
        // The format should be like this:
        // digest = hmac_sha256(orderCreationId + "|" + razorpayPaymentId, secret);
        const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);

        shasum.update(`${orderCreationId}|${razorpayPaymentId}`);

        const digest = shasum.digest("hex");

        console.log(digest)

        // comaparing our digest with the actual signature
        if (digest !== razorpaySignature)
            return res.status(400).json({ msg: "Transaction not legit!" });

        // THE PAYMENT IS LEGIT & VERIFIED
        // YOU CAN SAVE THE DETAILS IN YOUR DATABASE IF YOU WANT

        try {
            await Order.updateOne({_id: orderId}, { paid: true, paymentId:razorpayPaymentId })

            // console.log("pay order")
            // console.log(await Order.find({_id:orderId}))
            console.log("Before")
            console.log(await Cart.find({user: userId}))

            await Cart.remove({user: userId})

            console.log("After")
            console.log(await Cart.find({user: userId}))

            res.json({
                msg: "Success",
                orderId: razorpayOrderId,
                paymentId: razorpayPaymentId,
            });
        } catch (error) {
            res.status(401).json({ message: "Something went wrong." })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
});


module.exports = {
  orderPayment,
  orderSuccess,
};

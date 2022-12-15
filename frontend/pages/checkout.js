import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useRouter } from 'next/router'
import axios from "axios"
import { useDispatch } from "react-redux";

import { resetCart } from "../store/cart/cartSlice"

const Checkout = () => {

  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    zipcode: "",
    address: "",
    city: "",
    state: "",
    email: "",
    phone: "",
  });

  const dispatch = useDispatch()

  const { fname, lname, zipcode, address, city, state, email, phone } = formData;

  const { cart, isSuccess } = useSelector((state) => state.cart);

  const [hydrated, setHydrated] = useState(false);

  const router = useRouter()

  //razop pay setup

  const loadScript = (src) => {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => {
            resolve(true);
        };
        script.onerror = () => {
            resolve(false);
        };
        document.body.appendChild(script);
    });
}



async function displayRazorpay() {
  const __DEV__ = document.domain = "localhost"
    const res = await loadScript(
        "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
        toast.error("Razorpay SDK failed to load. Are you online?");
        return;
    }

    const result = await axios.post("http://localhost:5000/payment/orders", { price: totalPrice, cart });

    if (!result) {
        toast.error("Server error. Are you online?");
        return;
    }

    const { order_id, currency, newOrder } = result.data;

    const options = {
        key: __DEV__? "rzp_test_O0kB4AvhcsAAYn":"LIVE_KEY", // Enter the Key ID generated from the Dashboard
        amount: newOrder.totalPrice.toString(),
        currency: currency,
        name: "Buy Products",
        description: "Buy Products in ₹ "+newOrder.totalPrice,
        // image: { logo },
        order_id: order_id,
        handler: async (response) => {
            const data = {
                orderCreationId: order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
                orderId: newOrder._id,
                userId: newOrder.user._id,
            };

            try{
              const result = await axios.post("http://localhost:5000/payment/success", data);

              toast.success(result.data.msg);

              setTimeout(() => {
                router.push("/ordercomplete")
              },2000)

              dispatch(resetCart())

            }catch(err){
              console.log(err)
              toast.success(err || err.response.data.message);
            }
        },
        prefill: {
            name: "Test",
            email: "test@example.com",
            contact: "9999999999",
        },
        notes: {
            address: "Test Corporate Office",
        },
        theme: {
            color: "#61dafb",
        },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
}


  const onChange = (e) => {
    console.log(e.target.value)
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
    if(e.target.name === "zipcode"){
      if(e.target.value.length === 6){
        console.log("calling fetchAddress")
        fetchAddress(e.target.value)
      }else{
        setFormData((prevState) => ({
          ...prevState,
          city: "",
          state: "",
        }));
      }
    }
  };

  const fetchAddress = async (pin) => {
    console.log(pin)
    const req = await fetch(`https://api.postalpincode.in/pincode/${pin}`)
    const location = await req.json()
    const status = location[0].Status
    if(status === "Success"){
      const city = location[0].PostOffice[0].Block
      const state = location[0].PostOffice[0].State
      console.log(city)
      console.log(state)
      setFormData((prevState) => ({
        ...prevState,
        city,
        state,
      }));
    }else{
      setFormData((prevState) => ({
        ...prevState,
        city:"",
        state:"",
      }));
    }

  }

  const onSubmit = (e) => {
    e.preventDefault();

    if (!fname.trim() || !lname.trim() || !email || !phone.trim() || !address.trim() || !zipcode) {
      toast.error("Please enter all fields");
      return;
    }
    if (fname.length < 2 || lname.length < 2) {
      toast.error("Name must contain atleast 2 characters");
      return;
    }
    if(address.length < 10){
      toast.error("Address must contain atleast 10 characters");
      return;
    }
    if (zipcode.length !== 6 || !city || !state) {
      toast.error("Incorrect pin/zip code");
      return
    }
    if(!(/^\d{10}$/.test(phone))){
      toast.error("Invalid Phone No.")
      return
    }

    displayRazorpay()
    // else {
    //   const userData = {
    //     name,
    //     email,
    //     password,
    //   };

    //   dispatch(register(userData));
    // }
  };

  const [totalPrice, setTotalPrice] = useState(0);
  // let cartItems=""

  useEffect(() => {
    setHydrated(true)
    // const __DEV__ = document.domain = "localhost"
    if (cart) {
      const result = cart.product.reduce((sum, { price }) => sum + price, 0);
      setTotalPrice(result);
      console.log(result);
      // cartItems = cart.product.map(product => (
      //   <li>
      //     <span>1 x {product.name}</span> <span>${product.price}</span>
      //   </li>
      // ))
    }
  }, [])

  if(!hydrated){
    return <></>
  }
  
  let cartItems = ""
  if(cart && cart.product.length !== 0){
    // console.log("cart there")
    cartItems = cart.product.map(product => (
      <li>
        <span>1 x {product.name}</span> <span>₹{product.price}</span>
      </li>
    ))
  }else{
    console.log("cart not there")
    router.push("/cart")
  }

  return (
    <div>
      <div id="page">
        {/* <nav class="colorlib-nav" role="navigation">
          <div class="top-menu">
            <div class="container">
              <div class="row">
                <div class="col-xs-2">
                  <div id="colorlib-logo">
                    <a href="index.html">Store</a>
                  </div>
                </div>
                <div class="col-xs-10 text-right menu-1">
                  <ul>
                    <li>
                      <a href="index.html">Home</a>
                    </li>
                    <li class="has-dropdown active">
                      <a href="shop.html">Shop</a>
                      <ul class="dropdown">
                        <li>
                          <a href="product-detail.html">Product Detail</a>
                        </li>
                        <li>
                          <a href="cart.html">Shipping Cart</a>
                        </li>
                        <li>
                          <a href="checkout.html">Checkout</a>
                        </li>
                        <li>
                          <a href="order-complete.html">Order Complete</a>
                        </li>
                        <li>
                          <a href="add-to-wishlist.html">Wishlist</a>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <a href="blog.html">Blog</a>
                    </li>
                    <li>
                      <a href="about.html">About</a>
                    </li>
                    <li>
                      <a href="contact.html">Contact</a>
                    </li>
                    <li>
                      <a href="cart.html">
                        <i class="icon-shopping-cart"></i> Cart [0]
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </nav> */}
        {/* <aside id="colorlib-hero" class="breadcrumbs">
          <div class="flexslider">
            <ul class="slides">
              <li style={{ backgroundImage: `url(images/cover-img-1.jpg)` }}>
                <div class="overlay"></div>
                <div class="container-fluid">
                  <div class="row">
                    <div class="col-md-6 col-md-offset-3 col-sm-12 col-xs-12 slider-text">
                      <div class="slider-text-inner text-center">
                        <h1>Checkout</h1>
                        <h2 class="bread">
                          <span>
                            <a href="index.html">Home</a>
                          </span>{" "}
                          <span>
                            <a href="cart.html">Shopping Cart</a>
                          </span>{" "}
                          <span>Checkout</span>
                        </h2>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </aside> */}

        <div class="colorlib-shop">
          <div class="container">
            <div class="row row-pb-md">
              <div class="col-md-10 col-md-offset-1">
                <div class="process-wrap">
                  <div class="process text-center active">
                    <p>
                      <span>01</span>
                    </p>
                    <h3>Shopping Cart</h3>
                  </div>
                  <div class="process text-center active">
                    <p>
                      <span>02</span>
                    </p>
                    <h3>Checkout</h3>
                  </div>
                  <div class="process text-center">
                    <p>
                      <span>03</span>
                    </p>
                    <h3>Order Complete</h3>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-7">
                <form method="post" class="colorlib-form">
                  <h2>Billing Details</h2>
                  <div class="row">
                    <div class="col-md-12">
                      {/* <div class="form-group">
                        <label for="country">Select Country</label>
                        <div class="form-field">
                          <i class="icon icon-arrow-down3"></i>
                          <select
                            name="people"
                            id="people"
                            class="form-control"
                          >
                            <option value="#">Select country</option>
                            <option value="#">Alaska</option>
                            <option value="#">China</option>
                            <option value="#">Japan</option>
                            <option value="#">Korea</option>
                            <option value="#">Philippines</option>
                          </select>
                        </div>
                      </div> */}
                    </div>
                    <div class="form-group">
                      <div class="col-md-6">
                        <label for="fname">First Name</label>
                        <input
                          type="text"
                          name="fname"
                          class="form-control"
                          placeholder="Your firstname"
                          onChange={onChange}
                          value={fname}
                        />
                      </div>
                      <div class="col-md-6">
                        <label for="lname">Last Name</label>
                        <input
                          type="text"
                          name="lname"
                          class="form-control"
                          placeholder="Your lastname"
                          onChange={onChange}
                          value={lname}
                        />
                      </div>
                    </div>
                    <div class="col-md-12">
                      <div class="form-group">
                        <label for="companyname">Pin/Zip Code</label>
                        <input
                          type="text"
                          name="zipcode"
                          id="companyname"
                          class="form-control"
                          placeholder="Pin/Zip Code"
                          onChange={onChange}
                          value={zipcode}
                        />
                      </div>
                    </div>
                    <div class="col-md-12">
                      <div class="form-group">
                        <label for="fname">Address</label>
                        <input
                          type="text"
                          name="address"
                          class="form-control"
                          placeholder="Enter Your Address"
                          onChange={onChange}
                          value={address}
                        />
                      </div>
                      {/* <div class="form-group">
                        <input
                          type="text"
                          id="address2"
                          class="form-control"
                          placeholder="Second Address"
                        />
                      </div> */}
                    </div>
                    {/* <div class="col-md-12">
                      <div class="form-group">
                        <label for="companyname">Town/City</label>
                        <input
                          type="text"
                          id="towncity"
                          class="form-control"
                          placeholder="Town or City"
                        />
                      </div>
                    </div> */}
                    <div class="form-group">
                      <div class="col-md-6">
                        <label for="stateprovince">Town/City</label>
                        <input
                          type="text"
                          name="city"
                          class="form-control"
                          placeholder="Town or City"
                          onChange={onChange}
                          value={city}
                          disabled
                        />
                      </div>
                      <div class="col-md-6">
                        <label for="lname">State</label>
                        <input
                          type="text"
                          name="state"
                          class="form-control"
                          placeholder="State"
                          onChange={onChange}
                          value={state}
                          disabled
                        />
                      </div>
                    </div>
                    <div class="form-group">
                      <div class="col-md-6">
                        <label for="email">E-mail Address</label>
                        <input
                          type="email"
                          name="email"
                          class="form-control"
                          placeholder="Email"
                          onChange={onChange}
                          value={email}
                        />
                      </div>
                      <div class="col-md-6">
                        <label for="Phone">Phone Number</label>
                        <input
                          type="text"
                          name="phone"
                          class="form-control"
                          placeholder="Phone"
                          onChange={onChange}
                          value={phone}
                        />
                      </div>
                    </div>
                    {/* <div class="form-group">
                      <div class="col-md-12">
                        <div class="radio">
                          <label>
                            <input type="radio" name="optradio" />
                            Create an Account?{" "}
                          </label>
                          <label>
                            <input type="radio" name="optradio" /> Ship to
                            different address
                          </label>
                        </div>
                      </div>
                    </div> */}
                  </div>
                </form>
              </div>
              <div class="col-md-5">
                <div class="cart-detail">
                  <h2>Cart Total</h2>
                  <ul>
                    <li>
                      <span>Subtotal</span> <span>₹{totalPrice}</span>
                      <ul>
                        {/* <li>
                          <span>1 x Product Name</span> <span>₹99.00</span>
                        </li>
                        <li>
                          <span>1 x Product Name</span> <span>₹78.00</span>
                        </li> */}
                        {cartItems}
                      </ul>
                    </li>
                    {/* <li>
                      <span>Shipping</span> <span>₹0.00</span>
                    </li> */}
                    <li>
                      <span>Order Total</span> <span>₹{totalPrice}</span>
                    </li>
                  </ul>
                </div>
                <div class="cart-detail">
                  <h2>Payment Method</h2>
                  <div class="form-group">
                    <div class="col-md-12">
                      <div class="radio">
                        <label>
                          <input type="radio" name="optradio" checked/>
                          Razorpay
                        </label>
                      </div>
                    </div>
                  </div>
                  {/* <div class="form-group">
                    <div class="col-md-12">
                      <div class="radio">
                        <label>
                          <input type="radio" name="optradio" />
                          Check Payment
                        </label>
                      </div>
                    </div>
                  </div> */}
                  {/* <div class="form-group">
                    <div class="col-md-12">
                      <div class="radio">
                        <label>
                          <input type="radio" name="optradio" />
                          Paypal
                        </label>
                      </div>
                    </div>
                  </div> */}
                  {/* <div class="form-group">
                    <div class="col-md-12">
                      <div class="checkbox">
                        <label>
                          <input type="checkbox" value="" />I have read and
                          accept the terms and conditions
                        </label>
                      </div>
                    </div>
                  </div> */}
                </div>
                <div class="row">
                  <div class="col-md-12">
                    <p>
                      <a href="#" class="btn btn-primary" onClick={onSubmit}>
                        Place an order
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="colorlib-shop">
          <div class="container">
            <div class="row">
              <div class="col-md-6 col-md-offset-3 text-center colorlib-heading">
                <h2>
                  <span>Recommended Products</span>
                </h2>
                <p>
                  We love to tell our successful far far away, behind the word
                  mountains, far from the countries Vokalia and Consonantia,
                  there live the blind texts.
                </p>
              </div>
            </div>
            <div class="row">
              <div class="col-md-3 text-center">
                <div class="product-entry">
                  <div
                    class="product-img"
                    style={{ backgroundImage: `url(images/item-5.jpg)` }}
                  >
                    <p class="tag">
                      <span class="new">New</span>
                    </p>
                    <div class="cart">
                      <p>
                        <span class="addtocart">
                          <a href="#">
                            <i class="icon-shopping-cart"></i>
                          </a>
                        </span>
                        <span>
                          <a href="product-detail.html">
                            <i class="icon-eye"></i>
                          </a>
                        </span>
                        <span>
                          <a href="#">
                            <i class="icon-heart3"></i>
                          </a>
                        </span>
                        <span>
                          <a href="add-to-wishlist.html">
                            <i class="icon-bar-chart"></i>
                          </a>
                        </span>
                      </p>
                    </div>
                  </div>
                  <div class="desc">
                    <h3>
                      <a href="shop.html">Floral Dress</a>
                    </h3>
                    <p class="price">
                      <span>₹300.00</span>
                    </p>
                  </div>
                </div>
              </div>
              <div class="col-md-3 text-center">
                <div class="product-entry">
                  <div
                    class="product-img"
                    style={{ backgroundImage: `url(images/item-6.jpg)` }}
                  >
                    <p class="tag">
                      <span class="new">New</span>
                    </p>
                    <div class="cart">
                      <p>
                        <span class="addtocart">
                          <a href="#">
                            <i class="icon-shopping-cart"></i>
                          </a>
                        </span>
                        <span>
                          <a href="product-detail.html">
                            <i class="icon-eye"></i>
                          </a>
                        </span>
                        <span>
                          <a href="#">
                            <i class="icon-heart3"></i>
                          </a>
                        </span>
                        <span>
                          <a href="add-to-wishlist.html">
                            <i class="icon-bar-chart"></i>
                          </a>
                        </span>
                      </p>
                    </div>
                  </div>
                  <div class="desc">
                    <h3>
                      <a href="shop.html">Floral Dress</a>
                    </h3>
                    <p class="price">
                      <span>₹300.00</span>
                    </p>
                  </div>
                </div>
              </div>
              <div class="col-md-3 text-center">
                <div class="product-entry">
                  <div
                    class="product-img"
                    style={{ backgroundImage: `url(images/item-7.jpg)` }}
                  >
                    <p class="tag">
                      <span class="new">New</span>
                    </p>
                    <div class="cart">
                      <p>
                        <span class="addtocart">
                          <a href="#">
                            <i class="icon-shopping-cart"></i>
                          </a>
                        </span>
                        <span>
                          <a href="product-detail.html">
                            <i class="icon-eye"></i>
                          </a>
                        </span>
                        <span>
                          <a href="#">
                            <i class="icon-heart3"></i>
                          </a>
                        </span>
                        <span>
                          <a href="add-to-wishlist.html">
                            <i class="icon-bar-chart"></i>
                          </a>
                        </span>
                      </p>
                    </div>
                  </div>
                  <div class="desc">
                    <h3>
                      <a href="shop.html">Floral Dress</a>
                    </h3>
                    <p class="price">
                      <span>₹300.00</span>
                    </p>
                  </div>
                </div>
              </div>
              <div class="col-md-3 text-center">
                <div class="product-entry">
                  <div
                    class="product-img"
                    style={{ backgroundImage: `url(images/item-8.jpg)` }}
                  >
                    <p class="tag">
                      <span class="new">New</span>
                    </p>
                    <div class="cart">
                      <p>
                        <span class="addtocart">
                          <a href="#">
                            <i class="icon-shopping-cart"></i>
                          </a>
                        </span>
                        <span>
                          <a href="product-detail.html">
                            <i class="icon-eye"></i>
                          </a>
                        </span>
                        <span>
                          <a href="#">
                            <i class="icon-heart3"></i>
                          </a>
                        </span>
                        <span>
                          <a href="add-to-wishlist.html">
                            <i class="icon-bar-chart"></i>
                          </a>
                        </span>
                      </p>
                    </div>
                  </div>
                  <div class="desc">
                    <h3>
                      <a href="shop.html">Floral Dress</a>
                    </h3>
                    <p class="price">
                      <span>₹300.00</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="colorlib-subscribe">
          <div class="overlay"></div>
          <div class="container">
            <div class="row">
              <div class="col-md-8 col-md-offset-2">
                <div class="col-md-6 text-center">
                  <h2>
                    <i class="icon-paperplane"></i>Sign Up for a Newsletter
                  </h2>
                </div>
                <div class="col-md-6">
                  <form class="form-inline qbstp-header-subscribe">
                    <div class="row">
                      <div class="col-md-12 col-md-offset-0">
                        <div class="form-group">
                          <input
                            type="text"
                            class="form-control"
                            id="email"
                            placeholder="Enter your email"
                          />
                          <button type="submit" class="btn btn-primary">
                            Subscribe
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <footer id="colorlib-footer" role="contentinfo">
        <div class="container">
            <div class="row row-pb-md">
                <div class="col-md-3 colorlib-widget">
                    <h4>About Store</h4>
                    <p>Facilis ipsum reprehenderit nemo molestias. Aut cum mollitia reprehenderit. Eos cumque dicta adipisci architecto culpa amet.</p>
                    <p>
                        <ul class="colorlib-social-icons">
                            <li><a href="#"><i class="icon-twitter"></i></a></li>
                            <li><a href="#"><i class="icon-facebook"></i></a></li>
                            <li><a href="#"><i class="icon-linkedin"></i></a></li>
                            <li><a href="#"><i class="icon-dribbble"></i></a></li>
                        </ul>
                    </p>
                </div>
                <div class="col-md-2 colorlib-widget">
                    <h4>Customer Care</h4>
                    <p>
                        <ul class="colorlib-footer-links">
                            <li><a href="#">Contact</a></li>
                            <li><a href="#">Returns/Exchange</a></li>
                            <li><a href="#">Gift Voucher</a></li>
                            <li><a href="#">Wishlist</a></li>
                            <li><a href="#">Special</a></li>
                            <li><a href="#">Customer Services</a></li>
                            <li><a href="#">Site maps</a></li>
                        </ul>
                    </p>
                </div>
                <div class="col-md-2 colorlib-widget">
                    <h4>Information</h4>
                    <p>
                        <ul class="colorlib-footer-links">
                            <li><a href="#">About us</a></li>
                            <li><a href="#">Delivery Information</a></li>
                            <li><a href="#">Privacy Policy</a></li>
                            <li><a href="#">Support</a></li>
                            <li><a href="#">Order Tracking</a></li>
                        </ul>
                    </p>
                </div>

                <div class="col-md-2">
                    <h4>News</h4>
                    <ul class="colorlib-footer-links">
                        <li><a href="blog.html">Blog</a></li>
                        <li><a href="#">Press</a></li>
                        <li><a href="#">Exhibitions</a></li>
                    </ul>
                </div>

                <div class="col-md-3">
                    <h4>Contact Information</h4>
                    <ul class="colorlib-footer-links">
                        <li>291 South 21th Street, <br> Suite 721 New York NY 10016</li>
                        <li><a href="tel://1234567920">+ 1235 2355 98</a></li>
                        <li><a href="mailto:info@yoursite.com">info@yoursite.com</a></li>
                        <li><a href="#">yoursite.com</a></li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="copy">
            <div class="row">
                <div class="col-md-12 text-center">
                    <p>
                        
                        <span class="block"><!-- Link back to Colorlib can't be removed. Template is licensed under CC BY 3.0. -->
Copyright &copy;<script>document.write(new Date().getFullYear());</script> All rights reserved | This template is made with <i class="icon-heart2" aria-hidden="true"></i> by <a href="https://colorlib.com" target="_blank">Colorlib</a>
<!-- Link back to Colorlib can't be removed. Template is licensed under CC BY 3.0. --></span> 
                        <span class="block">Demo Images: <a href="http://unsplash.co/" target="_blank">Unsplash</a> , <a href="http://pexels.com/" target="_blank">Pexels.com</a></span>
                    </p>
                </div>
            </div>
        </div>
    </footer> */}
      </div>
    </div>
  );
};

export default Checkout;

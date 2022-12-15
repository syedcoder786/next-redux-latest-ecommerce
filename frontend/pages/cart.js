import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, reset } from "../store/cart/cartSlice";
import { useRouter } from "next/router";

function Cart(props) {
  const { cart, isSuccess } = useSelector((state) => state.cart);
  const [totalPrice, setTotalPrice] = useState(0);
  let cartItems = null;
  const dispatch = useDispatch();
  const [hydrated, setHydrated] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setHydrated(true);
    if (cart) {
      const result = cart.product.reduce((sum, { price }) => sum + price, 0);
      setTotalPrice(result);
      console.log(result);
    }
  }, []);

  useEffect(() => {
    if (isSuccess) {
      const result = cart.product.reduce((sum, { price }) => sum + price, 0);
      setTotalPrice(result);
    }
    dispatch(reset());
  }, [isSuccess]);

  if (!hydrated) {
    return <></>;
  }

  // if (Object.keys(cart).length !== 0) {
  if (cart) {
    // useEffect(() => {
    //   // setHydrated(true);
    //   const result = cart.product.reduce((sum, { price }) => sum + price, 0);
    //   setTotalPrice(result);
    //   console.log(result);
    // }, []);

    cartItems = cart.product.map((oneProduct) => (
      <>
        <div class="product-cart">
          <div class="one-forth">
            <div
              class="product-img"
              style={{ backgroundImage: `url(${oneProduct.image})` }}
            ></div>
            <div class="display-tc">
              <h3>{oneProduct.name}</h3>
            </div>
          </div>
          <div class="one-eight text-center">
            <div class="display-tc">
              <span class="price">${oneProduct.price}</span>
            </div>
          </div>
          <div class="one-eight text-center">
            <div class="display-tc">
              <input
                type="text"
                id="quantity"
                name="quantity"
                class="form-control input-number text-center"
                value="1"
                min="1"
                max="100"
              />
            </div>
          </div>
          <div class="one-eight text-center">
            <div class="display-tc">
              <span class="price">${oneProduct.price}</span>
            </div>
          </div>
          <div class="one-eight text-center">
            <div class="display-tc">
              <a
                // href="#"
                style={{ cursor: "pointer" }}
                class="closed"
                onClick={() => {
                  dispatch(removeFromCart(oneProduct._id));
                }}
              ></a>
            </div>
          </div>
        </div>
      </>
    ));
  }
  // else {
  //   useEffect(() => {
  //     setHydrated(true);
  //   }, []);
  // }

  // if (!hydrated) {
  //   return <></>;
  // }
  return (
    <div>
      <div id="page">
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
                  <div class="process text-center">
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
            {cartItems && cart.product.length > 0 && (
              <div class="row row-pb-md">
                <div class="col-md-10 col-md-offset-1">
                  <div class="product-name">
                    <div class="one-forth text-center">
                      <span>Product Details</span>
                    </div>
                    <div class="one-eight text-center">
                      <span>Price</span>
                    </div>
                    <div class="one-eight text-center">
                      <span>Quantity</span>
                    </div>
                    <div class="one-eight text-center">
                      <span>Total</span>
                    </div>
                    <div class="one-eight text-center">
                      <span>Remove</span>
                    </div>
                  </div>
                  {/* one child */}
                  {cartItems}
                  {/* <div class="product-cart">
                  <div class="one-forth">
                    <div
                      class="product-img"
                      style={{ backgroundImage: `url(images/item-6.jpg)` }}
                    ></div>
                    <div class="display-tc">
                      <h3>Product Name</h3>
                    </div>
                  </div>
                  <div class="one-eight text-center">
                    <div class="display-tc">
                      <span class="price">$68.00</span>
                    </div>
                  </div>
                  <div class="one-eight text-center">
                    <div class="display-tc">
                      <input
                        type="text"
                        id="quantity"
                        name="quantity"
                        class="form-control input-number text-center"
                        value="1"
                        min="1"
                        max="100"
                      />
                    </div>
                  </div>
                  <div class="one-eight text-center">
                    <div class="display-tc">
                      <span class="price">$120.00</span>
                    </div>
                  </div>
                  <div class="one-eight text-center">
                    <div class="display-tc">
                      <a href="#" class="closed"></a>
                    </div>
                  </div>
                </div> */}
                  {/* <div class="product-cart">
                  <div class="one-forth">
                    <div
                      class="product-img"
                      style={{ backgroundImage: `url(images/item-7.jpg)` }}
                    ></div>
                    <div class="display-tc">
                      <h3>Product Name</h3>
                    </div>
                  </div>
                  <div class="one-eight text-center">
                    <div class="display-tc">
                      <span class="price">$68.00</span>
                    </div>
                  </div>
                  <div class="one-eight text-center">
                    <div class="display-tc">
                      <form action="#">
                        <input
                          type="text"
                          name="quantity"
                          class="form-control input-number text-center"
                          value="1"
                          min="1"
                          max="100"
                        />
                      </form>
                    </div>
                  </div>
                  <div class="one-eight text-center">
                    <div class="display-tc">
                      <span class="price">$120.00</span>
                    </div>
                  </div>
                  <div class="one-eight text-center">
                    <div class="display-tc">
                      <a href="#" class="closed"></a>
                    </div>
                  </div>
                </div> */}
                  {/* <div class="product-cart">
                  <div class="one-forth">
                    <div
                      class="product-img"
                      style={{ backgroundImage: `url(images/item-8.jpg)` }}
                    ></div>
                    <div class="display-tc">
                      <h3>Product Name</h3>
                    </div>
                  </div>
                  <div class="one-eight text-center">
                    <div class="display-tc">
                      <span class="price">$68.00</span>
                    </div>
                  </div>
                  <div class="one-eight text-center">
                    <div class="display-tc">
                      <input
                        type="text"
                        id="quantity"
                        name="quantity"
                        class="form-control input-number text-center"
                        value="1"
                        min="1"
                        max="100"
                      />
                    </div>
                  </div>
                  <div class="one-eight text-center">
                    <div class="display-tc">
                      <span class="price">$120.00</span>
                    </div>
                  </div>
                  <div class="one-eight text-center">
                    <div class="display-tc">
                      <a href="#" class="closed"></a>
                    </div>
                  </div>
                </div> */}
                </div>
              </div>
            )}
            {cartItems && cart.product.length > 0 ? (
              <div class="row">
                <div class="col-md-10 col-md-offset-1">
                  <div class="total-wrap">
                    <div class="row">
                      <div class="col-md-8">
                        <form action="#">
                          <div class="row form-group">
                            {/* <div class="col-md-9">
                              <input
                                type="text"
                                name="quantity"
                                class="form-control input-number"
                                placeholder="Your Coupon Number..."
                              />
                            </div> */}
                            <div class="col-md-3">
                              <input
                                type="submit"
                                value="Check Out"
                                class="btn btn-primary"
                                onClick={(e) => {
                                  e.preventDefault();
                                  router.push("/checkout");
                                }}
                              />
                            </div>
                          </div>
                        </form>
                      </div>
                      <div class="col-md-3 col-md-push-1 text-center">
                        <div class="total">
                          <div class="sub">
                            <p>
                              <span>Subtotal:</span> <span>${totalPrice}</span>
                            </p>
                            <p>
                              <span>Delivery:</span> <span>$0.00</span>
                            </p>
                            <p>
                              <span>Discount:</span> <span>$45.00</span>
                            </p>
                          </div>
                          <div class="grand-total">
                            <p>
                              <span>
                                <strong>Total:</strong>
                              </span>{" "}
                              <span>${totalPrice}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <center>
                <h2>
                  Cart is empty <br />
                  <br />
                  <Link href="/shop">Shop Now</Link>
                </h2>
              </center>
            )}
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
                      <span>$300.00</span>
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
                      <span>$300.00</span>
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
                      <span>$300.00</span>
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
                      <span>$300.00</span>
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

      <div class="gototop js-top">
        <a href="#" class="js-gotop">
          <i class="icon-arrow-up2"></i>
        </a>
      </div>
    </div>
  );
}

export default Cart;

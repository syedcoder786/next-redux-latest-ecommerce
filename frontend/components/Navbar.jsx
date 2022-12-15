import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { logout, reset } from "../store/auth/authSlice";
import { resetCart } from "../store/cart/cartSlice";

function Navbar(props) {
  const { user } = useSelector((state) => state.auth);
  const [hydrated, setHydrated] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return <></>;
  }

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    dispatch(resetCart());
  };

  return (
    <div>
      <nav class="colorlib-nav" role="navigation">
        <div class="top-menu">
          <div class="container">
            <div class="row">
              <div class="col-xs-2">
                <div id="colorlib-logo">
                  <Link href="/home">Store</Link>
                </div>
              </div>
              <div class="col-xs-10 text-right menu-1">
                <ul>
                  <li>
                    <Link href="/home">Home</Link>
                  </li>
                  <li>
                    <Link href="/shop">Shop</Link>
                  </li>
                  <li>
                    {user && typeof window !== "undefined" ? (
                      <Link href="#">
                        <a onClick={onLogout}>Logout</a>
                      </Link>
                    ) : (
                      <Link href="/login">
                        <a>Login</a>
                      </Link>
                    )}
                  </li>
                  <li>
                    <Link href="/about">
                      <a>About</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact">
                      <a>Contact</a>
                    </Link>
                  </li>
                  <li>
                    <i class="icon-shopping-cart"></i>
                    <Link href="/cart">
                      <a>Cart [0]</a>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;

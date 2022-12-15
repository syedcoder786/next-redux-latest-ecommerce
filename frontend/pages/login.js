import Link from "next/link";
import React, { useState, useEffect } from "react";
import { login, reset } from "../store/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { fetchCart } from "../store/cart/cartSlice";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const dispatch = useDispatch();
  const router = useRouter();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess || user) {
      dispatch(fetchCart());
      router.push("/home");
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, dispatch]);

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const userData = {
      email,
      password,
    };

    dispatch(login(userData));
  };

  return (
    <div style={{ width: "50%", margin: "auto" }}>
      <form onSubmit={onSubmit}>
        <h3>Sign In</h3>
        <div className="mb-3">
          <label>Email address</label>
          <input
            name="email"
            type="email"
            className="form-control"
            placeholder="Enter email"
            value={email}
            onChange={onChange}
          />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input
            name="password"
            type="password"
            className="form-control"
            placeholder="Enter password"
            value={password}
            onChange={onChange}
          />
        </div>
        <div className="mb-3">
          <div className="custom-control custom-checkbox">
            <input
              type="checkbox"
              className="custom-control-input"
              id="customCheck1"
            />
            {/* <label className="custom-control-label" htmlFor="customCheck1">
              Remember me
            </label> */}
          </div>
        </div>
        <div className="d-grid">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
        <p className="forgot-password text-right">
          Don't have an account? <Link href="/signup">Sign Up</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;

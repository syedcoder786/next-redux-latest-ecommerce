import Link from "next/link";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { register, reset } from "../store/auth/authSlice";
import { useRouter } from "next/router";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });

  const { name, email, password, password2 } = formData;

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
      router.push("/home");
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.error("Please enter all fields");
      return;
    }
    if (name.length <= 3 || name.length >= 10) {
      toast.error("Name must contain 3-10 characters");
      return;
    }
    if (password !== password2) {
      toast.error("Passwords do not match");
    } else {
      const userData = {
        name,
        email,
        password,
      };

      dispatch(register(userData));
    }
  };

  return (
    <div style={{ width: "50%", margin: "auto" }}>
      <form onSubmit={onSubmit}>
        <h3>Sign Up</h3>
        <div className="mb-3">
          <label>Name</label>
          <input
            name="name"
            type="text"
            className="form-control"
            placeholder="Name"
            value={name}
            onChange={onChange}
          />
        </div>
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
          <label>Confirm Password</label>
          <input
            name="password2"
            type="password"
            className="form-control"
            placeholder="Confirm password"
            value={password2}
            onChange={onChange}
          />
        </div>
        <div className="d-grid">
          <button type="submit" className="btn btn-primary">
            Sign Up
          </button>
        </div>
        <p className="forgot-password text-right">
          Already registered? <Link href="/login">Sign in</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;

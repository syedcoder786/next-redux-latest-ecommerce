import "../styles/globals.css";
import "./css/animate.css";
import "./css/icomoon.css";
import "./css/bootstrap.css";
import "./css/magnific-popup.css";
import "./css/flexslider.css";
import "./css/owl.carousel.min.css";
import "./css/owl.theme.default.min.css";
import "./css/bootstrap-datepicker.css";
import "./fonts/flaticon/font/flaticon.css";
import "./css/style.css";
import Navbar from "../components/Navbar";
import NextNProgress from "nextjs-progressbar";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { wrapper } from "../store/store";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <NextNProgress />
      <Navbar />
      <Component {...pageProps} />
      <ToastContainer />
    </>
  );
}

export default wrapper.withRedux(MyApp);

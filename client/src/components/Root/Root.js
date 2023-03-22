import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";

const Root = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }
    return navigate("/profile");
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

export default Root;

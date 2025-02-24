import { Outlet, useLocation } from "react-router-dom";
import NavBar from "./NavBar";

const Layout = () => {
  const location = useLocation();

  // Hide NavBar for Login and Register pages
  const hideNavBar = location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      {!hideNavBar && <NavBar />}
      <Outlet />
    </>
  );
};

export default Layout;

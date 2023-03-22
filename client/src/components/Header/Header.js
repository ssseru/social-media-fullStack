import { useDispatch, useSelector } from "react-redux";
import { Navigate, NavLink, useNavigate } from "react-router-dom";
import { Navbar, Nav, NavItem } from "reactstrap";
import { logout } from "../../features/auth/authSlice";
import { useEffect } from "react";
import { setToken } from "../../features/auth/authSlice";

import styles from "./Header.module.css";

const Header = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (token) {
      dispatch(setToken({ token: token, userId: userId }));
    }
    return navigate("/");
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    dispatch(logout());
    Navigate("/login");
  };

  return (
    <Navbar dark className={styles.header}>
      <NavLink to="/" className={styles.brand}>
        ChatMore
      </NavLink>
      <Nav>
        {!isLoggedIn && (
          <>
            <NavItem>
              <NavLink
                to="/login"
                className={({ isActive, isPending }) => {
                  return isActive ? styles.navItemActive : styles.navItem;
                }}
              >
                Login
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                to="/signup"
                className={({ isActive, isPending }) => {
                  return isActive ? styles.navItemActive : styles.navItem;
                }}
              >
                Signup
              </NavLink>
            </NavItem>
          </>
        )}
        {isLoggedIn && (
          <>
            <NavItem>
              <NavLink
                to="/profile"
                className={({ isActive, isPending }) => {
                  return isActive ? styles.navItemActive : styles.navItem;
                }}
              >
                Profile
              </NavLink>
              {/* <Link to="/profile" className={styles.navItem}>
                Profile
              </Link> */}
            </NavItem>
            <NavItem>
              <NavLink
                to="/connections"
                className={({ isActive, isPending }) => {
                  return isActive ? styles.navItemActive : styles.navItem;
                }}
              >
                Connections
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={styles.navItem}
                onClick={() => {
                  handleLogout();
                }}
              >
                Logout
              </NavLink>
            </NavItem>
          </>
        )}
      </Nav>
    </Navbar>
  );
};

export default Header;

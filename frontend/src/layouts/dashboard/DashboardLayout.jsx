import { Divider, styled } from "@mui/material";
import { Outlet } from "react-router-dom";
import Nav from "../../components/nav/Nav";
import Header from "../../components/header/Header";
import PropTypes from "prop-types";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import useScrollPosition from "../../hooks/useScrollPosition";

const DashboardLayout = ({ children }) => {
  const [openSidebar, setOpenSidebar] = useState(true);

  const APP_BAR_MOBILE = 30;
  const APP_BAR_DESKTOP = 50;

  const StyledRoot = styled("div")({
    display: "flex",
    minHeight: "100%",
    // overflow: "hidden",
    height: "100vh",
  });

  const Main = styled("div")(({ theme }) => ({
    flexGrow: 1,
    position: "relative",
    // overflow: "scroll",
    // minHeight: "100%",
    // paddingTop: APP_BAR_MOBILE,
    // paddingBottom: theme.spacing(10),
    [theme.breakpoints.up("lg")]: {
      // paddingTop: APP_BAR_DESKTOP,
      // paddingLeft: theme.spacing(2),
      // paddingRight: theme.spacing(2),
    },
  }));

  return (
    <StyledRoot className="">
      <Nav openSidebar={openSidebar} setOpenSidebar={setOpenSidebar} />

      <Main>
        <Header setOpenSidebar={setOpenSidebar} />
        <Outlet />
        {children}
      </Main>
      <ToastContainer
        position="top-right"
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {/* Same as */}
      <ToastContainer />
    </StyledRoot>
  );
};
DashboardLayout.propTypes = {
  children: PropTypes.any,
};
export default DashboardLayout;

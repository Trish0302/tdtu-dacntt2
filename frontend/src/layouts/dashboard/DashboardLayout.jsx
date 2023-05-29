import { styled } from "@mui/material";
import { Outlet } from "react-router-dom";
import Nav from "../../components/nav/Nav";
import Header from "../../components/header/Header";

const DashboardLayout = () => {
  const APP_BAR_MOBILE = 30;
  const APP_BAR_DESKTOP = 50;

  const StyledRoot = styled("div")({
    display: "flex",
    minHeight: "100%",
    overflow: "hidden",
  });

  const Main = styled("div")(({ theme }) => ({
    flexGrow: 1,
    overflow: "auto",
    minHeight: "100%",
    // paddingTop: APP_BAR_MOBILE,
    // paddingBottom: theme.spacing(10),
    [theme.breakpoints.up("lg")]: {
      // paddingTop: APP_BAR_DESKTOP,
      // paddingLeft: theme.spacing(2),
      // paddingRight: theme.spacing(2),
    },
  }));

  return (
    <StyledRoot>
      <Nav />

      <Main>
        <Header />
        <Outlet />
      </Main>
    </StyledRoot>
  );
};

export default DashboardLayout;

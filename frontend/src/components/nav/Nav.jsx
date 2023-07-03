import {
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import React from "react";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import DashboardIcon from "@mui/icons-material/Dashboard";
import navConfig from "./NavConfig";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useResponsive } from "ahooks";

const NAV_WIDTH = "250px";

// eslint-disable-next-line react/prop-types
const Nav = ({ openSidebar, setOpenSidebar }) => {
  console.log("🚀 ~ file: Nav.jsx:23 ~ Nav ~ openSidebar:", openSidebar);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  console.log("🚀 ~ file: Nav.jsx:25 ~ Nav ~ pathname:", pathname);
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });
  const responsive = useResponsive();
  // console.log("🚀 ~ file: Nav.jsx:36 ~ Nav ~ responsive:", responsive);

  const list = () => (
    <div className=" ">
      <Box
        sx={{ width: NAV_WIDTH }}
        role="presentation"
        onClick={() => setOpenSidebar(false)}
      >
        <List>
          {navConfig.map((text, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton
                onClick={() => {
                  navigate(`${text.path}`);
                }}
                selected={
                  pathname.split("/").includes(text.title.replace(" ", "-"))
                    ? true
                    : false
                }
              >
                <ListItemIcon>{text.icon}</ListItemIcon>
                <ListItemText
                  primary={
                    text.title.charAt(0).toUpperCase() + text.title.slice(1)
                  }
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </div>
  );

  return (
    <div
      className={`min-w-[250px] shadow-xl lg:block ${
        openSidebar ? "block" : "hidden"
      }`}
    >
      <React.Fragment>
        <Drawer
          open={!responsive.lg && !responsive.xl ? openSidebar : true}
          variant={`${
            !responsive.lg && !responsive.xl ? "temporary" : "permanent"
          }`}
          onClose={() => setOpenSidebar(false)}
          PaperProps={{
            sx: {
              width: NAV_WIDTH,
              bgcolor: "background.default",
              borderRightStyle: "dashed",
              overflowX: "hidden",
            },
          }}
          className="shadow-xl"
        >
          <Logo />
          <ImageProfile />
          <Divider />
          {list()}
        </Drawer>
      </React.Fragment>
    </div>
  );
};

export default Nav;

const Logo = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full h-24 bg-primary-500 text-white text-center font-semibold uppercase">
      <div
        className="h-full w-full flex items-center justify-center gap-2 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="icon icon-tabler icon-tabler-dashboard w-fit"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <path d="M12 13m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
          <path d="M13.45 11.55l2.05 -2.05"></path>
          <path d="M6.4 20a9 9 0 1 1 11.2 0z"></path>
        </svg>
        <span className="text-xl">Dashboard</span>
      </div>
    </div>
  );
};

const ImageProfile = () => {
  return (
    <div className="py-6 px-12 w-full h-44 flex-col justify-center items-center text-center">
      <div className="w-full flex justify-center mb-2">
        <Avatar
          sx={{ width: 80, height: 80 }}
          alt="avatar"
          className="shadow-lg"
          src="https://media.vogue.mx/photos/629e751da37e812991371b08/16:9/pass/Lisa-aka-Lalisa%20Manoban-Bulgari.jpg"
        />
      </div>
      <div className="font-semibold">MrHieu</div>
      <div className="text-gray-500">
        <small>Admin</small>
      </div>
    </div>
  );
};

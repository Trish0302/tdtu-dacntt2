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
import navConfig from "./NavConfig";
import { Navigate, useNavigate } from "react-router-dom";

const NAV_WIDTH = 250;

const Nav = () => {
  const navigate = useNavigate();
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = () => (
    <Box sx={{ width: NAV_WIDTH }} role="presentation">
      <List>
        {navConfig.map((text, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton
              onClick={() => {
                console.log(text.path);
                navigate(`${text.path}`);
              }}
            >
              <ListItemIcon>
                <AcUnitIcon />
              </ListItemIcon>
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
  );

  return (
    <div className={`w-[250px] shadow-xl`}>
      <React.Fragment>
        <Drawer
          // anchor={anchor}
          open
          // onClose={toggleDrawer(anchor, false)}
          variant="permanent"
          PaperProps={{
            sx: {
              width: NAV_WIDTH,
              bgcolor: "background.default",
              borderRightStyle: "dashed",
            },
          }}
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
  return (
    <div className="w-full h-24 bg-primary-500 text-white text-center font-semibold uppercase">
      <div className="h-full w-full flex items-center justify-center gap-2">
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
          src="https://images.unsplash.com/photo-1577912646606-9485d891c7ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=365&q=80"
        />
      </div>
      <div className="font-semibold">MrHieu</div>
      <div className="text-gray-500">
        <small>Admin</small>
      </div>
    </div>
  );
};

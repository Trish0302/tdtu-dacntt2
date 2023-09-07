/* eslint-disable react/prop-types */
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
import React, { useContext, useState } from "react";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import DashboardIcon from "@mui/icons-material/Dashboard";
import navConfig from "./NavConfig";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useResponsive } from "ahooks";
import { useEffect } from "react";
import { AsyncStorage } from "AsyncStorage";
import { call } from "../../utils/api";
import { authContext } from "../../utils/auth";

const NAV_WIDTH = "250px";

// eslint-disable-next-line react/prop-types
const Nav = ({ openSidebar, setOpenSidebar }) => {
  // console.log("🚀 ~ file: Nav.jsx:23 ~ Nav ~ openSidebar:", openSidebar);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  // console.log("🚀 ~ file: Nav.jsx:25 ~ Nav ~ pathname:", pathname);
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });
  const responsive = useResponsive();
  const userInfo = useContext(authContext);
  console.log("🚀 ~ file: Nav.jsx:43 ~ Nav ~ userInfo:", userInfo);
  // const [information, setInformation] = useState();

  // useEffect(() => {
  //   setInformation(userInfo);
  // }, []);
  // console.log("🚀 ~ file: Nav.jsx:36 ~ Nav ~ responsive:", responsive);

  // useEffect(() => {
  //   async function getInfoUser() {
  //     // const token_admin = await AsyncStorage.getItem("token-admin");
  //     // console.log(
  //     //   "🚀 ~ file: Nav.jsx:45 ~ getInfoUser ~ token_admin:",
  //     //   token_admin
  //     // );
  //     const rs = await call(`api/user`);
  //     setInformation(rs);
  //     console.log("🚀 ~ file: Nav.jsx:51 ~ getInfoUser ~ rs:", rs);
  //   }
  //   getInfoUser();
  // }, []);

  const list = () => (
    <div className=" ">
      <Box
        sx={{ width: NAV_WIDTH }}
        role="presentation"
        onClick={() => setOpenSidebar(false)}
      >
        <List sx={{ paddingTop: 0 }}>
          {navConfig.map((text, index) =>
            userInfo.role_id == 0 ? (
              text.title != "profile" && (
                <ListItem key={index} disablePadding>
                  <ListItemButton
                    // disabled={true}
                    onClick={() => {
                      navigate(`${text.path}`);
                    }}
                    sx={{
                      "&.Mui-selected": {
                        backgroundColor: "#ffe3e0",
                      },

                      ":hover": {
                        backgroundColor: "#ffe3e0",
                      },
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
              )
            ) : text.title != "staff" ? (
              <ListItem key={index} disablePadding>
                <ListItemButton
                  // disabled={true}
                  onClick={() => {
                    navigate(
                      `${
                        text.title == "profile"
                          ? text.path + `${userInfo.id}`
                          : text.path
                      }`
                    );
                  }}
                  sx={{
                    "&.Mui-selected": {
                      backgroundColor: "#ffe3e0",
                    },

                    ":hover": {
                      backgroundColor: "#ffe3e0",
                    },
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
            ) : (
              <></>
            )
          )}
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
      <div className="text-center">
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
              overflowX: "hidden",
              boxShadow: "3px 0 5px -2px rgba(0, 0, 0, 0.1)",
            },
          }}
          className="shadow-xl "
        >
          <Logo />
          {userInfo && <ImageProfile information={userInfo} />}
          <Divider />
          {list()}
        </Drawer>
      </div>
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

const ImageProfile = ({ information }) => {
  const navigate = useNavigate();
  const userInfo = useContext(authContext);
  return (
    <div className="py-5  w-full  flex-col justify-center items-center text-center">
      <button
        className="w-full flex justify-center mb-2"
        onClick={() => navigate(`users/detail/${userInfo.id}`)}
      >
        <Avatar
          sx={{ width: 80, height: 80 }}
          alt="avatar"
          className="shadow-lg"
          src={information.avatar}
        />
      </button>
      <div className="font-semibold">{information.name}</div>
      <small className="">{information.email}</small>
      <div className="text-gray-500">
        <small>{userInfo.role_id == 0 ? "Admin" : "Owner Store"}</small>
      </div>
    </div>
  );
};

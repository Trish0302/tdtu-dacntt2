import React, { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AsyncStorage } from "AsyncStorage";
import { Divider, IconButton, Tooltip } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import useReactRouterBreadcrumbs from "use-react-router-breadcrumbs";
import useScrollPosition from "../../hooks/useScrollPosition";
import Breadcrumb from "../breadcrumbs/Breadcrumb";
// eslint-disable-next-line react/prop-types
const Header = ({ setOpenSidebar }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    AsyncStorage.setItem("token-admin", null);
    navigate("/login");
  };

  return (
    <>
      <div className="flex items-center justify-between pl-5 pr-5 lg:pr-[260px] bg-violet-50 py-7 w-full fixed  z-50 shadow-sm">
        <div className="lg:hidden block">
          <IconButton
            onClick={() => {
              setOpenSidebar(true);
            }}
          >
            <MenuIcon />
          </IconButton>
        </div>
        {/* <div className="flex-1">
          {breadcrumbs.map(({ breadcrumb, match }, index) => {
            const isLast = index === breadcrumbs.length - 1;
            const isId =
              index === breadcrumbs.length - 2 &&
              typeof breadcrumbs[index - 1]?.location?.state?.id === "number";
            // console.log("match", breadcrumb.key);
            const split = breadcrumb.key.split("/");
            console.log(
              "🚀 ~ file: Header.jsx:41 ~ {breadcrumbs.map ~ split:",
              split
            );
            const isNumber =
              index > 0 && split.filter((a) => !isNaN(a)).length >= 2;

            console.log(
              "🚀 ~ file: Header.jsx:41 ~ {breadcrumbs.map ~ isNumber:",
              isNumber
            );
            return (
              <React.Fragment key={index}>
                {isId ? (
                  <>
                    &nbsp;
                    <NavLink
                      key={match.pathname}
                      to={match.pathname}
                      style={{
                        textDecoration: "none",
                        color: "black",
                        fontWeight: "bold",
                        pointerEvents: "none",
                      }}
                    >
                      {breadcrumb}
                    </NavLink>
                    &nbsp;
                  </>
                ) : isLast ? (
                  <>
                    &nbsp;
                    <NavLink
                      key={match.pathname}
                      to={match.pathname}
                      style={{
                        textDecoration: "none",
                        color: "black",
                        fontWeight: "bold",
                        pointerEvents: "none",
                      }}
                    >
                      {breadcrumb}
                    </NavLink>
                  </>
                ) : (
                  <>
                    &nbsp;
                    <NavLink
                      key={match.pathname}
                      to={match.pathname}
                      style={{ textDecoration: "none", color: "black" }}
                    >
                      {breadcrumb} /
                    </NavLink>
                  </>
                )}
              </React.Fragment>
            );
          })}
        </div> */}

        <div className="flex-1">
          <Breadcrumb />
        </div>
        <Tooltip title="Logout">
          <button onClick={handleLogout} className="text-primary-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-logout"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2"></path>
              <path d="M9 12h12l-3 -3"></path>
              <path d="M18 15l3 -3"></path>
            </svg>
          </button>
        </Tooltip>
      </div>
    </>
  );
};

export default Header;

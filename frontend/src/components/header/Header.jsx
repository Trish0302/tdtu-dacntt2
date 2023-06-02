import React from "react";
import { useNavigate } from "react-router-dom";
import { AsyncStorage } from "AsyncStorage";
import { Divider } from "@mui/material";
const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    AsyncStorage.setItem("token-admin", null);
    navigate("/login");
  };
  return (
    <>
      <div className="flex items-center justify-between px-5 bg-violet-50 py-8 absolute w-full ">
        <div className="">Breadcrumb</div>
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
      </div>
    </>
  );
};

export default Header;

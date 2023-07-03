import React from "react";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
const CardDashboard = () => {
  return (
    <a
      className="relative flex items-start justify-between rounded-xl border border-gray-100 p-4 shadow-xl sm:p-6 lg:p-8 bg-pink-200"
      href="#"
    >
      <div className="pt-4 text-primary-500 flex justify-center items-center">
        <div className="">
          <h3 className="mt-4 text-lg font-bold text-gray-900 sm:text-xl">
            Total of users in system
          </h3>

          <p className="mt-2 hidden text-sm sm:block">500 users</p>
        </div>
        <div>
          {" "}
          <PeopleOutlineIcon fontSize="large" className="text-gray-900" />
        </div>
      </div>
    </a>
  );
};

export default CardDashboard;

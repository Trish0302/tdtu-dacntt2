import React from "react";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
const CardDashboard = () => {
  return (
    <a
      className="relative flex items-start justify-between rounded-xl  p-4 shadow-md sm:p-6 lg:p-8 bg-primary-200"
      href="#"
    >
      <div className="pt- flex justify-center items-center">
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

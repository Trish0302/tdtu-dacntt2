/* eslint-disable react/prop-types */
import React from "react";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import StoreIcon from "@mui/icons-material/Store";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
const CardDashboard = ({ title, quantity, unit }) => {
  return (
    <div className="relative flex items-start justify-between rounded-xl h-full p-4 shadow-md sm:p-6 lg:p-8 bg-primary-200">
      <div className="flex justify-center gap-3 items-center">
        <div className="">
          <h3 className="mt-4 text-lg font-bold text-gray-900 sm:text-xl">
            {title}
          </h3>

          <p className="mt-2 hidden text-lg sm:block">
            <b>{quantity}</b> {unit}
          </p>
        </div>
        <div>
          {" "}
          {unit == "users" ? (
            <PeopleOutlineIcon fontSize="large" className="text-gray-900" />
          ) : unit == "stores" ? (
            <StoreIcon fontSize="large" className="text-gray-900" />
          ) : unit == "orders" ? (
            <ReceiptLongIcon fontSize="large" className="text-gray-900" />
          ) : (
            <MonetizationOnIcon fontSize="large" className="text-gray-900" />
          )}
        </div>
      </div>
    </div>
  );
};

export default CardDashboard;

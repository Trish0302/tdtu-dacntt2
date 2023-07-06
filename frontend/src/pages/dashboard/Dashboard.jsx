import { useContext, useEffect, useState } from "react";
import { authContext } from "../../utils/auth";
import { call } from "../../utils/api";
import { AsyncStorage } from "AsyncStorage";
import { useNavigate } from "react-router-dom";
import Search from "../../components/search/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Card,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import CardDashboard from "../../components/card/CardDashboard";

const Dashboard = () => {
  return (
    <div className="bg-[#252836] px-5 h-full overflow-y-scroll hide-scroll pt-24 pb-5">
      <div className="flex gap-4">
        <div className="basis-1/4">
          <CardDashboard />
        </div>
        <div className="basis-1/4">
          <CardDashboard />
        </div>
        <div className="basis-1/4">
          <CardDashboard />
        </div>
        <div className="basis-1/4">
          <CardDashboard />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

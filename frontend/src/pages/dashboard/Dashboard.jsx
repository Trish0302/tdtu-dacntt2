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

const Dashboard = () => {
  return <div className="h-screen bg-violet-50 px-5 pt-24">Dashboard</div>;
};

export default Dashboard;

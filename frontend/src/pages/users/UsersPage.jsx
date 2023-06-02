import React from "react";
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
import { ListUserContext } from "../../stores/ListUserContext";

const UsersPage = () => {
  const userData = useContext(authContext);
  const navigate = useNavigate();

  const { state, dispatch } = useContext(ListUserContext);
  console.log("🚀 ~ file: UsersPage.jsx:29 ~ UsersPage ~ state:", state);

  //funcs
  const handleOpenEdit = (event) => {
    const dataRow = JSON.parse(event.currentTarget.dataset.currentuser);
    navigate(`/edit-user/${dataRow.id}`, { state: dataRow });
  };
  const handleOpenDetail = (event) => {
    const dataRow = JSON.parse(event.currentTarget.dataset.currentuser);
    navigate(`/detail-user/${dataRow.id}`, { state: dataRow });
  };

  const handleDelete = (event) => {
    const dataRow = JSON.parse(event.currentTarget.dataset.currentuser);
    call(`api/users/${dataRow.id}`, "DELETE").then(
      dispatch({ type: "removeUser", sid: dataRow.id })
    );
  };

  return (
    <div className="h-full bg-violet-50 px-5 pt-24">
      <div className="flex items-center">
        <Search />
        <button className="px-6 py-2 text-primary-500 bg-white rounded-lg font-semibold uppercase text-sm mr-10 ml-3">
          Tìm
        </button>
        <button
          className="px-10 py-2 text-white bg-primary-500 rounded-lg font-semibold uppercase text-sm"
          onClick={() => navigate("/add-user")}
        >
          Thêm
        </button>
      </div>

      <Card sx={{ mt: 2 }}>
        <TableContainer sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="left">ID</TableCell>
                <TableCell align="left">Avatar</TableCell>
                <TableCell align="left">Name</TableCell>
                <TableCell align="left">Email</TableCell>
                <TableCell align="left">Phone</TableCell>
                <TableCell align="right" />
              </TableRow>
            </TableHead>

            <TableBody>
              {state.list &&
                state.list.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell align="left">{user.id}</TableCell>
                    <TableCell align="left">{user.avatar}</TableCell>
                    <TableCell align="left">{user.name}</TableCell>
                    <TableCell align="left">{user.email}</TableCell>
                    <TableCell align="left">{user.phone}</TableCell>
                    <TableCell align="right">
                      <IconButton aria-label="view">
                        <VisibilityIcon
                          data-currentuser={JSON.stringify(user)}
                          onClick={handleOpenDetail}
                        />
                      </IconButton>
                      <IconButton
                        aria-label="edit"
                        data-currentuser={JSON.stringify(user)}
                        onClick={handleOpenEdit}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        aria-label="delete"
                        data-currentuser={JSON.stringify(user)}
                        onClick={handleDelete}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </div>
  );
};

export default UsersPage;

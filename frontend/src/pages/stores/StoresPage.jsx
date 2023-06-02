import React, { useContext, useEffect, useState } from "react";
import Search from "../../components/search/Search";
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
import { call } from "../../utils/api";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";
import { ListStoreContext } from "../../stores/ListStoreContext";

const StoresPage = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(ListStoreContext);
  console.log("🚀 ~ file: StoresPage.jsx:25 ~ StoresPage ~ state:", state);

  //funcs
  const handleOpenEdit = (event) => {
    const dataRow = JSON.parse(event.currentTarget.dataset.currentstore);
    navigate(`/edit-user/${dataRow.id}`, { state: dataRow });
  };
  const handleOpenDetail = (event) => {
    const dataRow = JSON.parse(event.currentTarget.dataset.currentstore);
    navigate(`/detail-user/${dataRow.id}`, { state: dataRow });
  };

  const handleDelete = (event) => {
    const dataRow = JSON.parse(event.currentTarget.dataset.currentstore);
    call(`api/users/${dataRow.id}`, "DELETE").then(
      dispatch({ type: "removeStore", sid: dataRow.id })
    );
  };

  return (
    <div className=" bg-violet-50 px-5 pt-24 h-full">
      <div className="flex items-center">
        <Search />
        <button className="px-6 py-2 text-primary-500 bg-white rounded-lg font-semibold uppercase text-sm mr-10 ml-3">
          Tìm
        </button>
        <button
          className="px-10 py-2 text-white bg-primary-500 rounded-lg font-semibold uppercase text-sm"
          onClick={() => navigate("/add-store")}
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
                <TableCell align="left">Name</TableCell>
                <TableCell align="left">Address</TableCell>
                <TableCell align="left">Description</TableCell>
                <TableCell align="left">Owner</TableCell>
                <TableCell align="right" />
              </TableRow>
            </TableHead>

            <TableBody>
              {state.list &&
                state.list.map((store) => (
                  <TableRow key={store.id}>
                    <TableCell align="left">{store.id}</TableCell>
                    <TableCell align="left">{store.name}</TableCell>
                    <TableCell align="left">{store.address}</TableCell>
                    <TableCell align="left">{store.description}</TableCell>
                    <TableCell align="left">{store?.user?.name}</TableCell>
                    <TableCell align="right">
                      <IconButton aria-label="view">
                        <VisibilityIcon
                          data-currentstore={JSON.stringify(store)}
                          onClick={handleOpenDetail}
                        />
                      </IconButton>
                      <IconButton
                        aria-label="edit"
                        data-currentstore={JSON.stringify(store)}
                        onClick={handleOpenEdit}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        aria-label="delete"
                        data-currentstore={JSON.stringify(store)}
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

export default StoresPage;
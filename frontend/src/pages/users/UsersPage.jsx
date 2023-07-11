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
  Box,
  Card,
  IconButton,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
} from "@mui/material";
import { ListUserContext } from "../../stores/ListUserContext";
import { useConfirm } from "material-ui-confirm";
import { toast } from "react-toastify";

const UsersPage = () => {
  const confirm = useConfirm();
  const navigate = useNavigate();

  const { state, dispatch, isLoading } = useContext(ListUserContext);
  console.log("🚀 ~ file: UsersPage.jsx:29 ~ UsersPage ~ state:", state);

  // pagination
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  //funcs

  // functions

  const handleChangeRowsPerPage = async (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
    const result = await call(
      `api/users?page=${page + 1}&page_size=${parseInt(
        event.target.value,
        10
      )}`,
      "GET",
      null
    );
    dispatch({ type: "setList", payload: { list: result.data } });
  };
  const handleChangePage = async (event, newPage) => {
    setPage(newPage);
    const result = await call(
      `api/users?page=${newPage + 1}&page_size=${rowsPerPage}`,
      "GET",
      null
    );
    dispatch({ type: "setList", payload: { list: result.data } });
  };
  const handleOpenEdit = (event) => {
    const dataRow = JSON.parse(event.currentTarget.dataset.currentuser);
    navigate(`/users/edit/${dataRow.id}`, { state: dataRow });
  };
  const handleOpenDetail = (event) => {
    const dataRow = JSON.parse(event.currentTarget.dataset.currentuser);
    navigate(`/users/detail/${dataRow.id}`, { state: dataRow });
  };

  const handleDelete = (event) => {
    const dataRow = JSON.parse(event.currentTarget.dataset.currentuser);
    confirm({
      confirmationButtonProps: { color: "error" },
      description: `This will delete permanently ${dataRow.name}. You cannot undo this action`,
    })
      .then(() => {
        call(`api/users/${dataRow.id}`, "DELETE").then(() => {
          dispatch({ type: "removeUser", sid: dataRow.id });
          toast.success("Delete Successfully!!!", { autoClose: 1000 });
        });
      })
      .catch(() => {
        console.log("Deletion cancelled.");
      });
  };

  return (
    <div className="h-full bg-violet-50 px-5 pt-24 pb-5 overflow-y-scroll hide-scroll">
      <div className="flex items-center">
        <Search />
        <button className="px-6 py-2 text-primary-500 bg-white rounded-lg font-semibold uppercase text-sm mr-10 ml-3">
          Find
        </button>
        <button
          className="px-5 py-2 text-white bg-primary-500 rounded-lg font-semibold uppercase text-sm hover:opacity-75 duration-300"
          onClick={() => navigate("/users/add")}
        >
          Add&nbsp;New
        </button>
      </div>

      <Card sx={{ mt: 2 }}>
        {isLoading && (
          <Box sx={{ width: "100%" }}>
            <LinearProgress color="secondary" />
          </Box>
        )}
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
                      <Tooltip title="View Detail">
                        <IconButton aria-label="view">
                          <VisibilityIcon
                            data-currentuser={JSON.stringify(user)}
                            onClick={handleOpenDetail}
                          />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton
                          aria-label="edit"
                          data-currentuser={JSON.stringify(user)}
                          onClick={handleOpenEdit}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          aria-label="delete"
                          data-currentuser={JSON.stringify(user)}
                          onClick={handleDelete}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        {!isLoading && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 15]}
            component="div"
            count={state.total}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </Card>
    </div>
  );
};

export default UsersPage;

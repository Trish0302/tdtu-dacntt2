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
import { FcApprove, FcDisapprove } from "react-icons/fc";

const UsersPage = () => {
  const confirm = useConfirm();
  const navigate = useNavigate();
  const userInfo = useContext(authContext);
  console.log("🚀 ~ file: UsersPage.jsx:34 ~ UsersPage ~ userInfo:", userInfo);

  const { state, dispatch, isLoading } = useContext(ListUserContext);
  console.log("🚀 ~ file: UsersPage.jsx:29 ~ UsersPage ~ state:", state);
  const [loading, setLoading] = useState(false);

  // pagination
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [fromPage, setFromPage] = useState(0);
  const [toPage, setToPage] = useState(state.total < 5 ? state.total : 5);

  //search
  const [searchQuery, setSearchQuery] = useState("");

  //funcs

  // functions

  const handleChangeRowsPerPage = async (event) => {
    setLoading(true);
    setPage(0);
    setToPage(parseInt(event.target.value, 10));
    setRowsPerPage(parseInt(event.target.value, 10));
    const result = await call(
      `api/users?page=${page + 1}&page_size=${parseInt(
        event.target.value,
        10
      )}&q=${searchQuery}`,
      "GET",
      null
    );
    dispatch({ type: "setList", payload: { list: result.data } });
    setLoading(false);
  };
  const handleChangePage = async (event, newPage) => {
    setLoading(true);
    setPage(newPage);
    setToPage(() => {
      if (page < newPage) {
        return toPage + rowsPerPage > state.total
          ? state.total
          : toPage + rowsPerPage;
      } else {
        return toPage - rowsPerPage < 0 ? rowsPerPage : toPage - rowsPerPage;
      }
    });
    setFromPage(() => {
      if (page < newPage) {
        return fromPage + rowsPerPage > state.total
          ? state.total
          : fromPage + rowsPerPage;
      } else {
        return fromPage - rowsPerPage < 0 ? 0 : fromPage - rowsPerPage;
      }
    });
    const result = await call(
      `api/users?page=${newPage + 1}&page_size=${rowsPerPage}&q=${searchQuery}`,
      "GET",
      null
    );
    dispatch({ type: "setList", payload: { list: result.data } });
    setLoading(false);
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
        setToPage(toPage - 1);
      })
      .catch(() => {
        console.log("Deletion cancelled.");
      });
  };

  const handleSearch = async () => {
    const result = await call(
      `api/users?page=1&page_size=5&q=${searchQuery}`,
      "GET",
      {}
    );
    dispatch({ type: "setList", payload: { list: result.data } });
    dispatch({ type: "getTotal", payload: { total: result.total } });
  };

  const handleApprove = (event) => {
    const dataRow = JSON.parse(event.currentTarget.dataset.currentuser);
    confirm({
      confirmationButtonProps: { color: "error" },
      description: `This will Approve Account of ${dataRow.name} user.`,
    })
      .then(() => {
        call(`api/users/approve/${dataRow.id}`, "POST").then((rs) => {
          console.log(rs);

          toast.success("Approve Successfully!!!", { autoClose: 1000 });
          // window.location.reload();
          // dispatch({
          //   type: "getListUser",
          //   item: {
          //     page: page,
          //     page_size: rowsPerPage,
          //   },
          // });

          call(`api/users?page=${page + 1}&page_size=${rowsPerPage}`).then(
            (rs) => {
              console.log(rs);
              dispatch({ type: "setList", payload: { list: rs.data } });
            }
          );
        });
      })
      .catch(() => {
        console.log("Something went wrong.");
      });
  };

  return (
    <div className="h-full bg-primary-100 px-5 pt-24 pb-5 overflow-y-scroll hide-scroll">
      <div className="flex items-center">
        <Search
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
        />

        <button
          className="px-5 py-2 text-white bg-primary-500 rounded-lg font-semibold uppercase text-sm hover:opacity-75 duration-300"
          onClick={() => navigate("/users/add")}
        >
          Add&nbsp;New
        </button>
      </div>

      <Card sx={{ mt: 2 }}>
        {(loading || isLoading) && (
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
                <TableCell align="left">Role</TableCell>
                <TableCell align="right" />
              </TableRow>
            </TableHead>

            <TableBody>
              {state.list &&
                state.list.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell align="left">{user.id}</TableCell>
                    <TableCell align="left">
                      <img
                        src={user.avatar}
                        className="w-10 h-10 rounded-full object-cover"
                        alt={user.name}
                      />
                    </TableCell>
                    <TableCell align="left">{user.name}</TableCell>
                    <TableCell align="left">{user.email}</TableCell>
                    <TableCell align="left">{user.phone}</TableCell>
                    <TableCell align="left">
                      {user.role_id == 0 ? "Admin" : "Owner Store"}
                    </TableCell>

                    <TableCell align="right">
                      {user.email_verified_at != null ? (
                        <Tooltip title="Approved Account" arrow>
                          <IconButton aria-label="view" disabled={true}>
                            <FcApprove />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Tooltip title="Click To Approve Account" arrow>
                          <IconButton aria-label="view">
                            <FcDisapprove
                              data-currentuser={JSON.stringify(user)}
                              onClick={handleApprove}
                            />
                          </IconButton>
                        </Tooltip>
                      )}

                      <Tooltip title="View Detail" arrow>
                        <IconButton aria-label="view">
                          <VisibilityIcon
                            data-currentuser={JSON.stringify(user)}
                            onClick={handleOpenDetail}
                          />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit" arrow>
                        <IconButton
                          aria-label="edit"
                          data-currentuser={JSON.stringify(user)}
                          onClick={handleOpenEdit}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      {user.id != userInfo.id ? (
                        <Tooltip title="Delete" arrow>
                          <IconButton
                            aria-label="delete"
                            data-currentuser={JSON.stringify(user)}
                            onClick={handleDelete}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <></>
                      )}
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

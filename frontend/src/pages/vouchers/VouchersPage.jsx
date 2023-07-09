import { useConfirm } from "material-ui-confirm";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ListVoucherContext } from "../../stores/ListVoucherContext";
import { call } from "../../utils/api";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Box,
  Card,
  IconButton,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
} from "@mui/material";
import { toast } from "react-toastify";
import Search from "../../components/search/Search";

const VouchersPage = () => {
  const confirm = useConfirm();
  const navigate = useNavigate();

  const { state, dispatch, isLoading } = useContext(ListVoucherContext);
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
      `api/vouchers?page=${page + 1}&page_size=${parseInt(
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
      `api/vouchers?page=${newPage + 1}&page_size=${rowsPerPage}`,
      "GET",
      null
    );
    dispatch({ type: "setList", payload: { list: result.data } });
  };
  const handleOpenEdit = (event) => {
    const dataRow = JSON.parse(event.currentTarget.dataset.currentvoucher);
    navigate(`/vouchers/edit/${dataRow.id}`, { state: dataRow });
  };
  const handleOpenDetail = (event) => {
    const dataRow = JSON.parse(event.currentTarget.dataset.currentvoucher);
    navigate(`/vouchers/detail/${dataRow.id}`, { state: dataRow });
  };

  const handleDelete = (event) => {
    const dataRow = JSON.parse(event.currentTarget.dataset.currentvoucher);
    confirm({
      confirmationButtonProps: { color: "error" },
      description: `This will delete permanently ${dataRow.code}. You cannot undo this action`,
    })
      .then(() => {
        call(`api/vouchers/${dataRow.id}`, "DELETE").then(() => {
          dispatch({ type: "removeVoucher", sid: dataRow.id });
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
          onClick={() => navigate("/vouchers/add")}
        >
          Add&nbsp;New
        </button>
      </div>

      <Card sx={{ mt: 2 }}>
        <TableContainer sx={{ minWidth: 800 }}>
          {isLoading && (
            <Box sx={{ width: "100%" }}>
              <LinearProgress color="secondary" />
            </Box>
          )}
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="left">ID</TableCell>
                <TableCell align="left">Code</TableCell>
                <TableCell align="left">Discount</TableCell>
                <TableCell align="right" />
              </TableRow>
            </TableHead>

            <TableBody>
              {state.list &&
                state.list.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell align="left">{user.id}</TableCell>
                    <TableCell align="left">{user.code}</TableCell>
                    <TableCell align="left">{user.discount}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="View Detail">
                        <IconButton aria-label="view">
                          <VisibilityIcon
                            data-currentvoucher={JSON.stringify(user)}
                            onClick={handleOpenDetail}
                          />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton
                          aria-label="edit"
                          data-currentvoucher={JSON.stringify(user)}
                          onClick={handleOpenEdit}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          aria-label="delete"
                          data-currentvoucher={JSON.stringify(user)}
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

export default VouchersPage;

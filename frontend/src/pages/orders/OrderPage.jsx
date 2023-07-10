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
import React, { useContext, useState } from "react";
import Search from "../../components/search/Search";
import { useNavigate } from "react-router-dom";
import { useConfirm } from "material-ui-confirm";
import { ListOrderContext } from "../../stores/ListOrderContext";
import { call } from "../../utils/api";
import { toast } from "react-toastify";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";

const OrderPage = () => {
  const navigate = useNavigate();
  const confirm = useConfirm();
  const { state, dispatch, isLoading } = useContext(ListOrderContext);

  console.log("🚀 ~ file: StoresPage.jsx:25 ~ StoresPage ~ state:", state);

  // funcs
  // pagination
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const handleChangeRowsPerPage = async (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
    const result = await call(
      `api/orders?page=${page + 1}&page_size=${parseInt(
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
      `api/orders?page=${newPage + 1}&page_size=${rowsPerPage}`,
      "GET",
      null
    );
    console.log(
      "🚀 ~ file: StoresPage.jsx:51 ~ handleChangePage ~ result:",
      result
    );
    dispatch({ type: "setList", payload: { list: result.data } });
  };

  const handleOpenEdit = (event) => {
    const dataRow = JSON.parse(event.currentTarget.dataset.currentorder);
    navigate(`/orders/edit/${dataRow.id}`, { state: dataRow });
  };
  const handleOpenDetail = (event) => {
    const dataRow = JSON.parse(event.currentTarget.dataset.currentorder);
    navigate(`/orders/detail/${dataRow.id}`, { state: dataRow });
  };

  const handleDelete = (event) => {
    const dataRow = JSON.parse(event.currentTarget.dataset.currentorder);
    confirm({
      confirmationButtonProps: { color: "error" },
      description: `This will delete permanently ${dataRow.name}. You cannot undo this action`,
    })
      .then(() => {
        call(`api/orders/${dataRow.id}`, "DELETE").then(() => {
          dispatch({ type: "removeOrder", sid: dataRow.id });
          toast.success("Delete Successfully!!!", { autoClose: 1000 });
        });
      })
      .catch(() => {
        console.log("Deletion cancelled.");
      });
  };

  return (
    <div className=" bg-violet-50 px-5 h-full overflow-y-scroll hide-scroll pt-24 pb-5">
      <div className="flex items-center w-full">
        <Search />
        <button className="px-6 py-2 text-primary-500 bg-white rounded-lg font-semibold uppercase text-sm ml-3">
          Find
        </button>
        {/* <button
      className="px-5 py-2 text-white bg-primary-500 rounded-lg font-semibold uppercase text-sm hover:opacity-75 duration-300"
      onClick={() => navigate("/orders/add")}
    >
      Add&nbsp;New
    </button> */}
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
                <TableCell align="left">Name</TableCell>
                <TableCell align="left">Address</TableCell>
                <TableCell align="left">Phone</TableCell>
                <TableCell align="left">Total</TableCell>
                <TableCell align="right" />
              </TableRow>
            </TableHead>

            <TableBody>
              {state.list &&
                state.list.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell align="left">{order.id}</TableCell>
                    <TableCell align="left">{order.name}</TableCell>
                    <TableCell align="left">{order.address}</TableCell>
                    <TableCell align="left">{order.phone}</TableCell>
                    <TableCell align="left">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(order.total)}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="View Detail">
                        <IconButton aria-label="view">
                          <VisibilityIcon
                            data-currentorder={JSON.stringify(order)}
                            onClick={handleOpenDetail}
                          />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton
                          aria-label="edit"
                          data-currentorder={JSON.stringify(order)}
                          onClick={handleOpenEdit}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          aria-label="delete"
                          data-currentorder={JSON.stringify(order)}
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

export default OrderPage;

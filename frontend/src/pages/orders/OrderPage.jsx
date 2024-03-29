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
import { Link, useNavigate } from "react-router-dom";
import { useConfirm } from "material-ui-confirm";
import { ListOrderContext } from "../../stores/ListOrderContext";
import { call } from "../../utils/api";
import { toast } from "react-toastify";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { convertISODateToTimeFormat } from "../../utils/func";

const OrderPage = () => {
  const navigate = useNavigate();
  const confirm = useConfirm();
  const { state, dispatch, isLoading } = useContext(ListOrderContext);

  console.log("🚀 ~ file: StoresPage.jsx:25 ~ StoresPage ~ state:", state);
  const [loading, setLoading] = useState(false);

  //search
  const [searchQuery, setSearchQuery] = useState("");

  // pagination
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [fromPage, setFromPage] = useState(0);
  const [toPage, setToPage] = useState(state.total < 5 ? state.total : 5);

  // funcs
  const handleChangeRowsPerPage = async (event) => {
    setLoading(true);
    setPage(0);
    setToPage(parseInt(event.target.value, 10));
    setRowsPerPage(parseInt(event.target.value, 10));
    const result = await call(
      `api/orders?page=${page + 1}&page_size=${parseInt(
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
      `api/orders?page=${
        newPage + 1
      }&page_size=${rowsPerPage}&q=${searchQuery}`,
      "GET",
      null
    );
    console.log(
      "🚀 ~ file: StoresPage.jsx:51 ~ handleChangePage ~ result:",
      result
    );
    dispatch({ type: "setList", payload: { list: result.data } });
    setLoading(false);
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
        setToPage(toPage - 1);
      })
      .catch(() => {
        console.log("Deletion cancelled.");
      });
  };

  const handleSearch = async () => {
    const result = await call(
      `api/orders?page=1&page_size=5&q=${searchQuery}`,
      "GET",
      {}
    );
    dispatch({ type: "setList", payload: { list: result.data } });
    dispatch({ type: "getTotal", payload: { total: result.paging.total } });
  };

  //

  return (
    <div className=" bg-primary-100 px-5 h-full overflow-y-scroll hide-scroll pt-24 pb-5">
      <div className="flex items-center w-full">
        <Search
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
        />

        {/* <button
      className="px-5 py-2 text-white bg-primary-500 rounded-lg font-semibold uppercase text-sm hover:opacity-75 duration-300"
      onClick={() => navigate("/orders/add")}
    >
      Add&nbsp;New
    </button> */}
      </div>

      <Card sx={{ mt: 2 }}>
        <TableContainer sx={{ minWidth: 800 }}>
          {(loading || isLoading) && (
            <Box sx={{ width: "100%" }}>
              <LinearProgress color="secondary" />
            </Box>
          )}
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="left">ID</TableCell>
                <TableCell align="left">Recipient</TableCell>
                <TableCell align="left">Address</TableCell>
                <TableCell align="left">Phone</TableCell>
                <TableCell align="left">Customer Name</TableCell>
                <TableCell align="left">Store Name</TableCell>
                <TableCell align="left">Total</TableCell>
                <TableCell align="left">Create Time</TableCell>
                <TableCell align="left">Order Progress</TableCell>
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
                      <Link
                        to={`/customers/detail/${order.customer.id}`}
                        className="underline hover:text-primary-500"
                      >
                        {order.customer.name}
                      </Link>
                    </TableCell>
                    <TableCell align="left">
                      <Link
                        to={`/stores/detail/${order.store.id}`}
                        className="underline hover:text-primary-500"
                      >
                        {order.store.name}
                      </Link>
                    </TableCell>
                    <TableCell align="left">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(order.total)}
                    </TableCell>
                    <TableCell align="left">
                      {convertISODateToTimeFormat(order.created_at)}
                    </TableCell>
                    <TableCell align="left">
                      {order.lastest_order_progress}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="View Detail" arrow>
                        <IconButton aria-label="view">
                          <VisibilityIcon
                            data-currentorder={JSON.stringify(order)}
                            onClick={handleOpenDetail}
                          />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit" arrow>
                        <IconButton
                          aria-label="edit"
                          data-currentorder={JSON.stringify(order)}
                          onClick={handleOpenEdit}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete" arrow>
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

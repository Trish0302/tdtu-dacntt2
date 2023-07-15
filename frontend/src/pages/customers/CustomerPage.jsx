import React, { useContext, useState } from "react";
import Search from "../../components/search/Search";
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
import { useConfirm } from "material-ui-confirm";
import { useNavigate } from "react-router-dom";
import { ListCustomerContext } from "../../stores/ListCustomerContext";
import { call } from "../../utils/api";
import { toast } from "react-toastify";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";

const CustomerPage = () => {
  const confirm = useConfirm();
  const navigate = useNavigate();

  const { state, dispatch, isLoading } = useContext(ListCustomerContext);
  console.log(
    "🚀 ~ file: customersPage.jsx:29 ~ customersPage ~ state:",
    state
  );
  const [loading, setLoading] = useState(false);

  // pagination
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  // functions

  const handleChangeRowsPerPage = async (event) => {
    setLoading(true);
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
    const result = await call(
      `api/customers?page=${page + 1}&page_size=${parseInt(
        event.target.value,
        10
      )}`,
      "GET",
      null
    );
    dispatch({ type: "setList", payload: { list: result.data } });
    setLoading(false);
  };
  const handleChangePage = async (event, newPage) => {
    setLoading(true);
    setPage(newPage);
    const result = await call(
      `api/customers?page=${newPage + 1}&page_size=${rowsPerPage}`,
      "GET",
      null
    );
    dispatch({ type: "setList", payload: { list: result.data } });
    setLoading(false);
  };
  const handleOpenEdit = (event) => {
    const dataRow = JSON.parse(event.currentTarget.dataset.currentcustomer);
    navigate(`/customers/edit/${dataRow.id}`, { state: dataRow });
  };
  const handleOpenDetail = (event) => {
    const dataRow = JSON.parse(event.currentTarget.dataset.currentcustomer);
    navigate(`/customers/detail/${dataRow.id}`, { state: dataRow });
  };

  const handleDelete = (event) => {
    const dataRow = JSON.parse(event.currentTarget.dataset.currentcustomer);
    confirm({
      confirmationButtonProps: { color: "error" },
      description: `This will delete permanently ${dataRow.name}. You cannot undo this action`,
    })
      .then(() => {
        call(`api/customers/${dataRow.id}`, "DELETE").then(() => {
          dispatch({ type: "removeCustomer", sid: dataRow.id });
          toast.success("Delete Successfully!!!", { autoClose: 1000 });
        });
      })
      .catch(() => {
        console.log("Deletion cancelled.");
      });
  };

  return (
    <div className="h-full bg-primary-100 px-5 pt-24 pb-5 overflow-y-scroll hide-scroll">
      <div className="flex items-center">
        <Search />
        <button className="px-6 py-2 text-primary-500 bg-white rounded-lg font-semibold uppercase text-sm mr-10 ml-3">
          Find
        </button>
        <button
          className="px-5 py-2 text-white bg-primary-500 rounded-lg font-semibold uppercase text-sm hover:opacity-75 duration-300"
          onClick={() => navigate("/customers/add")}
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
                <TableCell align="left">Address</TableCell>
                <TableCell align="right" />
              </TableRow>
            </TableHead>

            <TableBody>
              {state.list &&
                state.list.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell align="left">{customer.id}</TableCell>
                    <TableCell align="left">
                      <img
                        src={customer.avatar}
                        alt=""
                        className="w-10 h-10 rounded-full"
                      />
                    </TableCell>
                    <TableCell align="left">{customer.name}</TableCell>
                    <TableCell align="left">{customer.email}</TableCell>
                    <TableCell align="left">{customer.phone}</TableCell>
                    <TableCell align="left">{customer.address}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="View Detail" arrow>
                        <IconButton aria-label="view">
                          <VisibilityIcon
                            data-currentcustomer={JSON.stringify(customer)}
                            onClick={handleOpenDetail}
                          />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit" arrow>
                        <IconButton
                          aria-label="edit"
                          data-currentcustomer={JSON.stringify(customer)}
                          onClick={handleOpenEdit}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete" arrow>
                        <IconButton
                          aria-label="delete"
                          data-currentcustomer={JSON.stringify(customer)}
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

export default CustomerPage;

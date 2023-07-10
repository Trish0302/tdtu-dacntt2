import React, { useContext, useEffect, useState } from "react";
import Search from "../../components/search/Search";
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
import { call } from "../../utils/api";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import { useNavigate } from "react-router-dom";
import { ListStoreContext } from "../../stores/ListStoreContext";
import { useConfirm } from "material-ui-confirm";
import { toast } from "react-toastify";

const StoresPage = () => {
  const navigate = useNavigate();
  const confirm = useConfirm();
  const { state, dispatch, isLoading } = useContext(ListStoreContext);

  console.log("🚀 ~ file: StoresPage.jsx:25 ~ StoresPage ~ state:", state);

  // funcs
  // pagination
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const handleChangeRowsPerPage = async (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
    const result = await call(
      `api/stores?page=${page + 1}&page_size=${parseInt(
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
      `api/stores?page=${newPage + 1}&page_size=${rowsPerPage}`,
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
    const dataRow = JSON.parse(event.currentTarget.dataset.currentstore);
    navigate(`/stores/edit/${dataRow.id}`, { state: dataRow });
  };
  const handleOpenDetail = (event) => {
    const dataRow = JSON.parse(event.currentTarget.dataset.currentstore);
    navigate(`/stores/detail/${dataRow.id}`, { state: dataRow });
  };
  const handleOpenFoodGroup = (event) => {
    const dataRow = JSON.parse(event.currentTarget.dataset.currentstore);
    navigate(`/stores/${dataRow.id}/food-group`, {
      state: { storeId: dataRow.id },
    });
  };
  const handleDelete = (event) => {
    const dataRow = JSON.parse(event.currentTarget.dataset.currentstore);
    confirm({
      confirmationButtonProps: { color: "error" },
      description: `This will delete permanently ${dataRow.name}. You cannot undo this action`,
    })
      .then(() => {
        call(`api/stores/${dataRow.id}`, "DELETE").then(() => {
          dispatch({ type: "removeStore", sid: dataRow.id });
          toast.success("Delete Successfully!!!", { autoClose: 1000 });
        });
      })
      .catch(() => {
        console.log("Deletion cancelled.");
      });
  };

  return (
    <div className=" bg-violet-50 px-5 h-full overflow-y-scroll hide-scroll pt-24 pb-5">
      <div className="flex items-center">
        <Search />
        <button className="px-6 py-2 text-primary-500 bg-white rounded-lg font-semibold uppercase text-sm mr-10 ml-3">
          Find
        </button>
        <button
          className="px-5 py-2 text-white bg-primary-500 rounded-lg font-semibold uppercase text-sm hover:opacity-75 duration-300"
          onClick={() => navigate("/stores/add")}
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
                      <Tooltip title="View Detail Food Groups">
                        <IconButton aria-label="view">
                          <RestaurantMenuIcon
                            data-currentstore={JSON.stringify(store)}
                            onClick={handleOpenFoodGroup}
                          />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="View Detail">
                        <IconButton aria-label="view">
                          <VisibilityIcon
                            data-currentstore={JSON.stringify(store)}
                            onClick={handleOpenDetail}
                          />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton
                          aria-label="edit"
                          data-currentstore={JSON.stringify(store)}
                          onClick={handleOpenEdit}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          aria-label="delete"
                          data-currentstore={JSON.stringify(store)}
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

export default StoresPage;

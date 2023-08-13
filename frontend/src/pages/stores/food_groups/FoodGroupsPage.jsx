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
import { call } from "../../../utils/api";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useConfirm } from "material-ui-confirm";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { ListFoodGroupContext } from "../../../stores/ListFoodGroupContext";
import Search from "../../../components/search/Search";
import { toast } from "react-toastify";

const FoodGroupsPage = () => {
  const location = useLocation();

  const navigate = useNavigate();
  const confirm = useConfirm();
  const { state, dispatch, isLoading } = useContext(ListFoodGroupContext);

  console.log("🚀 ~ file: StoresPage.jsx:25 ~ FoodGroupsPage ~ state:", state);
  const [loading, setLoading] = useState(false);

  // funcs
  // pagination
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [fromPage, setFromPage] = useState(0);
  const [toPage, setToPage] = useState(state.total < 5 ? state.total : 5);
  const handleChangeRowsPerPage = async (event) => {
    setLoading(true);
    setPage(0);
    setToPage(parseInt(event.target.value, 10));
    setRowsPerPage(parseInt(event.target.value, 10));
    let result;

    if (location.state) {
      result = await call(
        `api/stores/${location.state.storeId}/food_groups?page=${
          page + 1
        }&page_size=${parseInt(event.target.value, 10)}`,
        "GET",
        null
      );
    } else {
      result = await call(
        `api/food-groups?page=${page + 1}&page_size=${parseInt(
          event.target.value,
          10
        )}`,
        "GET",
        null
      );
    }

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
    let result;
    if (location.state) {
      result = await call(
        `api/stores/${location.state.storeId}/food_groups?page=${
          newPage + 1
        }&page_size=${rowsPerPage}`,
        "GET",
        null
      );
    } else {
      result = await call(
        `api/food-groups?page=${newPage + 1}&page_size=${rowsPerPage}`,
        "GET",
        null
      );
    }

    dispatch({ type: "setList", payload: { list: result.data } });
    setLoading(false);
  };

  const handleOpenEdit = (event) => {
    const dataRow = JSON.parse(event.currentTarget.dataset.currentfoodgroup);
    if (location.state) {
      navigate(
        `/stores/${location.state.storeId}/food-group/edit/${dataRow.id}`,
        {
          state: { dataRow, storeId: location.state.storeId },
        }
      );
    } else {
      navigate(`/stores/${dataRow.store_id}/food-group/edit/${dataRow.id}`, {
        state: { dataRow, storeId: dataRow.store_id },
      });
    }
  };
  const handleOpenDetail = (event) => {
    const dataRow = JSON.parse(event.currentTarget.dataset.currentfoodgroup);
    console.log(
      "🚀 ~ file: FoodGroupsPage.jsx:99 ~ handleOpenDetail ~ dataRow:",
      dataRow
    );
    if (location.state) {
      navigate(
        `/stores/${location.state.storeId}/food-group/detail/${dataRow.id}`,
        {
          state: dataRow,
        }
      );
    } else {
      navigate(`/stores/${dataRow.store_id}/food-group/detail/${dataRow.id}`, {
        state: dataRow,
      });
    }
  };
  const handleOpenFood = (event) => {
    const dataRow = JSON.parse(event.currentTarget.dataset.currentfoodgroup);
    navigate(
      `/stores/${location.state.storeId}/food-group/${dataRow.id}/food`,
      {
        state: { storeId: location.state.storeId, foodGroupId: dataRow.id },
      }
    );
  };

  const handleDelete = (event) => {
    const dataRow = JSON.parse(event.currentTarget.dataset.currentfoodgroup);
    confirm({
      confirmationButtonProps: { color: "error" },
      description: `This will delete permanently ${dataRow.name}. You cannot undo this action`,
    })
      .then(() => {
        if (location.state) {
          call(
            `api/stores/${location.state.storeId}/food_groups/${dataRow.id}`,
            "DELETE"
          ).then(() => {
            dispatch({ type: "removeFoodGroup", sid: dataRow.id });
            toast.success("Delete Successfully!!!", { autoClose: 1000 });
          });
        } else {
          call(
            `api/stores/${dataRow.store_id}/food_groups/${dataRow.id}`,
            "DELETE"
          ).then(() => {
            dispatch({ type: "removeFoodGroup", sid: dataRow.id });
            toast.success("Delete Successfully!!!", { autoClose: 1000 });
          });
        }
        setToPage(toPage - 1);
      })
      .catch(() => {
        console.log("Deletion cancelled.");
      });
  };

  return (
    <div className="bg-primary-100 px-5 h-full overflow-y-scroll hide-scroll pt-24 pb-5">
      <div className="flex items-center">
        <Search />
        <button className="px-6 py-2 text-primary-500 bg-white rounded-lg font-semibold uppercase text-sm mr-10 ml-3">
          Find
        </button>
        <button
          className="px-5 py-2 text-white bg-primary-500 rounded-lg font-semibold uppercase text-sm hover:opacity-75 duration-300"
          onClick={() => {
            if (location.state) {
              navigate(`/stores/${location.state.storeId}/food-group/add`, {
                state: { storeId: location.state.storeId },
              });
            } else {
              navigate(`add`);
            }
          }}
        >
          Add&nbsp;New
        </button>
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
                <TableCell align="left">Name</TableCell>
                <TableCell align="left">Slug</TableCell>
                <TableCell align="left">Store Name</TableCell>
                <TableCell align="left">Description</TableCell>
                <TableCell align="right" />
              </TableRow>
            </TableHead>

            <TableBody>
              {state.list &&
                state.list.map((foodGroup) => (
                  <TableRow key={foodGroup.id}>
                    <TableCell align="left">{foodGroup.id}</TableCell>
                    <TableCell align="left">{foodGroup.name}</TableCell>
                    <TableCell align="left">{foodGroup.slug}</TableCell>
                    <TableCell align="left">{foodGroup.store.name}</TableCell>
                    <TableCell align="left" className="truncate max-w-[200px] ">
                      {foodGroup.description}
                    </TableCell>
                    <TableCell align="right">
                      {location.state && (
                        <Tooltip title="View Detail Food" arrow>
                          <IconButton aria-label="view">
                            <FastfoodIcon
                              data-currentfoodgroup={JSON.stringify(foodGroup)}
                              onClick={handleOpenFood}
                            />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="View Detail" arrow>
                        <IconButton aria-label="view">
                          <VisibilityIcon
                            data-currentfoodgroup={JSON.stringify(foodGroup)}
                            onClick={handleOpenDetail}
                          />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit" arrow>
                        <IconButton
                          aria-label="edit"
                          data-currentfoodgroup={JSON.stringify(foodGroup)}
                          onClick={handleOpenEdit}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete" arrow>
                        <IconButton
                          aria-label="delete"
                          data-currentfoodgroup={JSON.stringify(foodGroup)}
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

export default FoodGroupsPage;

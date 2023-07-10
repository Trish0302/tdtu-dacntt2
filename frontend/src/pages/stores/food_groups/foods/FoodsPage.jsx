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
import Search from "../../../../components/search/Search";
import { call } from "../../../../utils/api";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useConfirm } from "material-ui-confirm";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { ListFoodContext } from "../../../../stores/ListFoodContext";
import { toast } from "react-toastify";

const FoodsPage = () => {
  const { storeId, foodGroupId } = useParams();
  console.log("🚀 ~ file: FoodsPage.jsx:29 ~ FoodsPage ~ location:", location);
  console.log(
    "🚀 ~ file: FoodGroupsPage.jsx:26 ~ FoodGroupsPage ~ id:",
    storeId,
    foodGroupId
  );

  const navigate = useNavigate();
  const confirm = useConfirm();
  const { state, dispatch, isLoading } = useContext(ListFoodContext);

  console.log("🚀 ~ file: FoodsPage.jsx:25 ~ FoodsPage ~ state:", state);

  // funcs
  // pagination
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const handleChangeRowsPerPage = async (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
    let result;
    if (storeId && foodGroupId) {
      result = await call(
        `api/stores/${storeId}/food_groups/${foodGroupId}/food?page=${
          page + 1
        }&page_size=${parseInt(event.target.value, 10)}`,
        "GET",
        null
      );
    } else {
      result = await call(
        `api/food?page=${page + 1}&page_size=${parseInt(
          event.target.value,
          10
        )}`,
        "GET",
        null
      );
    }
    dispatch({ type: "setList", payload: { list: result.data } });
  };
  const handleChangePage = async (event, newPage) => {
    setPage(newPage);
    let result;
    if (storeId && foodGroupId) {
      result = await call(
        `api/stores/${storeId}/food_groups/${foodGroupId}/food?page=${
          newPage + 1
        }&page_size=${rowsPerPage}`,
        "GET",
        null
      );
    } else {
      result = await call(
        `api/food?page=${newPage + 1}&page_size=${rowsPerPage}`,
        "GET",
        null
      );
    }
    dispatch({ type: "setList", payload: { list: result.data } });
  };

  const handleOpenEdit = (event) => {
    const dataRow = JSON.parse(event.currentTarget.dataset.currentfood);

    if (storeId && foodGroupId) {
      navigate(
        `/stores/${storeId}/food-group/${foodGroupId}/food/edit/${dataRow.id}`,
        {
          state: {
            dataRow,
            storeId,
            foodGroupId,
          },
        }
      );
    } else {
      navigate(
        `/stores/${dataRow.food_group.store_id}/food-group/${dataRow.food_group_id}/food/edit/${dataRow.id}`,
        {
          state: {
            dataRow,
            storeId: dataRow.food_group.store_id,
            foodGroupId: dataRow.food_group_id,
          },
        }
      );
    }
  };
  const handleOpenDetail = (event) => {
    const dataRow = JSON.parse(event.currentTarget.dataset.currentfood);
    if (storeId && foodGroupId) {
      navigate(
        `/stores/${storeId}/food-group/${foodGroupId}/food/detail/${dataRow.id}`,
        {
          state: dataRow,
        }
      );
    } else {
      navigate(
        `/stores/${dataRow.food_group.store_id}/food-group/${dataRow.food_group_id}/food/detail/${dataRow.id}`,
        {
          state: dataRow,
        }
      );
    }
  };

  const handleDelete = (event) => {
    const dataRow = JSON.parse(event.currentTarget.dataset.currentfood);
    console.log(
      "🚀 ~ file: FoodsPage.jsx:138 ~ handleDelete ~ dataRow:",
      dataRow
    );
    confirm({
      confirmationButtonProps: { color: "error" },
      description: `This will delete permanently ${dataRow.name}. You cannot undo this action`,
    })
      .then(() => {
        call(
          `api/stores/${dataRow.food_group.store_id}/food_groups/${dataRow.food_group_id}/food/${dataRow.id}`,
          "DELETE"
        ).then(() => {
          dispatch({ type: "removeFood", sid: dataRow.id });
          toast.success("Delete Successfully!!!", { autoClose: 1000 });
        });
      })
      .catch((err) => {
        console.log("Deletion cancelled.", err);
      });
  };

  return (
    <div className="bg-violet-50 px-5 h-full overflow-y-scroll hide-scroll pt-24 pb-5">
      <div className="flex items-center">
        <Search />
        <button className="px-6 py-2 text-primary-500 bg-white rounded-lg font-semibold uppercase text-sm mr-10 ml-3">
          Find
        </button>
        <button
          className="px-5 py-2 text-white bg-primary-500 rounded-lg font-semibold uppercase text-sm hover:opacity-75 duration-300"
          onClick={() => {
            if (storeId && foodGroupId) {
              navigate(
                `/stores/${storeId}/food-group/${foodGroupId}/food/add`,
                {
                  state: { storeId, foodGroupId },
                }
              );
            } else {
              navigate(`/foods/add`);
            }
          }}
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
                <TableCell align="left">Name</TableCell>
                <TableCell align="left">Slug</TableCell>
                <TableCell align="left">Price</TableCell>
                <TableCell align="right" />
              </TableRow>
            </TableHead>

            <TableBody>
              {state.list &&
                state.list.map((food) => (
                  <TableRow key={food.id}>
                    <TableCell align="left">{food.id}</TableCell>
                    <TableCell align="left">{food.name}</TableCell>
                    <TableCell align="left">{food.slug}</TableCell>
                    <TableCell align="left">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(food.price)}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="View Detail">
                        <IconButton aria-label="view">
                          <VisibilityIcon
                            data-currentfood={JSON.stringify(food)}
                            onClick={handleOpenDetail}
                          />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton
                          aria-label="edit"
                          data-currentfood={JSON.stringify(food)}
                          onClick={handleOpenEdit}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          aria-label="delete"
                          data-currentfood={JSON.stringify(food)}
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

export default FoodsPage;

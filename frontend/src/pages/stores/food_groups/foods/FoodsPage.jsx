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
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
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
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const confirm = useConfirm();
  const { state, dispatch, isLoading } = useContext(ListFoodContext);

  console.log("🚀 ~ file: FoodsPage.jsx:25 ~ FoodsPage ~ state:", state);

  // pagination
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [fromPage, setFromPage] = useState(0);
  const [toPage, setToPage] = useState(state.total < 5 ? state.total : 5);
  //search
  const [searchQuery, setSearchQuery] = useState("");

  // funcs
  const handleChangeRowsPerPage = async (event) => {
    setLoading(true);
    setPage(0);
    setToPage(parseInt(event.target.value, 10));
    setRowsPerPage(parseInt(event.target.value, 10));
    let result;
    if (storeId && foodGroupId) {
      result = await call(
        `api/stores/${storeId}/food_groups/${foodGroupId}/food?page=${
          page + 1
        }&page_size=${parseInt(event.target.value, 10)}&q=${searchQuery}`,
        "GET",
        null
      );
    } else {
      result = await call(
        `api/food?page=${page + 1}&page_size=${parseInt(
          event.target.value,
          10
        )}&q=${searchQuery}`,
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
    if (storeId && foodGroupId) {
      result = await call(
        `api/stores/${storeId}/food_groups/${foodGroupId}/food?page=${
          newPage + 1
        }&page_size=${rowsPerPage}&q=${searchQuery}`,
        "GET",
        null
      );
    } else {
      result = await call(
        `api/food?page=${
          newPage + 1
        }&page_size=${rowsPerPage}&q=${searchQuery}`,
        "GET",
        null
      );
    }
    dispatch({ type: "setList", payload: { list: result.data } });
    setLoading(false);
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
        setToPage(toPage - 1);
      })
      .catch((err) => {
        console.log("Deletion cancelled.", err);
      });
  };

  const handleSearch = async () => {
    let result;

    if (storeId && foodGroupId) {
      result = await call(
        `api/stores/${storeId}/food_groups/${foodGroupId}/food?page=1&page_size=5&q=${searchQuery}`,
        "GET",
        null
      );
    } else {
      result = await call(
        `api/food?page=1&page_size=5&q=${searchQuery}`,
        "GET",
        null
      );
    }

    dispatch({ type: "setList", payload: { list: result.data } });
    dispatch({ type: "getTotal", payload: { total: result.paging.total } });
  };

  return (
    <div className="bg-primary-100 px-5 h-full overflow-y-scroll hide-scroll pt-24 pb-5">
      <div className="flex items-center">
        <Search
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
        />

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
          {(loading || isLoading) && (
            <Box sx={{ width: "100%" }}>
              <LinearProgress color="secondary" />
            </Box>
          )}
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="left">ID</TableCell>
                <TableCell align="left">Avatar</TableCell>
                <TableCell align="left">Food Name</TableCell>
                <TableCell align="left">Slug</TableCell>
                <TableCell align="left">Price</TableCell>
                <TableCell align="left">Discount Rate</TableCell>
                <TableCell align="left">Discounted Price</TableCell>
                <TableCell align="left">Food Group Name</TableCell>
                <TableCell align="left">Store Name</TableCell>
                <TableCell align="right" />
              </TableRow>
            </TableHead>

            <TableBody>
              {state.list &&
                state.list.map((food) => (
                  <TableRow key={food.id}>
                    <TableCell align="left">{food.id}</TableCell>
                    <TableCell align="left">
                      <img
                        src={food.avatar}
                        className="w-10 h-10 rounded-full object-cover"
                        alt={food.name}
                      />
                    </TableCell>
                    <TableCell align="left">{food.name}</TableCell>
                    <TableCell align="left">{food.slug}</TableCell>
                    <TableCell align="left">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(food.price)}
                    </TableCell>
                    <TableCell align="left">{food.discount} %</TableCell>
                    <TableCell align="left">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(food.discounted_price)}
                    </TableCell>
                    <TableCell align="left">
                      <Link
                        to={`/stores/${food.food_group.store_id}/food-group/detail/${food.food_group.id}`}
                      >
                        {food.food_group.name}
                      </Link>
                    </TableCell>
                    <TableCell align="left">
                      <Link to={`/stores/detail/${food.food_group.store_id}`}>
                        {food.food_group.store.name}
                      </Link>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="View Detail" arrow>
                        <IconButton aria-label="view">
                          <VisibilityIcon
                            data-currentfood={JSON.stringify(food)}
                            onClick={handleOpenDetail}
                          />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit" arrow>
                        <IconButton
                          aria-label="edit"
                          data-currentfood={JSON.stringify(food)}
                          onClick={handleOpenEdit}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete" arrow>
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

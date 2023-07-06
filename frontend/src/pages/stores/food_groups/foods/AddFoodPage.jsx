import {
  Autocomplete,
  Button,
  Card,
  Divider,
  FormHelperText,
  Stack,
  TextField,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ListFoodContext } from "../../../../stores/ListFoodContext";
import { call } from "../../../../utils/api";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import FoodValidationSchema from "../../../../validations/FoodValidation";

const AddFoodPage = () => {
  const location = useLocation();
  const { state, dispatch } = useContext(ListFoodContext);
  const navigate = useNavigate();
  const [foodGroupArr, setFoodGroupArr] = useState();

  const [selectStoreId, setSelectStoreId] = useState();
  const [addFood, setAddFood] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    food_group_id: location.state?.foodGroupId,
  });
  console.log(
    "🚀 ~ file: AddFoodaddFoodPage.jsx:26 ~ AddFoodaddFoodPage ~ addFood:",
    addFood
  );

  const formik = useFormik({
    initialValues: addFood,
    validationSchema: FoodValidationSchema,
    onSubmit: (values) => {
      console.log(values);
      if (location.state) {
        try {
          const callAPI = call(
            `api/stores/${location.state.storeId}/food_groups/${location.state.foodGroupId}/food`,
            "POST",
            values
          )
            .then((res) => {
              console.log("🚀 ~ file: AddFoodPage.jsx:50 ~ .then ~ res:", res);
              if (res.status == 422) {
                toast.error(`${res.data.errors.slug[0]}`, { autoClose: 1000 });
              } else {
                dispatch({ type: "addFood", item: values });
                toast.success("Add Successfully", { autoClose: 2000 });
                setTimeout(() => {
                  navigate(
                    `/stores/${location.state.storeId}/food-group/${location.state.foodGroupId}/food`,
                    {
                      state: {
                        storeId: location.state.storeId,
                        foodGroupId: location.state.foodGroupId,
                      },
                    }
                  );
                }, 1500);
              }
            })
            .catch((err) => console.log("add-error", err));

          console.log(callAPI);
        } catch (error) {
          console.log(error);
          toast.error("Something went wrong");
        }
      } else {
        try {
          call(
            `api/stores/${selectStoreId}/food_groups/${formik.values.food_group_id}/food`,
            "POST",
            values
          )
            .then((res) => {
              if (res.status === 422) {
                toast.error(res.data.errors.slug[0], { autoClose: 2000 });
              } else {
                dispatch({ type: "addFood", item: values });
                toast.success("Add Successfully", { autoClose: 1000 });
                setTimeout(() => {
                  navigate(
                    `/stores/${selectStoreId}/food-group/${formik.values.food_group_id}/food`,
                    {
                      state: {
                        storeId: selectStoreId,
                        foodGroupId: formik.values.food_group_id,
                      },
                    }
                  );
                }, 1500);
              }
            })
            .catch((err) => console.log("add-error", err));
        } catch (error) {
          console.log(error);
          toast.error("Something went wrong");
        }
      }
    },
  });

  const changeHandler = (e) => {
    setAddFood({ ...addFood, [e.target.name]: e.target.value });
  };

  const addHandler = async () => {
    try {
      call(
        `api/stores/${location.state.storeId}/food_groups/${location.state.foodGroupId}/food`,
        "POST",
        addFood
      )
        .then((res) => {
          dispatch({ type: "addFood", item: addFood });
          toast.success("Add Successfully", { autoClose: 1000 });
          setTimeout(() => {
            navigate(
              `/stores/${location.state.storeId}/food-group/${location.state.foodGroupId}/food`,
              {
                state: {
                  storeId: location.state.storeId,
                  foodGroupId: location.state.foodGroupId,
                },
              }
            );
          }, 1500);
        })
        .catch((err) => console.log("add-error", err));
    } catch (error) {
      console.log(error);
      // toast.error('Something went wrong');
    }
  };

  useEffect(() => {
    const foodGroupArr = [];
    const fetchData = async () => {
      const rs = await call("api/food-groups?page_size=1000");
      rs.data.map((item) =>
        foodGroupArr.push({
          label: item.name,
          id: item.id,
          storeId: item.store_id,
        })
      );
      setFoodGroupArr(foodGroupArr);
    };
    fetchData();
  }, []);

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <div className="h-full bg-violet-50 px-5 pt-24 pb-5 overflow-y-scroll hide-scroll">
          <p className="font-semibold mb-2 text-lg">Add Food</p>
          <Divider />
          <div className="flex items-center w-full justify-center">
            <Card sx={{ py: 2, my: 2 }}>
              <div className="px-4 flex justify-between items-center mb-2">
                <p className="font-semibold">Food Information</p>
                <small>
                  Please confirm the information carefully before saving
                </small>
              </div>
              <Divider />
              <Stack direction="column" spacing={2} m={2}>
                <TextField
                  variant="outlined"
                  placeholder="Name of food"
                  label="Name of food"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                />
                <TextField
                  variant="outlined"
                  placeholder="Slug"
                  label="Slug"
                  name="slug"
                  value={formik.values.slug}
                  onChange={formik.handleChange}
                  error={formik.touched.slug && Boolean(formik.errors.slug)}
                  helperText={formik.touched.slug && formik.errors.slug}
                />
                <TextField
                  variant="outlined"
                  placeholder="Price"
                  label="Price"
                  name="price"
                  value={formik.values.price.replace(
                    /\B(?=(\d{3})+(?!\d))/g,
                    ","
                  )}
                  onChange={(e) => {
                    formik.setFieldValue(
                      "price",
                      e.target.value.replace(/,/g, "")
                    );
                  }}
                  error={formik.touched.price && Boolean(formik.errors.price)}
                  helperText={formik.touched.price && formik.errors.price}
                />

                {foodGroupArr && (
                  <>
                    <Autocomplete
                      disablePortal
                      disabled={location.state ? true : false}
                      id="combo-box-demo"
                      options={foodGroupArr}
                      value={
                        location.state
                          ? foodGroupArr.find(
                              (item) => item.id == formik.values.food_group_id
                            )?.label
                          : null
                      }
                      onChange={(e, value) => {
                        formik.setFieldValue("food_group_id", value?.id);
                        setSelectStoreId(value?.storeId);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Food Group"
                          error={
                            formik.touched.food_group_id &&
                            Boolean(formik.errors.food_group_id)
                          }
                          helperText={
                            formik.touched.food_group_id &&
                            formik.errors.food_group_id
                          }
                        />
                      )}
                    />
                  </>
                )}
              </Stack>

              <TextField
                sx={{ mx: 2, width: "800px" }}
                placeholder="Description about food"
                multiline
                label="Description about food"
                rows={10}
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                error={
                  formik.touched.description &&
                  Boolean(formik.errors.description)
                }
                helperText={
                  formik.touched.description && formik.errors.description
                }
                // fullWidth
              />
            </Card>
          </div>
          <div className="w-full items-center justify-center flex">
            <Button
              variant="contained"
              sx={{
                mt: 2,
                width: "fit-content",
              }}
              type="submit"
              // onClick={addHandler}
            >
              ADD
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddFoodPage;

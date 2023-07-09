import {
  Autocomplete,
  Button,
  Card,
  CircularProgress,
  Divider,
  Stack,
  TextField,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { call } from "../../../../utils/api";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { ListFoodContext } from "../../../../stores/ListFoodContext";
import { numberWithCommas } from "../../../../utils/func";
import { useFormik } from "formik";
import FoodValidationSchema from "../../../../validations/FoodValidation";

const EditFoodPage = () => {
  const { storeId, foodGroupId, foodId } = useParams();
  const { state, dispatch } = useContext(ListFoodContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [foodGroupArr, setFoodGroupArr] = useState();

  const [updateFood, setUpdateFood] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    food_group_id: foodGroupId,
  });
  console.log(
    "🚀 ~ file: EditFoodGroupPage.jsx:33 ~ EditFoodGroupPage ~ updateFood:",
    updateFood
  );

  const formik = useFormik({
    initialValues: updateFood,
    validationSchema: FoodValidationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      values.price = values.price.replace(/,/g, "");
      console.log(
        "🚀 ~ file: EditFoodPage.jsx:67 ~ EditFoodPage ~ values:",
        values
      );
      delete values.laravel_through_key;
      console.log(values);
      try {
        call(
          `api/stores/${storeId}/food_groups/${foodGroupId}/food/${foodId}`,
          "PUT",
          values
        )
          .then((res) => {
            console.log("🚀 ~ file: EditFoodPage.jsx:51 ~ .then ~ res:", res);
            if (res.status != 200) {
              if (res.data.errors) {
                for (var key in res.data.errors) {
                  var value = res.data.errors[key][0];
                  console.log(value);
                  toast.error(value, { autoClose: 2000 });
                }
              } else {
                toast.error(res.data.message, { autoClose: 2000 });
              }
            } else {
              dispatch({ type: "updateFood", item: values });
              toast.success("Update Successfully", { autoClose: 1000 });
              setTimeout(() => {
                navigate(`/stores/${storeId}/food-group/${foodGroupId}/food`, {
                  state: { storeId, foodGroupId },
                });
              }, 1500);
            }
          })
          .catch((err) => console.log("add-error", err));
      } catch (error) {
        console.log(error);
        // toast.error('Something went wrong');
      }
    },
  });

  //func
  const changeHandler = (e) => {
    setUpdateFood({ ...updateFood, [e.target.name]: e.target.value });
  };

  const updateHandler = async () => {
    try {
      call(
        `api/stores/${storeId}/food_groups/${foodGroupId}/food/${foodId}`,
        "PUT",
        updateFood
      )
        .then((res) => {
          dispatch({ type: "updateFood", item: updateFood });
          toast.success("Update Successfully", { autoClose: 1000 });
          setTimeout(() => {
            navigate(`/stores/${storeId}/food-group/${foodGroupId}/food`, {
              state: { storeId, foodGroupId },
            });
          }, 1500);
        })
        .catch((err) => console.log("add-error", err));
      // toast.success('Add Successfully', { autoClose: 2000 });
    } catch (error) {
      console.log(error);
      // toast.error('Something went wrong');
    }
  };

  useEffect(() => {
    setLoading(true);
    const data = call(
      `api/stores/${storeId}/food_groups/${foodGroupId}/food/${foodId}`,
      "GET",
      null
    );
    data.then((response) => {
      setUpdateFood({
        ...response.data,
        price: numberWithCommas(response.data.price),
      });
      // setUpdateFood(response.data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const foodGroupArr = [];
    const fetchData = async () => {
      const rs = await call("api/food-groups?page_size=1000");
      rs.data.map((item) =>
        foodGroupArr.push({
          label: item.name,
          id: item.id,
        })
      );
      setFoodGroupArr(foodGroupArr);
    };
    fetchData();
  }, []);
  return (
    <>
      {!loading ? (
        <div>
          <form onSubmit={formik.handleSubmit}>
            <div className="h-full bg-violet-50 px-5 pt-24 pb-5 overflow-y-scroll hide-scroll">
              <p className="font-semibold mb-2 text-lg">
                Edit Food Information
              </p>
              <Divider />
              <div className="flex items-center w-full justify-center">
                <Card sx={{ py: 2, my: 2 }}>
                  <div className="px-4 flex justify-between items-center mb-2">
                    <p className="font-semibold">
                      {" "}
                      Food{" "}
                      <span className="text-primary-500">
                        {updateFood.name}
                      </span>
                    </p>
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
                        console.log(e.target.value.replace(/,/g, ""));
                        formik.setFieldValue(
                          "price",
                          e.target.value.replace(/,/g, "")
                        );
                      }}
                      error={
                        formik.touched.price && Boolean(formik.errors.price)
                      }
                      helperText={formik.touched.price && formik.errors.price}
                    />

                    {foodGroupArr && (
                      <Autocomplete
                        disablePortal
                        disabled={location.state ? true : false}
                        id="combo-box-demo"
                        options={foodGroupArr}
                        value={foodGroupArr.find(
                          (item) => item.id === formik.values.food_group_id
                        )}
                        onChange={(e, value) => {
                          formik.setFieldValue("food_group_id", value?.id);
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
                  // onClick={updateHandler}
                >
                  SAVE
                </Button>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-violet-50">
          <CircularProgress color="secondary" />
        </div>
      )}
    </>
  );
};

export default EditFoodPage;

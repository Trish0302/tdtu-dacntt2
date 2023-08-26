import {
  Autocomplete,
  Button,
  Card,
  CircularProgress,
  Divider,
  FormHelperText,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ListFoodContext } from "../../../../stores/ListFoodContext";
import { call, callUpload } from "../../../../utils/api";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import FoodValidationSchema from "../../../../validations/FoodValidation";
import PercentIcon from "@mui/icons-material/Percent";
import { convertToSlug } from "../../../../utils/func";

const AddFoodPage = () => {
  const location = useLocation();
  const { state, dispatch } = useContext(ListFoodContext);
  const navigate = useNavigate();
  const [foodGroupArr, setFoodGroupArr] = useState();
  const [storeArr, setStoreArr] = useState();
  console.log(
    "🚀 ~ file: AddFoodPage.jsx:25 ~ AddFoodPage ~ foodGroupArr:",
    foodGroupArr
  );
  const [loadingCallAPI, setLoadingCallAPI] = useState(false);

  const [addFood, setAddFood] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    discount: "",
    food_group_id: location.state?.foodGroupId,
    store_id: location.state?.storeId,
    avatar: "",
  });
  console.log(
    "🚀 ~ file: AddFoodaddFoodPage.jsx:26 ~ AddFoodaddFoodPage ~ addFood:",
    addFood
  );
  const [previewPic, setPreviewPic] = useState();
  const [selectStoreId, setSelectStoreId] = useState();

  const changeUploadPicHandler = (e) => {
    // console.log(e.target.files[0]);
    setPreviewPic(URL.createObjectURL(e.target.files[0]));
    formik.setFieldValue("avatar", e.target.files[0]);
  };

  const formik = useFormik({
    initialValues: addFood,
    validationSchema: FoodValidationSchema,
    onSubmit: (values) => {
      console.log(values);
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("slug", values.slug);
      formData.append("description", values.description);
      formData.append("price", values.price);
      formData.append("food_group_id", values.food_group_id);
      formData.append("discount", values.discount);
      formData.append("avatar", values.avatar);

      if (location.state) {
        setLoadingCallAPI(true);
        try {
          const callAPI = callUpload(
            `api/stores/${location.state.storeId}/food_groups/${location.state.foodGroupId}/food`,
            "POST",
            formData
          )
            .then((res) => {
              if (res) {
                setLoadingCallAPI(false);
              }
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
        setLoadingCallAPI(true);
        try {
          callUpload(
            `api/stores/${selectStoreId}/food_groups/${formik.values.food_group_id}/food`,
            "POST",
            formData
          )
            .then((res) => {
              if (res) {
                setLoadingCallAPI(false);
              }
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

  useEffect(() => {
    const storeArr = [];
    const fetchData = async () => {
      // const rs = await call("api/food-groups?page_size=1000");
      const rs = await call("api/stores?page_size=1000");
      rs.data.map((item) =>
        storeArr.push({
          label: item.name,
          id: item.id,
        })
      );
      setStoreArr(storeArr);
    };
    fetchData();
  }, []);
  useEffect(() => {
    const foodGroupArr = [];
    const fetchData = async () => {
      // const rs = await call("api/food-groups?page_size=1000");
      const rs = await call(
        `api/stores/${location.state.storeId}/food_groups?page_size=1000`
      );
      rs.data.map((item) =>
        foodGroupArr.push({
          label: item.name,
          id: item.id,
        })
      );
      setFoodGroupArr(foodGroupArr);
    };
    if (location.state?.storeId) {
      fetchData();
    }
  }, []);

  useEffect(() => {
    const foodGroupArr = [];
    const fetchData = async () => {
      // const rs = await call("api/food-groups?page_size=1000");
      const rs = await call(
        `api/stores/${selectStoreId}/food_groups?page_size=1000`
      );
      rs.data.map((item) =>
        foodGroupArr.push({
          label: item.name,
          id: item.id,
        })
      );
      setFoodGroupArr(foodGroupArr);
    };

    if (selectStoreId) {
      fetchData();
    }
  }, [selectStoreId]);

  return (
    <div className="h-full">
      <form onSubmit={formik.handleSubmit} className="h-full">
        <div className="h-full bg-primary-100 px-5 pt-24 pb-5 overflow-y-scroll hide-scroll">
          <p className="font-semibold mb-2 text-lg">Add Food</p>
          <Divider />
          <Stack
            direction="row"
            spacing={5}
            mt={2}
            px={4}
            sx={{ display: "flex" }}
          >
            <Card
              sx={{ p: 2, flex: 1, flexBasis: "30%" }}
              className="basis-1/4"
            >
              {!previewPic ? (
                <div className="flex justify-between w-full h-full">
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="dropzone-file"
                      className="flex flex-col items-center justify-center w-full h-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6 px-3 text-center ">
                        <svg
                          aria-hidden="true"
                          className="w-10 h-10 mb-3 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          ></path>
                        </svg>
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">
                            Upload Food Image
                          </span>{" "}
                          or drag to this section
                        </p>
                        <p className="text-xs text-gray-500">
                          Format JPEG, PNG,JPG
                        </p>
                      </div>
                      <input
                        id="dropzone-file"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={changeUploadPicHandler}
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <div className="w-full flex flex-col gap-4 justify-center items-center ">
                  <img
                    src={previewPic}
                    className="h-[300px] w-fit object-cover rounded-lg shadow-md block"
                  />

                  <Button variant="outlined" color="error" className="w-full">
                    <label htmlFor="dropzone-file1" className="w-full">
                      Select another image
                    </label>
                  </Button>
                  <input
                    id="dropzone-file1"
                    type="file"
                    className="hidden"
                    onChange={changeUploadPicHandler}
                  />
                </div>
              )}
            </Card>
            <Card sx={{ py: 2, my: 2 }} className="basis-3/4">
              <div className="px-4 flex justify-between items-center mb-2">
                <p className="font-semibold">Food Information</p>
                <small>
                  Please confirm the information carefully before saving
                </small>
              </div>
              <Divider />
              <Stack
                direction="column"
                spacing={2}
                pt={2}
                px={2}
                sx={{ width: "100%" }}
              >
                <TextField
                  variant="outlined"
                  placeholder="Name of food"
                  label="Name of food"
                  name="name"
                  value={formik.values.name}
                  disabled={true}
                  onChange={(e) => {
                    formik.setFieldValue("slug", convertToSlug(e.target.value));
                    formik.setFieldValue("name", e.target.value);
                  }}
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

                {storeArr && (
                  <>
                    <Autocomplete
                      disablePortal
                      disabled={location.state ? true : false}
                      id=""
                      options={storeArr}
                      value={
                        storeArr.find(
                          (item) => item.id == formik.values.store_id
                        )?.label
                      }
                      onChange={(e, value) => {
                        formik.setFieldValue("store_id", value?.id);
                        setSelectStoreId(value?.id);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Store"
                          error={
                            formik.touched.store_id &&
                            Boolean(formik.errors.store_id)
                          }
                          helperText={
                            formik.touched.store_id && formik.errors.store_id
                          }
                        />
                      )}
                    />
                  </>
                )}

                {foodGroupArr && (
                  <>
                    <Autocomplete
                      disablePortal
                      disabled={location.state ? true : false}
                      id="combo-box-demo"
                      options={foodGroupArr}
                      value={
                        foodGroupArr.find(
                          (item) => item.id == formik.values.food_group_id
                        )?.label
                      }
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
                  </>
                )}

                <TextField
                  variant="outlined"
                  placeholder="Discount"
                  label="Discount (%)"
                  name="discount"
                  value={formik.values.discount}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.discount && Boolean(formik.errors.discount)
                  }
                  helperText={formik.touched.discount && formik.errors.discount}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment>
                        <PercentIcon />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  sx={{ width: "100%" }}
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
              </Stack>
            </Card>
          </Stack>
          <div className="w-full items-center justify-center flex">
            <Button
              variant="contained"
              sx={{
                mt: 2,
                width: "fit-content",
                textTransform: "uppercase",
                paddingX: "20px",
                background: "#ef6351",
                color: "white",
                ":hover": {
                  background: "#ffa397",
                },
              }}
              disabled={loadingCallAPI}
              type="submit"
            >
              {loadingCallAPI ? (
                <CircularProgress size="1.5rem" color="secondary" />
              ) : (
                "ADD"
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddFoodPage;

import {
  Autocomplete,
  Button,
  Card,
  CircularProgress,
  Divider,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { call, callUpload } from "../../../../utils/api";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { ListFoodContext } from "../../../../stores/ListFoodContext";
import { numberWithCommas } from "../../../../utils/func";
import { useFormik } from "formik";
import FoodValidationSchema from "../../../../validations/FoodValidation";
import PercentIcon from "@mui/icons-material/Percent";

const EditFoodPage = () => {
  const { storeId, foodGroupId, foodId } = useParams();
  const { state, dispatch } = useContext(ListFoodContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [foodGroupArr, setFoodGroupArr] = useState();
  const [storeArr, setStoreArr] = useState();
  console.log(
    "🚀 ~ file: EditFoodPage.jsx:29 ~ EditFoodPage ~ storeArr:",
    storeArr
  );

  const [updateFood, setUpdateFood] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    discount: "",
    food_group_id: foodGroupId,
    store_id: storeId,
  });
  console.log(
    "🚀 ~ file: EditFoodGroupPage.jsx:33 ~ EditFoodGroupPage ~ updateFood:",
    updateFood
  );

  const [selectStoreId, setSelectStoreId] = useState();
  console.log(
    "🚀 ~ file: EditFoodPage.jsx:49 ~ EditFoodPage ~ selectStoreId:",
    selectStoreId
  );

  const [previewPic, setPreviewPic] = useState();
  const [loadingCallAPI, setLoadingCallAPI] = useState(false);

  const changeUploadPicHandler = (e) => {
    // console.log(e.target.files[0]);
    setPreviewPic(URL.createObjectURL(e.target.files[0]));
    formik.setFieldValue("avatar", e.target.files[0]);
  };

  const formik = useFormik({
    initialValues: updateFood,
    validationSchema: FoodValidationSchema,
    enableReinitialize: true,
    validate: (values) => {
      console.log("loi", values);
    },
    onSubmit: (values) => {
      values.price = values.price.replace(/,/g, "");
      console.log(
        "🚀 ~ file: EditFoodPage.jsx:67 ~ EditFoodPage ~ values:",
        values
      );
      delete values.laravel_through_key;
      console.log(values);

      const formData = new FormData();
      formData.append("id", foodId);
      formData.append("name", values.name);
      formData.append("slug", values.slug);
      formData.append("description", values.description);
      formData.append("price", values.price);
      formData.append("food_group_id", values.food_group_id);
      formData.append("discount", values.discount);
      formData.append("avatar", values.avatar);
      formData.append("_method", "PUT");
      setLoadingCallAPI(true);
      try {
        callUpload(
          `api/stores/${storeId}/food_groups/${foodGroupId}/food/${foodId}`,
          "POST",
          formData
        )
          .then((res) => {
            if (res) {
              setLoadingCallAPI(false);
            }
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
                navigate(
                  `/stores/${selectStoreId}/food-group/${values.food_group_id}/food`,
                  {
                    state: {
                      storeId: selectStoreId,
                      foodGroupId: values.food_group_id,
                    },
                  }
                );
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

  useEffect(() => {
    setLoading(true);
    const data = call(`api/food/${foodId}`, "GET", null);
    data.then((response) => {
      console.log(response);
      setUpdateFood({
        ...response.data,
        price: numberWithCommas(response.data.price),
        store_id: response.data.food_group.store_id,
      });
      setPreviewPic(response.data.avatar);
      // setUpdateFood(response.data);
      setSelectStoreId(response.data.food_group.store_id);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const storeArr = [];
    const fetchData = async () => {
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
        <div className="h-full">
          <form onSubmit={formik.handleSubmit} className="h-full">
            <div className="h-full bg-primary-100 px-5 pt-24 pb-5 overflow-y-scroll hide-scroll">
              <p className="font-semibold mb-2 text-lg">
                Edit Food Information
              </p>
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

                      <Button
                        variant="outlined"
                        color="error"
                        className="w-full"
                      >
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

                    {storeArr && (
                      <>
                        <Autocomplete
                          disablePortal
                          disabled={location.state ? true : false}
                          options={storeArr}
                          value={storeArr.find(
                            (item) => item.id == formik.values.store_id
                          )}
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
                                formik.touched.store_id &&
                                formik.errors.store_id
                              }
                            />
                          )}
                        />
                      </>
                    )}

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

                    <TextField
                      variant="outlined"
                      placeholder="Discount"
                      label="Discount (%)"
                      name="discount"
                      value={formik.values.discount}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.discount &&
                        Boolean(formik.errors.discount)
                      }
                      helperText={
                        formik.touched.discount && formik.errors.discount
                      }
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
                    "SAVE"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-primary-100">
          <CircularProgress color="secondary" />
        </div>
      )}
    </>
  );
};

export default EditFoodPage;

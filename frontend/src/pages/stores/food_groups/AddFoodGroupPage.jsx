import {
  Autocomplete,
  Button,
  Card,
  Divider,
  Stack,
  TextField,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { call } from "../../../utils/api";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { ListFoodGroupContext } from "../../../stores/ListFoodGroupContext";
import { useFormik } from "formik";
import FoodGroupValidationSchema from "../../../validations/FoodGroupValidation";

const AddFoodGroupPage = () => {
  const location = useLocation();
  const { state, dispatch } = useContext(ListFoodGroupContext);
  const navigate = useNavigate();

  const [storeArr, setStoreArr] = useState();
  console.log(
    "🚀 ~ file: AddFoodGroupPage.jsx:23 ~ AddFoodGroupPage ~ storeArr:",
    storeArr
  );
  const [addFoodGroup, setAddFoodGroup] = useState({
    name: "",
    slug: "",
    description: "",
    store_id: location.state?.storeId,
  });
  console.log(
    "🚀 ~ file: AddFoodaddFoodGroupPage.jsx:26 ~ AddFoodaddFoodGroupPage ~ addFoodGroup:",
    addFoodGroup
  );

  const formik = useFormik({
    initialValues: addFoodGroup,
    validationSchema: FoodGroupValidationSchema,
    onSubmit: (values) => {
      // console.log(values);
      try {
        if (location.state) {
          call(
            `api/stores/${location.state.storeId}/food_groups`,
            "POST",
            values
          )
            .then((res) => {
              if (res.status === 422) {
                toast.error(res.data.errors.slug[0], { autoClose: 2000 });
              } else {
                dispatch({ type: "addFoodGroup", item: values });
                toast.success("Add Successfully", { autoClose: 1000 });
                setTimeout(() => {
                  navigate(`/stores/${location.state.storeId}/food-group`, {
                    state: { storeId: location.state.storeId },
                  });
                }, 1500);
              }
            })
            .catch((err) => console.log("add-error", err));
        } else {
          call(
            `api/stores/${formik.values.store_id}/food_groups`,
            "POST",
            values
          )
            .then((res) => {
              console.log(res);
              if (res.status === 422) {
                toast.error(res.data.errors.slug[0], { autoClose: 2000 });
              } else {
                dispatch({ type: "addFoodGroup", item: values });
                toast.success("Add Successfully", { autoClose: 1000 });
                setTimeout(() => {
                  navigate(`/food-groups`);
                }, 1500);
              }
            })
            .catch((err) => console.log("add-error", err));
        }
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong");
      }
    },
  });
  const changeHandler = (e) => {
    setAddFoodGroup({ ...addFoodGroup, [e.target.name]: e.target.value });
  };

  const addHandler = async () => {
    try {
      call(
        `api/stores/${location.state.storeId}/food_groups`,
        "POST",
        addFoodGroup
      )
        .then((res) => {
          dispatch({ type: "addFoodGroup", item: addFoodGroup });
          toast.success("Add Successfully", { autoClose: 1000 });
          setTimeout(() => {
            navigate(`/stores/${location.state.storeId}/food-group`, {
              state: { storeId: location.state.storeId },
            });
          }, 1500);
        })
        .catch((err) => console.log("add-error", err));
    } catch (error) {
      console.log(error);
      // toast.error('Something went wrong');
    }
  };

  useEffect(() => {
    const storeArr = [];
    const fetchData = async () => {
      const rs = await call("api/stores?page_size=1000");
      rs.data.map((item) => storeArr.push({ label: item.name, id: item.id }));
      setStoreArr(storeArr);
    };
    fetchData();
  }, []);

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <div className="h-full bg-violet-50 px-5 pt-24 pb-5 overflow-y-scroll hide-scroll">
          <p className="font-semibold mb-2 text-lg">Add Food Group </p>
          <Divider />
          <div className="flex items-center w-full justify-center">
            <Card sx={{ py: 2, my: 2 }}>
              <div className="px-4 flex justify-between items-center mb-2">
                <p className="font-semibold">Food Group Information</p>
                <small>
                  Please confirm the information carefully before saving
                </small>
              </div>
              <Divider />
              <Stack direction="column" spacing={2} m={2}>
                <TextField
                  variant="outlined"
                  placeholder="Name of Food group"
                  label="Name of Food group"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                  fullWidth
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
                  fullWidth
                />

                {storeArr && (
                  <Autocomplete
                    disablePortal
                    disabled={location.state ? true : false}
                    id="combo-box-demo"
                    options={storeArr}
                    value={
                      storeArr.find((item) => item.id == formik.values.store_id)
                        ?.label
                    }
                    defaultValue={
                      storeArr.find((item) => item.id == location.state.storeId)
                        ?.label
                    }
                    onChange={(e, value) =>
                      formik.setFieldValue("store_id", value?.id)
                    }
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
                )}
              </Stack>

              <TextField
                sx={{ mx: 2, width: "800px" }}
                placeholder="Description about food group"
                multiline
                label="Description about food group"
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

export default AddFoodGroupPage;

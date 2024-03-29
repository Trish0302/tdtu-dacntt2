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
import { call } from "../../../utils/api";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ListFoodGroupContext } from "../../../stores/ListFoodGroupContext";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import FoodGroupValidationSchema from "../../../validations/FoodGroupValidation";
import { convertToSlug } from "../../../utils/func";

const EditFoodGroupPage = () => {
  const { storeId, id } = useParams();
  const { state, dispatch } = useContext(ListFoodGroupContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [storeArr, setStoreArr] = useState();
  const [updateFoodGroup, setUpdateFoodGroup] = useState({
    name: "",
    slug: "",
    description: "",
    store_id: storeId,
  });
  console.log(
    "🚀 ~ file: EditFoodGroupPage.jsx:33 ~ EditFoodGroupPage ~ updateFoodGroup:",
    updateFoodGroup
  );

  const formik = useFormik({
    initialValues: updateFoodGroup,
    validationSchema: FoodGroupValidationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      console.log(values);
      try {
        call(`api/stores/${storeId}/food_groups/${id}`, "PUT", values)
          .then((res) => {
            if (res.status === 422) {
              toast.error(res.data.errors.slug[0], { autoClose: 2000 });
            } else {
              dispatch({ type: "updateFoodGroup", item: values });
              toast.success("Update Successfully", { autoClose: 1000 });
              setTimeout(() => {
                navigate(`/stores/${storeId}/food-group`, {
                  state: { storeId: storeId },
                });
              }, 1500);
            }
          })
          .catch((err) => console.log("add-error", err));
      } catch (error) {
        console.log(error);
      }
    },
  });

  //func

  useEffect(() => {
    setLoading(true);
    const data = call(`api/stores/${storeId}/food_groups/${id}`, "GET", null);
    data.then((response) => {
      console.log(
        "🚀 ~ file: EditFoodGroupPage.jsx:57 ~ data.then ~ response:",
        response
      );

      setUpdateFoodGroup(response.data);
      setLoading(false);
    });
  }, []);

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
    <>
      {!loading ? (
        <div className="h-full">
          <form onSubmit={formik.handleSubmit} className="h-full">
            <div className="h-full bg-primary-100 px-5 pt-24 pb-5 overflow-y-scroll hide-scroll">
              <p className="font-semibold mb-2 text-lg">
                Edit Food group Information
              </p>
              <Divider />
              <div className="flex items-center w-full justify-center">
                <Card sx={{ py: 2, my: 2 }} className="basis-3/4">
                  <div className="px-4 flex justify-between items-center mb-2">
                    <p className="font-semibold">
                      Food Group{" "}
                      <span className="text-primary-500">
                        {updateFoodGroup.name}
                      </span>
                    </p>{" "}
                    <small>
                      Please confirm the information carefully before saving
                    </small>
                  </div>
                  <Divider />
                  <Stack
                    direction="column"
                    spacing={2}
                    px={2}
                    pt={2}
                    sx={{ width: "100%" }}
                  >
                    <TextField
                      variant="outlined"
                      placeholder="Name of Food group"
                      label="Name of Food group"
                      name="name"
                      value={formik.values.name}
                      onChange={(e) => {
                        formik.setFieldValue(
                          "slug",
                          convertToSlug(e.target.value)
                        );
                        formik.setFieldValue("name", e.target.value);
                      }}
                      error={formik.touched.name && Boolean(formik.errors.name)}
                      helperText={formik.touched.name && formik.errors.name}
                      fullWidth
                    />
                    <TextField
                      variant="outlined"
                      placeholder="Slug"
                      label="Slug"
                      name="slug"
                      disabled={true}
                      value={formik.values.slug}
                      onChange={formik.handleChange}
                      error={formik.touched.slug && Boolean(formik.errors.slug)}
                      helperText={formik.touched.slug && formik.errors.slug}
                      fullWidth
                    />
                    {storeArr && (
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={storeArr}
                        value={storeArr.find(
                          (item) => item.id === formik.values.store_id
                        )}
                        onChange={(e, value) =>
                          formik.setFieldValue("store_id", value?.id)
                        }
                        disabled={true}
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

                    <TextField
                      sx={{ width: "100%" }}
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
                  </Stack>
                </Card>
              </div>
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
                  type="submit"
                >
                  SAVE
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

export default EditFoodGroupPage;

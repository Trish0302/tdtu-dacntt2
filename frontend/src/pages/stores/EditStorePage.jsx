import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ListStoreContext } from "../../stores/ListStoreContext";
import { call } from "../../utils/api";
import {
  Autocomplete,
  Button,
  Card,
  CircularProgress,
  Divider,
  Stack,
  TextField,
} from "@mui/material";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import storeValidationSchema from "../../validations/StoreValidation";

const EditStorePage = () => {
  const { id } = useParams();
  const { state, dispatch } = useContext(ListStoreContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [userArr, setUserArr] = useState();
  console.log(
    "🚀 ~ file: EditStorePage.jsx:23 ~ EditStorePage ~ userArr:",
    userArr
  );
  const [updateStore, setUpdateStore] = useState({
    name: "",
    address: "",
    description: "",
    user_id: "",
  });
  console.log(
    "🚀 ~ file: EditUserPage.jsx:33 ~ EditUserPage ~ updateStore:",
    updateStore
  );

  const formik = useFormik({
    initialValues: updateStore,
    enableReinitialize: true,
    validationSchema: storeValidationSchema,

    onSubmit: (values) => {
      try {
        call(`api/stores/${id}`, "PUT", values)
          .then((res) => {
            dispatch({ type: "updateStore", item: values });
            toast.success("Update Successfully", { autoClose: 1000 });
            setTimeout(() => {
              navigate("/stores");
            }, 1500);
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
    setUpdateStore({ ...updateStore, [e.target.name]: e.target.value });
  };

  const updateHandler = async () => {
    try {
      call(`api/stores/${id}`, "PUT", updateStore)
        .then((res) => {
          dispatch({ type: "updateStore", item: updateStore });
          toast.success("Update Successfully", { autoClose: 1000 });
          setTimeout(() => {
            navigate("/stores");
          }, 1500);
        })
        .catch((err) => console.log("add-error", err));
    } catch (error) {
      console.log(error);
      // toast.error('Something went wrong');
    }
  };

  useEffect(() => {
    setLoading(true);
    const data = call(`api/stores/${id}`, "GET", null);
    data.then((response) => {
      setUpdateStore(response.data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const userArr = [];
    const fetchUser = async () => {
      const rs = await call("api/users");
      rs.data.map((item) => userArr.push({ label: item.name, id: item.id }));
      setUserArr(userArr);
    };
    fetchUser();
  }, []);
  return (
    <>
      {!loading ? (
        <div>
          <form onSubmit={formik.handleSubmit}>
            <div className="h-full bg-violet-50 px-5 pt-24 pb-5 overflow-y-scroll hide-scroll">
              <p className="font-semibold mb-2 text-lg">
                Edit information of Store
              </p>
              <Divider />
              <div className="flex items-center w-full justify-center">
                <Card sx={{ py: 2, my: 2 }}>
                  <div className="px-4 flex justify-between items-center mb-2">
                    <p className="font-semibold">
                      Store{" "}
                      <span className="text-primary-500">
                        {updateStore.name}
                      </span>
                    </p>
                    <small>
                      Please confirm the information carefully before saving
                    </small>
                  </div>
                  <Divider />
                  <div className="px-4">
                    <Stack
                      direction="column"
                      spacing={2}
                      pt={2}
                      sx={{ width: "100%" }}
                    >
                      <TextField
                        variant="outlined"
                        placeholder="Name of Store"
                        label="Name of Store"
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.name && Boolean(formik.errors.name)
                        }
                        helperText={formik.touched.name && formik.errors.name}
                      />
                      <TextField
                        variant="outlined"
                        placeholder="Address"
                        label="Address"
                        defaultValue={updateStore.address}
                        name="address"
                        value={formik.values.address}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.address &&
                          Boolean(formik.errors.address)
                        }
                        helperText={
                          formik.touched.address && formik.errors.address
                        }
                      />

                      {userArr && (
                        <Autocomplete
                          disablePortal
                          id="combo-box-demo"
                          options={userArr}
                          value={userArr.find(
                            (item) => item.id === formik.values.user_id
                          )}
                          onChange={(e, value) =>
                            formik.setFieldValue("user_id", value?.id)
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Owner"
                              error={
                                formik.touched.user_id &&
                                Boolean(formik.errors.user_id)
                              }
                              helperText={
                                formik.touched.user_id && formik.errors.user_id
                              }
                            />
                          )}
                        />
                      )}
                      <TextField
                        sx={{ mx: 2, width: "800px" }}
                        placeholder="Description about store"
                        multiline
                        label="Description about store"
                        rows={10}
                        name="description"
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.description &&
                          Boolean(formik.errors.description)
                        }
                        helperText={
                          formik.touched.description &&
                          formik.errors.description
                        }
                        // fullWidth
                      />
                    </Stack>
                  </div>
                </Card>
              </div>
              <div className="w-full items-center justify-center flex">
                <Button
                  variant="contained"
                  sx={{
                    mt: 2,
                    width: "fit-content",
                  }}
                  // onClick={updateHandler}
                  type="submit"
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

export default EditStorePage;

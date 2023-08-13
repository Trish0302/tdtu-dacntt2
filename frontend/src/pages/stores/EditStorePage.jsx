import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ListStoreContext } from "../../stores/ListStoreContext";
import { call, callUpload } from "../../utils/api";
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
  const [loadingCallAPI, setLoadingCallAPI] = useState(false);
  const navigate = useNavigate();
  const [previewPic, setPreviewPic] = useState();

  const [userArr, setUserArr] = useState();
  const [updateStore, setUpdateStore] = useState({
    name: "",
    address: "",
    description: "",
    user_id: "",
  });

  const formik = useFormik({
    initialValues: updateStore,
    enableReinitialize: true,
    validationSchema: storeValidationSchema,

    onSubmit: (values) => {
      const formData = new FormData();
      formData.append("id", id);
      formData.append("name", values.name);
      formData.append("address", values.address);
      formData.append("description", values.description);
      formData.append("user_id", values.user_id);
      formData.append("avatar", values.avatar);
      formData.append("_method", "PUT");

      try {
        setLoadingCallAPI(true);
        callUpload(`api/stores/${id}`, "POST", formData)
          .then((res) => {
            if (res) {
              setLoadingCallAPI(false);
            }
            console.log("🚀 ~ file: EditUserPage.jsx:65 ~ .then ~ res:", res);
            dispatch({ type: "updateStore", item: values });
            if (res.status == 200) {
              toast.success("Update Successfully", { autoClose: 1000 });
              setTimeout(() => {
                navigate("/stores");
              }, 1500);
            } else {
              let entries = Object.entries(res.data.message);
              console.log(
                "🚀 ~ file: AddUserPage.jsx:68 ~ .then ~ entries:",
                entries
              );
              entries.map(([key, value]) => {
                console.log("loi ne", key, value);

                formik.setFieldError(key, value[0]);
                toast.error(value[0], {
                  autoClose: 2000,
                });
              });
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
  const changeUploadPicHandler = (e) => {
    setPreviewPic(URL.createObjectURL(e.target.files[0]));
    formik.setFieldValue("avatar", e.target.files[0]);
  };

  useEffect(() => {
    setLoading(true);
    const data = call(`api/stores/${id}`, "GET", null);
    data.then((response) => {
      setUpdateStore(response.data);
      setPreviewPic(response.data.avatar);
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
        <div className="h-full">
          <form onSubmit={formik.handleSubmit} className="h-full">
            <div className="h-full bg-primary-100 px-5 pt-24 pb-5 overflow-y-scroll hide-scroll">
              <p className="font-semibold mb-2 text-lg">
                Edit information of Store
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
                      <div className="flex items-center justify-center w-full h-full">
                        <label
                          htmlFor="dropzone-file"
                          className="flex flex-col items-center justify-center w-full h-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6 px-3 text-center">
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
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                              <span className="font-semibold">
                                Upload Profile Image
                              </span>{" "}
                              or drag to this section
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
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
                        className="h-[300px] w-full object-cover rounded-lg shadow-md block"
                        alt={updateStore.name}
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
                        sx={{ width: "100%" }}
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
                    <CircularProgress color="secondary" size="1.5rem" />
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

export default EditStorePage;

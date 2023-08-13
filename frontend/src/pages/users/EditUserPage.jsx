import React, { useEffect } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Divider,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { useContext, useState } from "react";
import { call, callUpload } from "../../utils/api";
import { ListUserContext } from "../../stores/ListUserContext";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import userValidationSchema from "../../validations/UserValidation";
import userEditValidationSchema from "../../validations/UserEditValidation";

const EditUserPage = () => {
  const { id } = useParams();
  const { state, dispatch } = useContext(ListUserContext);
  const [loading, setLoading] = useState(false);
  const [loadingCallAPI, setLoadingCallAPI] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = React.useState(false);

  const [updateUser, setUpdateUser] = useState({
    name: "",
    phone: "",
    email: "",
    avatar: "",
    password: "",
    password_confirmation: "",
  });

  const [previewPic, setPreviewPic] = useState();

  const formik = useFormik({
    initialValues: { ...updateUser },
    validationSchema: userEditValidationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      console.log(values);
      const formData = new FormData();
      formData.append("id", id);
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("phone", values.phone);
      formData.append("avatar", values.avatar);
      formData.append("password", values.password);
      formData.append("password_confirmation", values.password_confirmation);
      formData.append("_method", "PUT");

      for (var pair of formData.entries()) {
        console.log(pair[0] + ", " + pair[1]);
      }

      try {
        setLoadingCallAPI(true);
        callUpload(`api/users/${id}`, "POST", formData)
          .then((res) => {
            if (res) {
              setLoadingCallAPI(false);
            }
            console.log("🚀 ~ file: EditUserPage.jsx:65 ~ .then ~ res:", res);
            dispatch({ type: "updateUser", item: values });
            if (res.status == 200) {
              toast.success("Update Successfully", { autoClose: 1000 });
              setTimeout(() => {
                navigate("/users");
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
    const data = call(`api/users/${id}`, "GET", null);
    data.then((response) => {
      setUpdateUser(response.data);
      setPreviewPic(response.data.avatar);
      setLoading(false);
    });
  }, []);

  return (
    <>
      {!loading ? (
        <div className="h-full">
          <form onSubmit={formik.handleSubmit} className="h-full">
            <div className="h-full bg-primary-100 px-5 pt-24 pb-5 overflow-y-scroll hide-scroll">
              <p className="font-semibold mb-2 text-lg">
                Edit User Information
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
                    <div className="flex justify-between w-full">
                      <div className="flex items-center justify-center w-full">
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
                        alt={updateUser.name}
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
                <Card sx={{ py: 2, flexBasis: "60%" }}>
                  <div className="px-4 flex justify-between items-center mb-2">
                    <p className="font-semibold">Personal Information</p>
                    <small>
                      Please confirm the information carefully before saving
                    </small>
                  </div>
                  <Divider />
                  <Stack direction="row" p={2} spacing={2}>
                    <Stack
                      direction="column"
                      spacing={2}
                      sx={{ width: "100%" }}
                    >
                      <TextField
                        fullWidth
                        id="name"
                        name="name"
                        label="Name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.name && Boolean(formik.errors.name)
                        }
                        helperText={formik.touched.name && formik.errors.name}
                      />

                      <TextField
                        fullWidth
                        id="email"
                        name="email"
                        label="Email"
                        disabled={true}
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.email && Boolean(formik.errors.email)
                        }
                        helperText={formik.touched.email && formik.errors.email}
                      />

                      <TextField
                        fullWidth
                        id="phone"
                        name="phone"
                        label="Phone"
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.phone && Boolean(formik.errors.phone)
                        }
                        helperText={formik.touched.phone && formik.errors.phone}
                      />
                    </Stack>
                  </Stack>
                  <Divider />
                  <div className="my-2 px-4">
                    <p className="font-semibold mb-2">Position Information</p>
                    <div className="flex justify-between pb-1 w-full gap-7">
                      <Box sx={{ width: "100%" }}>
                        <InputLabel className="mb-2">Role</InputLabel>
                        <FormControl fullWidth variant="outlined">
                          <InputLabel id="role">Role</InputLabel>
                          <Select
                            labelId="role"
                            id="demo-simple-select"
                            value={null}
                            label="Role"
                          >
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                      <Box sx={{ width: "100%" }}>
                        <InputLabel className="mb-2">
                          Belong to store
                        </InputLabel>
                        <FormControl fullWidth variant="outlined">
                          <InputLabel id="role">Belong to store</InputLabel>
                          <Select
                            labelId="role"
                            id="demo-simple-select"
                            value={null}
                            label="Belong to store"
                          >
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                    </div>
                  </div>
                  <Divider />
                  <div className="px-4 pt-2">
                    <Button>
                      <Link to={`/users/change-password/${id}`}>
                        Change Password
                      </Link>
                    </Button>
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
                  // onClick={addHandler}
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

export default EditUserPage;

import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
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
import React, { useContext, useState } from "react";
import { call } from "../../utils/api";
import { ListUserContext } from "../../stores/ListUserContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import userValidationSchema from "../../validations/UserValidation";
import { useFormik } from "formik";

const AddUserPage = () => {
  const { state, dispatch } = useContext(ListUserContext);
  const navigate = useNavigate();
  const [validation, setValidation] = useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = React.useState(false);

  const [previewPic, setPreviewPic] = useState();

  const [addUser, setAddUser] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  console.log(
    "🚀 ~ file: AddUserPage.jsx:26 ~ AddUserPage ~ addUser:",
    addUser
  );

  const formik = useFormik({
    initialValues: {
      name: "",
      phone: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
    validationSchema: userValidationSchema,
    onSubmit: (values) => {
      // alert(JSON.stringify(values, null, 2));

      try {
        call("api/users", "POST", values)
          .then((res) => {
            dispatch({ type: "addUser", item: values });
            toast.success("Add Successfully", { autoClose: 1000 });
            setTimeout(() => {
              navigate("/users");
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
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowPasswordConfirm = () =>
    setShowPasswordConfirm((show) => !show);
  const changeHandler = (e) => {
    setAddUser({ ...addUser, [e.target.name]: e.target.value });
  };
  const changeUploadPicHandler = (e) => {
    console.log(e.target.files[0]);
    setPreviewPic(URL.createObjectURL(e.target.files[0]));
  };

  const addHandler = async () => {
    // console.log(formik.values);
    // try {
    //   call("api/users", "POST", addUser)
    //     .then((res) => {
    //       dispatch({ type: "addUser", item: addUser });
    //       toast.success("Add Successfully", { autoClose: 1000 });
    //       setTimeout(() => {
    //         navigate("/users");
    //       }, 1500);
    //     })
    //     .catch((err) => console.log("add-error", err));
    //   // toast.success('Add Successfully', { autoClose: 2000 });
    // } catch (error) {
    //   console.log(error);
    //   // toast.error('Something went wrong');
    // }
  };

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <div className="h-full bg-violet-50 px-5 pt-24 pb-5 overflow-y-scroll hide-scroll">
          <p className="font-semibold mb-2 text-lg">Add User</p>
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
                      className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
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
            <Card sx={{ py: 2, flexBasis: "60%" }}>
              <div className="px-4 flex justify-between items-center mb-2">
                <p className="font-semibold">Personal Information</p>
                <small>
                  Please confirm the information carefully before saving
                </small>
              </div>
              <Divider />
              <Stack direction="row" p={2} spacing={2}>
                <Stack direction="column" spacing={2} sx={{ width: "100%" }}>
                  <TextField
                    fullWidth
                    id="name"
                    name="name"
                    label="Name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                  />

                  <TextField
                    fullWidth
                    id="email"
                    name="email"
                    label="Email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                  />

                  <TextField
                    fullWidth
                    id="phone"
                    name="phone"
                    label="Phone"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    error={formik.touched.phone && Boolean(formik.errors.phone)}
                    helperText={formik.touched.phone && formik.errors.phone}
                  />
                </Stack>
              </Stack>
              <Divider />
              <div className="my-2 px-4">
                <p className="font-semibold mb-2">Position Information</p>
                <div className="flex justify-between pb-1 w-full">
                  <Box sx={{ minWidth: 300 }}>
                    <InputLabel className="mb-2 italic">Role</InputLabel>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel id="role1">Role</InputLabel>
                      <Select
                        labelId="role1"
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
                  <Box sx={{ minWidth: 300 }}>
                    <InputLabel className="mb-2 italic">
                      Belong to store
                    </InputLabel>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel id="role2">Belong to store</InputLabel>
                      <Select
                        labelId="role2"
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
              <div className="mt-2 px-4">
                <p className="font-semibold">Password</p>
                <Stack
                  direction="column"
                  spacing={2}
                  sx={{ width: "100%" }}
                  mt={2}
                >
                  <FormControl variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">
                      Password
                    </InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.password &&
                        Boolean(formik.errors.password)
                      }
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Password"
                    />
                    <FormHelperText sx={{ color: "red" }}>
                      {formik.touched.password && formik.errors.password}
                    </FormHelperText>
                  </FormControl>
                  <FormControl variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-confirm-password">
                      Confirm Password
                    </InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-confirm-password"
                      type={showPasswordConfirm ? "text" : "password"}
                      name="password_confirmation"
                      value={formik.values.password_confirmation}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.password_confirmation &&
                        Boolean(formik.errors.password_confirmation)
                      }
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPasswordConfirm}
                            edge="end"
                          >
                            {showPasswordConfirm ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Confirm Password"
                    />
                    <FormHelperText sx={{ color: "red" }}>
                      {formik.touched.password_confirmation &&
                        formik.errors.password_confirmation}
                    </FormHelperText>
                  </FormControl>
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
              }}
              // onClick={addHandler}
              type="submit"
            >
              Add
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddUserPage;

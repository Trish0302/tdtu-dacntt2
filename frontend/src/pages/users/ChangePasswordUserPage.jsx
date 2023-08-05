import {
  Button,
  Card,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
} from "@mui/material";

import React, { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import changePasswordValidationSchema from "../../validations/ChangePasswordValidation";
import { useFormik } from "formik";
import { ListUserContext } from "../../stores/ListUserContext";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { call } from "../../utils/api";
import { toast } from "react-toastify";

const ChangePasswordUserPage = () => {
  const { id } = useParams();
  const { state, dispatch } = useContext(ListUserContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = React.useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowPasswordConfirm = () =>
    setShowPasswordConfirm((show) => !show);
  const handleClickShowCurrentPassword = () =>
    setShowCurrentPassword((show) => !show);

  const formik = useFormik({
    initialValues: {
      current_password: "",
      password: "",
      password_confirmation: "",
    },
    validationSchema: changePasswordValidationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      console.log(values);
      call(`api/password`, "PUT", values).then((res) => {
        console.log(res);
        if (res.status == 200) {
          toast.success("Change Password Successfully", { autoClose: 1000 });
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
      });
    },
  });
  return (
    <form onSubmit={formik.handleSubmit} className="h-full">
      <div className="h-full bg-primary-100 px-5 pt-24 pb-5 overflow-y-scroll hide-scroll flex justify-center">
        <Card sx={{ width: "60%", p: 2, height: "fit-content" }}>
          <div className="mt-2 px-4">
            <p className="font-semibold">Change Password</p>
            <Stack direction="column" spacing={2} sx={{ width: "100%" }} mt={2}>
              <FormControl variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">
                  Current Password
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  type={showCurrentPassword ? "text" : "password"}
                  value={formik.values.current_password}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.current_password &&
                    Boolean(formik.errors.current_password)
                  }
                  name="current_password"
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowCurrentPassword}
                        edge="end"
                      >
                        {showCurrentPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Current Password"
                />
                <FormHelperText sx={{ color: "red" }}>
                  {formik.touched.current_password &&
                    formik.errors.current_password}
                </FormHelperText>
              </FormControl>
              <FormControl variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">
                  Password
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  type={showPassword ? "text" : "password"}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.password && Boolean(formik.errors.password)
                  }
                  name="password"
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
                  value={formik.values.password_confirmation}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.password_confirmation &&
                    Boolean(formik.errors.password_confirmation)
                  }
                  name="password_confirmation"
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
                // onClick={addHandler}
                type="submit"
              >
                Save
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </form>
  );
};

export default ChangePasswordUserPage;

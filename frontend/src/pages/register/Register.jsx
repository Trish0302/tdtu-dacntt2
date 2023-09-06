import {
  CircularProgress,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  outlinedInputClasses,
} from "@mui/material";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import RegisterValidationSchema from "../../validations/RegisterValidationSchema";
import { useFormik } from "formik";
import { callNon } from "../../utils/api";
import { toast } from "react-toastify";
import { FiEyeOff, FiEye } from "react-icons/fi";

const Register = () => {
  const navigate = useNavigate();
  const [togglePassword, setTooglePassword] = useState(false);
  const [toggleConfirmPw, setToogleConfirmPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      password_confirmation: "",
    },
    validationSchema: RegisterValidationSchema,
    onSubmit: (values) => {
      setLoading(true);
      console.log(values);
      callNon(`api/users`, "POST", values).then((res) => {
        if (res) setLoading(false);
        if (res.status == 200) {
          toast.success("Resgister Successfully", { autoClose: 2000 });
          navigate("/login");
        } else {
          if (res.data.errors) {
            for (var key in res.data.errors) {
              var value = res.data.errors[key][0];
              console.log(value);
              toast.error(value, { autoClose: 2000 });
            }
          } else {
            toast.error(res.data.message, { autoClose: 2000 });
          }
        }
      });
    },
  });

  return (
    <div>
      <form
        onSubmit={formik.handleSubmit}
        className="flex h-screen flex-col gap-5 px-10 py-8 sm:px-20 sm:py-16 md:px-56 md:py-16 items-center justify-center bg-[#FDFCFF]"
      >
        <h1 className="text-center font-extrabold text-transparent text-3xl md:text-5xl bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 p-5 w-full">
          Register Account
        </h1>
        <TextField
          label="Email"
          name="email"
          type="email"
          className="border w-full md:w-2/4"
          placeholder="customer@gmail.com"
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />
        <TextField
          label="Phone"
          name="phone"
          type="phone"
          className="border w-full md:w-2/4"
          placeholder="customer@gmail.com"
          value={formik.values.phone}
          onChange={formik.handleChange}
          error={formik.touched.phone && Boolean(formik.errors.phone)}
          helperText={formik.touched.phone && formik.errors.phone}
        />
        <TextField
          label="Name"
          name="name"
          type="name"
          className="border w-full md:w-2/4"
          placeholder="customer@gmail.com"
          value={formik.values.name}
          onChange={formik.handleChange}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
        />
        <FormControl sx={{ width: "50%" }} variant="outlined">
          <InputLabel
            htmlFor="outlined-adornment-password"
            style={{ color: "#666674" }}
          >
            Password
          </InputLabel>
          <OutlinedInput
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            type={togglePassword ? "text" : "password"}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setTooglePassword((show) => !show)}
                  onMouseDown={(e) => e.preventDefault()}
                  edge="end"
                >
                  {togglePassword ? <FiEyeOff /> : <FiEye />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
            sx={`& .${outlinedInputClasses.notchedOutline} {
                      border-color: #E0E3E7;
                    }
                    &:hover .${outlinedInputClasses.notchedOutline} {
                      border-color: #B2BAC2;
                    }
                    &.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline} {
                      border-color: #6F7E8C;
                    }`}
          />
          <FormHelperText style={{ color: "#d32f2f" }}>
            {formik.touched.password && formik.errors.password}
          </FormHelperText>
        </FormControl>
        <FormControl sx={{ width: "50%" }} variant="outlined">
          <InputLabel
            htmlFor="outlined-adornment-password"
            style={{ color: "#666674" }}
          >
            Confirm Password
          </InputLabel>
          <OutlinedInput
            name="password_confirmation"
            value={formik.values.password_confirmation}
            onChange={formik.handleChange}
            error={
              formik.touched.password_confirmation &&
              Boolean(formik.errors.password_confirmation)
            }
            helperText={
              formik.touched.password_confirmation &&
              formik.errors.password_confirmation
            }
            type={toggleConfirmPw ? "text" : "password"}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setToogleConfirmPw((show) => !show)}
                  onMouseDown={(e) => e.preventDefault()}
                  edge="end"
                >
                  {toggleConfirmPw ? <FiEyeOff /> : <FiEye />}
                </IconButton>
              </InputAdornment>
            }
            label="Confirm Password"
            sx={`& .${outlinedInputClasses.notchedOutline} {
                      border-color: #E0E3E7;
                    }
                    &:hover .${outlinedInputClasses.notchedOutline} {
                      border-color: #B2BAC2;
                    }
                    &.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline} {
                      border-color: #6F7E8C;
                    }`}
          />
          <FormHelperText style={{ color: "#d32f2f" }}>
            {formik.touched.password_confirmation &&
              formik.errors.password_confirmation}
          </FormHelperText>
        </FormControl>
        <button
          type="submit"
          className={` ${
            loading ? "opacity-75 select-none" : ""
          } w-1/2 bg-violet-500 p-2 uppercase  text-white rounded shadow-md hover:opacity-80 duration-200 transition-all`}
        >
          {loading ? (
            <CircularProgress
              className="text-sm"
              size="2rem"
              color="secondary"
            />
          ) : (
            "Sign Up"
          )}
        </button>
        <small className="underline">
          <Link to="/login">Already have an account? Sign in</Link>
        </small>
      </form>
    </div>
  );
};

export default Register;

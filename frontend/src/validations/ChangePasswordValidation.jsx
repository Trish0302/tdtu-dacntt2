import * as yup from "yup";

const changePasswordValidationSchema = yup.object({
  current_password: yup
    .string("Enter your current password")
    .min(8, "Password should be of minimum 8 characters length")
    .required("Current Password is required"),
  password: yup
    .string("Enter your new password")
    .min(8, "Password should be of minimum 8 characters length")
    .required("Password is required"),

  password_confirmation: yup
    .string()
    .required("Confirm password is required")
    .oneOf([yup.ref("password"), null], "Passwords must match"),
});

export default changePasswordValidationSchema;

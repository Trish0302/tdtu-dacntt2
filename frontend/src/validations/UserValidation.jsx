import * as yup from "yup";

const phoneNumberRegEx = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;

const userValidationSchema = yup.object({
  email: yup
    .string("Enter your email")
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup
    .string("Enter your password")
    .min(8, "Password should be of minimum 8 characters length")
    .required("Password is required"),

  name: yup.string("Enter your full name").required("Full Name is required"),

  phone: yup
    .string("Enter your password")
    .matches(phoneNumberRegEx, "Invalid Phone Number")
    .max(11, "Invalid Phone Number")
    .required("Phone is required"),
  password_confirmation: yup
    .string()
    .required("Confirm password is required")
    .oneOf([yup.ref("password"), null], "Passwords must match"),
});

export default userValidationSchema;

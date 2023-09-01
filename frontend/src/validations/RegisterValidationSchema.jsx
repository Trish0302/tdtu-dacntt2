import * as yup from "yup";
const phoneNumberRegEx = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;
const RegisterValidationSchema = yup.object({
  email: yup
    .string("Enter your email")
    .email("Please enter valid email")
    .required("Please enter your email"),
  name: yup.string("Enter your name").required("Please enter your name"),
  phone: yup
    .string("Enter your password")
    .matches(phoneNumberRegEx, "Invalid Phone Number")
    .max(11, "Invalid Phone Number")
    .required("Phone is required"),
  password: yup
    .string("Enter the password")
    .min(8, "Password should be of minimum 8 characters length")
    .required("Please enter your password"),
  password_confirmation: yup
    .string()
    .required("Confirm password is required")
    .oneOf([yup.ref("password"), null], "The confirm password doesn't match"),
});
export default RegisterValidationSchema;

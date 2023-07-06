import * as yup from "yup";
const OrderValidationSchema = yup.object({
  name: yup
    .string("Enter your the name of food")
    .required("Name Food is required"),

  address: yup
    .string("Enter your the name of food group")
    .required("Which food group of this food belong"),
  phone: yup
    .string("Enter the slug of food")
    .required("The slug of food is required"),
});
export default OrderValidationSchema;

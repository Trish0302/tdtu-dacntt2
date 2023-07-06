import * as yup from "yup";
const storeValidationSchema = yup.object({
  name: yup
    .string("Enter your the name of store")
    .required("Name Store is required"),

  address: yup
    .string("Enter the address of store")
    .required("Address is required"),
  description: yup
    .string("Enter the description about store")
    .required("Description about store is required"),
  user_id: yup.string("Select the owner").required("Select the owner"),
});
export default storeValidationSchema;

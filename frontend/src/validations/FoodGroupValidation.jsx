import * as yup from "yup";
const FoodGroupValidationSchema = yup.object({
  name: yup
    .string("Enter your the name of food group")
    .required("Name Food Group is required"),

  store_id: yup
    .string("Select which store food group belong")
    .required("Which store food group belong"),

  slug: yup
    .string("Enter the slug of food group")
    .required("The slug of food group is required"),
  description: yup
    .string("Enter the description about food group")
    .required("Description about food group is required"),
});
export default FoodGroupValidationSchema;

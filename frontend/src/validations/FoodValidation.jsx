import * as yup from "yup";
const FoodValidationSchema = yup.object({
  name: yup
    .string("Enter your the name of food")
    .required("Name Food is required"),

  food_group_id: yup
    .string("Enter your the name of food group")
    .required("Which food group of this food belong"),
  slug: yup
    .string("Enter the slug of food")
    .required("The slug of food is required"),
  price: yup
    .string("Enter the price of food")
    .required("The price of food is required"),
  description: yup
    .string("Enter the description about food")
    .required("Description about food is required"),
});
export default FoodValidationSchema;

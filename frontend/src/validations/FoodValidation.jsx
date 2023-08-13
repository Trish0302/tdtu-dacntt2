import * as yup from "yup";
const FoodValidationSchema = yup.object({
  name: yup
    .string("Enter your the name of food")
    .required("Name Food is required"),
  store_id: yup
    .string("Enter your store of this food")
    .required("Enter the store of this food"),
  food_group_id: yup
    .string("Enter your the name of food group")
    .required("Enter the food group of this food"),
  slug: yup
    .string("Enter the slug of food")
    .required("The slug of food is required"),
  price: yup
    .string("Enter the price of food")
    .required("The price of food is required"),
  description: yup
    .string("Enter the description about food")
    .required("Description about food is required"),
  discount: yup
    .number()
    .typeError("Enter discount as a number")

    .test(
      "Is positive?",
      "The number must be greater than 0",
      (value) => value >= 0
    )
    .test(
      "no-leading-zero",
      "Leading zero is not allowed",
      (value, context) => {
        console.log(context);
        return (
          context.originalValue &&
          !context.originalValue.toString().startsWith("0")
        );
      }
    )
    .max(100, "Must small than 100")
    .required("Discount is required"),
});
export default FoodValidationSchema;

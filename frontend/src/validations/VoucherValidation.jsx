import * as yup from "yup";
const voucherValidationSchema = yup.object({
  code: yup
    .string("Enter your the code of voucher")
    .required("Code is required"),

  discount: yup
    .number()
    .typeError("Enter discount as a number")

    .test(
      "Is positive?",
      "The number must be greater than 0",
      (value) => value > 0
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
export default voucherValidationSchema;

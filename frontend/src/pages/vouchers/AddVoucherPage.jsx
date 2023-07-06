import { useFormik } from "formik";
import React, { useContext, useState } from "react";
import { ListVoucherContext } from "../../stores/ListVoucherContext";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Divider,
  FormHelperText,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";
import voucherValidationSchema from "../../validations/VoucherValidation";
import { call } from "../../utils/api";
import { toast } from "react-toastify";
import PercentIcon from "@mui/icons-material/Percent";

const AddVoucherPage = () => {
  const { state, dispatch } = useContext(ListVoucherContext);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      code: "",
      discount: "",
    },
    validationSchema: voucherValidationSchema,
    onSubmit: (values) => {
      console.log(values);

      try {
        call("api/vouchers", "POST", values)
          .then((res) => {
            dispatch({ type: "addVoucher", item: values });
            toast.success("Add Successfully", { autoClose: 1000 });
            setTimeout(() => {
              navigate("/vouchers");
            }, 1500);
          })
          .catch((err) => console.log("add-error", err));
      } catch (error) {
        console.log(error);
        // toast.error('Something went wrong');
      }
    },
  });

  //func

  return (
    <div className="h-full">
      <form onSubmit={formik.handleSubmit} className="h-full">
        <div className="h-full bg-violet-50 px-5 pt-24 pb-5 overflow-y-scroll hide-scroll">
          <p className="font-semibold mb-2 text-lg">Add Voucher</p>
          <Divider />
          <div className="flex items-center w-full justify-center">
            <Card sx={{ py: 2, my: 2, width: "50%" }}>
              <div className="px-4 flex justify-between items-center mb-2">
                <small>
                  Please confirm the information carefully before saving
                </small>
              </div>
              <Divider />
              <div className="px-4">
                <Stack
                  direction="column"
                  spacing={2}
                  py={2}
                  sx={{ width: "100%" }}
                >
                  <TextField
                    variant="outlined"
                    placeholder="Code"
                    label="Code"
                    name="code"
                    value={formik.values.code}
                    onChange={formik.handleChange}
                    error={formik.touched.code && Boolean(formik.errors.code)}
                    helperText={formik.touched.code && formik.errors.code}
                  />
                  <TextField
                    variant="outlined"
                    placeholder="Discount (%)"
                    label="Discount (%)"
                    name="discount"
                    value={formik.values.discount}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.discount && Boolean(formik.errors.discount)
                    }
                    helperText={
                      formik.touched.discount && formik.errors.discount
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment>
                          <PercentIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Stack>
              </div>
            </Card>
          </div>
          <div className="w-full items-center justify-center flex">
            <Button
              variant="contained"
              sx={{
                mt: 2,
                width: "fit-content",
              }}
              type="submit"
              // onClick={addHandler}
            >
              ADD
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddVoucherPage;

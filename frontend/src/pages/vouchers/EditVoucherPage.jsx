import React, { useContext, useEffect, useState } from "react";
import { call } from "../../utils/api";
import voucherValidationSchema from "../../validations/VoucherValidation";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { ListVoucherContext } from "../../stores/ListVoucherContext";
import {
  Button,
  Card,
  Divider,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";
import PercentIcon from "@mui/icons-material/Percent";

const EditVoucherPage = () => {
  const { id } = useParams();
  const { state, dispatch } = useContext(ListVoucherContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [updateVoucher, setUpdateVoucher] = useState({
    code: "",
    discount: "",
  });
  console.log(
    "🚀 ~ file: EditUserPage.jsx:33 ~ EditUserPage ~ updateVoucher:",
    updateVoucher
  );

  const formik = useFormik({
    initialValues: updateVoucher,
    enableReinitialize: true,
    validationSchema: voucherValidationSchema,

    onSubmit: (values) => {
      console.log(values);
      try {
        call(`api/vouchers/${id}`, "PUT", values)
          .then((res) => {
            if (res.status != 200) {
              if (res.data.errors) {
                for (var key in res.data.errors) {
                  var value = res.data.errors[key][0];
                  console.log(value);
                  toast.error(value, { autoClose: 2000 });
                }
              } else {
                toast.error(res.data.message, { autoClose: 2000 });
              }
            } else {
              dispatch({ type: "updateVoucher", item: values });
              toast.success("Update Successfully", { autoClose: 1000 });
              setTimeout(() => {
                navigate("/vouchers");
              }, 1500);
            }
          })
          .catch((err) => console.log("add-error", err));
      } catch (error) {
        console.log(error);
        // toast.error('Something went wrong');
      }
    },
  });

  //func

  useEffect(() => {
    setLoading(true);
    const data = call(`api/vouchers/${id}`, "GET", null);
    data.then((response) => {
      setUpdateVoucher(response.data);
      setLoading(false);
    });
  }, []);
  return (
    <div className="h-full">
      <form onSubmit={formik.handleSubmit} className="h-full">
        <div className="h-full bg-violet-50 px-5 pt-24 pb-5 overflow-y-scroll hide-scroll">
          <p className="font-semibold mb-2 text-lg">Edit Voucher</p>
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
              SAVE
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditVoucherPage;

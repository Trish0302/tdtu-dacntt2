import { Card, Divider, InputAdornment, Stack, TextField } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { call } from "../../utils/api";
import voucherValidationSchema from "../../validations/VoucherValidation";
import { useFormik } from "formik";
import { ListVoucherContext } from "../../stores/ListVoucherContext";
import { useNavigate, useParams } from "react-router-dom";
import PercentIcon from "@mui/icons-material/Percent";
const DetailVoucherPage = () => {
  const { id } = useParams();
  const { state, dispatch } = useContext(ListVoucherContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [userArr, setUserArr] = useState();
  console.log(
    "🚀 ~ file: EditStorePage.jsx:23 ~ EditStorePage ~ userArr:",
    userArr
  );
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
      // try {
      //   call(`api/vouchers/${id}`, "PUT", values)
      //     .then((res) => {
      //       dispatch({ type: "updateVoucher", item: values });
      //       toast.success("Update Successfully", { autoClose: 1000 });
      //       setTimeout(() => {
      //         navigate("/vouchers");
      //       }, 1500);
      //     })
      //     .catch((err) => console.log("add-error", err));
      // } catch (error) {
      //   console.log(error);
      //   // toast.error('Something went wrong');
      // }
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
      <form className="h-full">
        <div className="h-full bg-violet-50 px-5 pt-24 pb-5 overflow-y-scroll hide-scroll ">
          <p className="font-semibold mb-2 text-lg">
            Detail Information Voucher
          </p>
          <Divider />
          <div className="flex items-center w-full justify-center">
            <Card sx={{ py: 2, my: 2, width: "50%" }}>
              <div className="px-4 flex justify-between items-center mb-2">
                <small>Voucher information</small>
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
                    InputProps={{
                      readOnly: true,
                    }}
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
                      readOnly: true,
                    }}
                  />
                </Stack>
              </div>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DetailVoucherPage;

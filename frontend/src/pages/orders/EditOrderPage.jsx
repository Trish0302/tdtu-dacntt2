import {
  Button,
  Card,
  CircularProgress,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { call } from "../../utils/api";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { ListOrderContext } from "../../stores/ListOrderContext";
import { useNavigate, useParams } from "react-router-dom";
import OrderValidationSchema from "../../validations/OrderValidation";

const EditOrderPage = () => {
  const { id } = useParams();
  const { state, dispatch } = useContext(ListOrderContext);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [updateOrder, setUpdateOrder] = useState({
    name: "",
    address: "",
    phone: "",
    total: "",
  });
  console.log(
    "🚀 ~ file: EditUserPage.jsx:33 ~ EditUserPage ~ updateOrder:",
    updateOrder
  );

  const formik = useFormik({
    initialValues: updateOrder,
    enableReinitialize: true,
    validationSchema: OrderValidationSchema,

    onSubmit: (values) => {
      let valuesUpdate = { ...values };

      Object.assign(valuesUpdate, { items: valuesUpdate["detail"] });
      valuesUpdate.items.map((item) => {
        // console.log(item);
        Object.assign(item, { price: item.total });
        item["price"] = item["unit_price"];
        item["id"] = item.food_id;
        delete item["total"];
        delete item["food_id"];
        delete item["order_id"];
        delete item["unit_price"];
      });
      delete valuesUpdate["detail"];
      delete valuesUpdate["history"];
      delete valuesUpdate["total"];
      valuesUpdate = {
        ...valuesUpdate,
        voucher_id: 1,
        payment_type: 1,
      };

      console.log(valuesUpdate);

      try {
        call(`api/orders/${id}`, "PUT", valuesUpdate)
          .then((res) => {
            if (res.status == 200) {
              dispatch({ type: "updateOrder", item: valuesUpdate });
              toast.success("Update Successfully", { autoClose: 1000 });
              setTimeout(() => {
                navigate("/orders");
              }, 1500);
            } else {
              console.log(res);
              let entries = Object.entries(res.data.messages);
              console.log(
                "🚀 ~ file: AddUserPage.jsx:68 ~ .then ~ entries:",
                entries
              );
              entries.map(([key, value]) => {
                console.log("loi ne", key, value);

                formik.setFieldError(key, value[0]);
                toast.error(value[0], {
                  autoClose: 2000,
                });
              });
            }
          })
          .catch((err) => console.log("add-error", err));
      } catch (error) {
        console.log(error);
        // toast.error('Something went wrong');
      }
    },
  });

  console.log(formik.values);

  //func

  useEffect(() => {
    setLoading(true);
    const data = call(`api/orders/${id}`, "GET", null);
    data.then((response) => {
      console.log(
        "🚀 ~ file: EditOrderPage.jsx:74 ~ data.then ~ response:",
        response
      );
      setUpdateOrder(response.data);
      setLoading(false);
    });
  }, []);

  return (
    <>
      {!loading ? (
        <div className="h-full">
          <form onSubmit={formik.handleSubmit} className="h-full">
            <div className="h-full bg-primary-100 px-5 pt-24 pb-5 overflow-y-scroll hide-scroll">
              <p className="font-semibold mb-2 text-lg">
                Edit information of Order
              </p>
              <Divider />
              <div className="flex flex-col items-center w-full justify-center">
                <Card sx={{ py: 2, my: 2 }} className="basis-3/4">
                  <div className="px-4 flex justify-between items-center mb-2">
                    <p className="font-semibold">
                      Order{" "}
                      <span className="text-primary-500">{updateOrder.id}</span>
                    </p>
                    <small>
                      Please confirm the information carefully before saving
                    </small>
                  </div>
                  <Divider />
                  <div className="px-4">
                    <Stack
                      direction="column"
                      spacing={2}
                      pt={2}
                      sx={{ width: "100%" }}
                    >
                      <TextField
                        variant="outlined"
                        placeholder="Name of Customer"
                        label="Name of Customer"
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.name && Boolean(formik.errors.name)
                        }
                        helperText={formik.touched.name && formik.errors.name}
                      />
                      <TextField
                        variant="outlined"
                        placeholder="Address"
                        label="Address"
                        defaultValue={updateOrder.address}
                        name="address"
                        value={formik.values.address}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.address &&
                          Boolean(formik.errors.address)
                        }
                        helperText={
                          formik.touched.address && formik.errors.address
                        }
                      />

                      <TextField
                        placeholder="Phone number"
                        label="Phone number"
                        name="phone"
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.phone && Boolean(formik.errors.phone)
                        }
                        helperText={formik.touched.phone && formik.errors.phone}
                        // fullWidth
                      />
                      <TextField
                        sx={{ width: "100%" }}
                        placeholder="Total price of order"
                        label="Total price of order"
                        name="total"
                        value={formik.values?.total.replace(
                          /\B(?=(\d{3})+(?!\d))/g,
                          ","
                        )}
                        onChange={(e) => {
                          formik.setFieldValue(
                            "total",
                            e.target.value.replace(/,/g, "")
                          );
                        }}
                        error={
                          formik.touched.total && Boolean(formik.errors.total)
                        }
                        helperText={formik.touched.total && formik.errors.total}
                        disabled
                      />
                    </Stack>

                    <TableContainer>
                      <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                          <TableRow>
                            <TableCell>Time</TableCell>
                            <TableCell align="left">Progress</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {updateOrder?.history?.progresses.map(
                            (row, index) => (
                              <TableRow
                                key={index}
                                sx={{
                                  "&:last-child td, &:last-child th": {
                                    border: 0,
                                  },
                                }}
                              >
                                <TableCell component="th" scope="row">
                                  {row.timestamp}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                  {row.order_progress}
                                </TableCell>
                              </TableRow>
                            )
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                </Card>

                <Card className="w-[832px]" sx={{ px: 4, py: 2 }}>
                  <span className="font-semibold">Detail Order</span>
                  <TableContainer className="mt-2">
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>Food</TableCell>
                          <TableCell>Price</TableCell>
                          <TableCell>Quantity</TableCell>
                          <TableCell>Total</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {updateOrder?.detail.map((row, index) => (
                          <TableRow
                            key={index}
                            sx={{
                              "&:last-child td, &:last-child th": {
                                border: 0,
                              },
                            }}
                          >
                            <TableCell component="th" scope="row">
                              {row.id}
                            </TableCell>
                            <TableCell component="th" scope="row">
                              {row.food.name}
                            </TableCell>
                            <TableCell component="th" scope="row">
                              {row.unit_price.toLocaleString()}
                            </TableCell>
                            <TableCell component="th" scope="row">
                              {row.quantity}
                            </TableCell>
                            <TableCell component="th" scope="row">
                              {(row.unit_price * row.quantity).toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow
                          sx={{
                            "&:last-child td, &:last-child th": {
                              border: 0,
                            },
                          }}
                        >
                          <TableCell>
                            Total: {updateOrder.total.toLocaleString()} ₫
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Card>
              </div>
              <div className="w-full items-center justify-center flex">
                <Button
                  variant="contained"
                  sx={{
                    mt: 2,
                    width: "fit-content",
                    textTransform: "uppercase",
                    paddingX: "20px",
                    background: "#ef6351",
                    color: "white",
                    ":hover": {
                      background: "#ffa397",
                    },
                  }}
                  type="submit"
                >
                  SAVE
                </Button>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-primary-100">
          <CircularProgress color="secondary" />
        </div>
      )}
    </>
  );
};

export default EditOrderPage;

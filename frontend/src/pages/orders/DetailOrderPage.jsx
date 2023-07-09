import {
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
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { ListOrderContext } from "../../stores/ListOrderContext";

const DetailOrderPage = () => {
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
    // validationSchema: OrderValidationSchema,

    onSubmit: (values) => {},
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
          <form className="h-full">
            <div className="h-full bg-violet-50 px-5 pt-24 pb-5 overflow-y-scroll hide-scroll">
              <p className="font-semibold mb-2 text-lg">
                Detail information of Order
              </p>
              <Divider />
              <div className="flex flex-col items-center w-full justify-center">
                <Card sx={{ py: 2, my: 2 }}>
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
                        InputProps={{
                          readOnly: true,
                        }}
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
                        InputProps={{
                          readOnly: true,
                        }}
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
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                      <TextField
                        sx={{ mx: 2, width: "800px" }}
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
                        InputProps={{
                          readOnly: true,
                        }}
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
                          <TableCell>FoodID</TableCell>
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
                              {row.food_id}
                            </TableCell>
                            <TableCell component="th" scope="row">
                              {row.quantity}
                            </TableCell>
                            <TableCell component="th" scope="row">
                              {row.total}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Card>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-violet-50">
          <CircularProgress color="secondary" />
        </div>
      )}
    </>
  );
};

export default DetailOrderPage;

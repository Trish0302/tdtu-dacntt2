import {
  Box,
  Card,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { call } from "../../utils/api";
import { ListCustomerContext } from "../../stores/ListCustomerContext";
import { useParams } from "react-router-dom";

const DetailCustomerPage = () => {
  const { id } = useParams();
  const { state, dispatch } = useContext(ListCustomerContext);
  const [loading, setLoading] = useState(false);

  const [updateUser, setUpdateUser] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    avatar: "",
    password: "",
    password_confirmation: "",
  });
  console.log(
    "🚀 ~ file: EditUserPage.jsx:33 ~ EditUserPage ~ updateUser:",
    updateUser
  );

  useEffect(() => {
    setLoading(true);
    const data = call(`api/customers/${id}`, "GET", null);
    data.then((response) => {
      setUpdateUser(response.data);
      setLoading(false);
    });
  }, []);
  return (
    <>
      {!loading ? (
        <div className="h-full bg-primary-100 px-5 pt-24 pb-5 overflow-y-scroll hide-scroll">
          <p className="font-semibold mb-2 text-lg">Customer Information</p>
          <Divider />
          <Stack
            direction="row"
            spacing={5}
            mt={2}
            px={4}
            sx={{ display: "flex" }}
          >
            <Card
              sx={{ p: 2, flex: 1, flexBasis: "30%" }}
              className="basis-1/4"
            >
              <div className="w-full flex flex-col gap-4 justify-center items-center h-full">
                <p className="font-semibold text-lg">Profile Image</p>
                <img
                  src={updateUser.avatar}
                  className="h-[300px] w-fit object-cover rounded-lg shadow-md block flex-1"
                />
              </div>
            </Card>
            <Card sx={{ py: 2, flexBasis: "60%" }}>
              <div className="px-4 flex justify-between items-center mb-2">
                <p className="font-semibold">Profile Information</p>
              </div>
              <Divider />
              <Stack direction="row" p={2} spacing={2}>
                <Stack direction="column" spacing={3} sx={{ width: "100%" }}>
                  <TextField
                    variant="outlined"
                    placeholder="Full Name"
                    name="name"
                    // onChange={changeHandler}
                    defaultValue={updateUser.name}
                    label="Full Name"
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                  <TextField
                    variant="outlined"
                    placeholder="Phone"
                    name="phone"
                    // onChange={changeHandler}
                    defaultValue={updateUser.phone}
                    label="Phone"
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                  <TextField
                    variant="outlined"
                    placeholder="Email"
                    name="email"
                    // onChange={changeHandler}
                    defaultValue={updateUser.email}
                    label="Email"
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                  <TextField
                    variant="outlined"
                    placeholder="Address"
                    name="address"
                    // onChange={changeHandler}
                    defaultValue={updateUser.address}
                    label="Address"
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Stack>
              </Stack>
            </Card>
          </Stack>
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-primary-100">
          <CircularProgress color="secondary" />
        </div>
      )}
    </>
  );
};

export default DetailCustomerPage;

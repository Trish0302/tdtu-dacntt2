import React, { useEffect } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { useContext, useState } from "react";
import { call } from "../../utils/api";
import { ListUserContext } from "../../stores/ListUserContext";
import { useNavigate, useParams } from "react-router-dom";

const DetailUserPage = () => {
  const { id } = useParams();
  const { state, dispatch } = useContext(ListUserContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = React.useState(false);

  const [updateUser, setUpdateUser] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  console.log(
    "🚀 ~ file: EditUserPage.jsx:33 ~ EditUserPage ~ updateUser:",
    updateUser
  );

  //func
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowPasswordConfirm = () =>
    setShowPasswordConfirm((show) => !show);
  const changeHandler = (e) => {
    setUpdateUser({ ...updateUser, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    setLoading(true);
    const data = call(`api/users/${id}`, "GET", null);
    data.then((response) => {
      setUpdateUser(response.data);
      setLoading(false);
    });
  }, []);

  return (
    <>
      {!loading ? (
        <div className="h-full bg-violet-50 px-5 pt-24 pb-5 overflow-y-scroll hide-scroll">
          <p className="font-semibold mb-2 text-lg">User Information</p>
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
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Blackpink_Lisa_GMP_240622.png/800px-Blackpink_Lisa_GMP_240622.png"
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
                <Stack direction="column" spacing={2} sx={{ width: "100%" }}>
                  <TextField
                    variant="outlined"
                    placeholder="Full Name"
                    name="name"
                    onChange={changeHandler}
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
                    onChange={changeHandler}
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
                    onChange={changeHandler}
                    defaultValue={updateUser.email}
                    label="Email"
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Stack>
                <Stack direction="column" spacing={2}></Stack>
              </Stack>
              <Divider />
              <div className="my-2 px-4">
                <p className="font-semibold pb-1">Position Information</p>
                <div className="flex w-full justify-between pb-1">
                  <Box sx={{ minWidth: 300 }}>
                    <InputLabel className="mb-2">Role</InputLabel>
                    <FormControl fullWidth>
                      <InputLabel id="role">Role</InputLabel>
                      <Select
                        labelId="role"
                        id="demo-simple-select"
                        value={null}
                        label="Role"
                        disabled
                        InputProps={{
                          readOnly: true,
                        }}
                      >
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  <Box sx={{ minWidth: 300 }}>
                    <InputLabel className="mb-2">Belong to store</InputLabel>
                    <FormControl fullWidth>
                      <InputLabel id="role">Belong to store</InputLabel>
                      <Select
                        labelId="role"
                        id="demo-simple-select"
                        value={null}
                        label="Belong to store"
                        disabled
                        InputProps={{
                          readOnly: true,
                        }}
                      >
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </div>
              </div>
            </Card>
          </Stack>
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-violet-50">
          <CircularProgress color="secondary" />
        </div>
      )}
    </>
  );
};

export default DetailUserPage;

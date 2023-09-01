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
import { authContext } from "../../utils/auth";
import { convertISODateToTimeFormat } from "../../utils/func";

const DetailUserPage = () => {
  const { id } = useParams();
  const { state, dispatch } = useContext(ListUserContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = React.useState(false);
  const userInfo = useContext(authContext);
  console.log(
    "🚀 ~ file: DetailUserPage.jsx:34 ~ DetailUserPage ~ userInfo:",
    userInfo
  );

  const [updateUser, setUpdateUser] = useState({
    name: "",
    phone: "",
    email: "",
    avatar: "",
    password: "",
    password_confirmation: "",
  });
  console.log(
    "🚀 ~ file: EditUserPage.jsx:33 ~ EditUserPage ~ updateUser:",
    updateUser
  );

  //func

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
        <div className="h-full bg-primary-100 px-5 pt-24 pb-5 overflow-y-scroll hide-scroll">
          <p className="font-semibold mb-2 text-lg">User Information</p>
          <Divider />
          <Stack
            direction="row"
            spacing={5}
            mt={2}
            px={4}
            sx={{ display: "flex" }}
            height="450px"
          >
            <Card
              sx={{ p: 2, flex: 1, flexBasis: "30%" }}
              className="basis-1/4"
            >
              <div className="w-full flex flex-col gap-4 justify-center items-center h-full">
                <p className="font-semibold text-lg">Profile Image</p>
                <img
                  src={updateUser.avatar}
                  className="h-[300px] w-full object-cover rounded-lg shadow-md block flex-1"
                  alt={updateUser.name}
                />
              </div>
            </Card>
            <Card sx={{ py: 2, flexBasis: "60%" }}>
              <div className="flex items-center justify-between mb-2">
                <div className="px-4 flex justify-between items-center mb-2">
                  <p className="font-semibold">Profile Information</p>
                </div>

                <button
                  onClick={() => navigate(`/users/edit/${userInfo.id}`)}
                  className="mr-4 py-2 px-4 rounded-xl font-semibold hover:opacity-75 duration-200 bg-primary-500 text-white"
                >
                  Edit Profile
                </button>
              </div>
              <Divider />
              <Stack direction="row" p={2} spacing={2}>
                <Stack direction="column" spacing={2} sx={{ width: "100%" }}>
                  <TextField
                    variant="outlined"
                    placeholder="Full Name"
                    name="name"
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
                <div className="flex items-center justify-between pb-1 w-full gap-7 mt-3">
                  <TextField
                    variant="outlined"
                    label="Role"
                    value={userInfo.role_id == 0 ? "Admin" : "Owner Store"}
                    fullWidth
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                  <TextField
                    variant="outlined"
                    label="Created At"
                    fullWidth
                    value={convertISODateToTimeFormat(updateUser.created_at)}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </div>
              </div>
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

export default DetailUserPage;

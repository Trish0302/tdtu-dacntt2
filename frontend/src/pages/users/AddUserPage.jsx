import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Button,
  Card,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  TextField,
} from "@mui/material";
import React, { useContext, useState } from "react";
import { call } from "../../utils/api";
import { ListUserContext } from "../../stores/ListUserContext";
import { useNavigate } from "react-router-dom";

const AddUserPage = () => {
  const { state, dispatch } = useContext(ListUserContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = React.useState(false);

  const [addUser, setAddUser] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  console.log(
    "🚀 ~ file: AddUserPage.jsx:26 ~ AddUserPage ~ addUser:",
    addUser
  );

  //func
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowPasswordConfirm = () =>
    setShowPasswordConfirm((show) => !show);
  const changeHandler = (e) => {
    setAddUser({ ...addUser, [e.target.name]: e.target.value });
  };

  const addHandler = async () => {
    try {
      call("api/users", "POST", addUser)
        .then((res) => {
          dispatch({ type: "addUser", item: addUser });
        })
        .catch((err) => console.log("add-error", err));
      // toast.success('Add Successfully', { autoClose: 2000 });
      setTimeout(() => {
        navigate("/users");
      }, 2000);
    } catch (error) {
      console.log(error);
      // toast.error('Something went wrong');
    }
  };

  return (
    <div className="h-screen bg-violet-50 px-5 pt-24 flex flex-col">
      <p>Thêm User</p>
      <Divider />
      <Stack direction="row" spacing={5} mt={2} px={4} sx={{ display: "flex" }}>
        <Card>Upload hinh</Card>
        <Card sx={{ py: 2, flex: 1 }}>
          <div className="px-4 flex justify-between items-center mb-2">
            <p>Thông tin cá nhân</p>
            <small>Hãy xác nhận thông tin thật kỹ trước khi lưu</small>
          </div>
          <Divider />
          <Stack direction="row" p={2} spacing={2}>
            <Stack direction="column" spacing={2}>
              <TextField
                variant="outlined"
                placeholder="Mã định danh"
                label="Mã định danh"
              />
              <TextField
                variant="outlined"
                placeholder="Email"
                name="email"
                onChange={changeHandler}
                label="Email"
              />
              <TextField
                variant="outlined"
                placeholder="Địa chỉ"
                label="Địa chỉ"
              />
            </Stack>
            <Stack direction="column" spacing={2}>
              <TextField
                variant="outlined"
                placeholder="Họ tên"
                name="name"
                onChange={changeHandler}
                label="Họ Tên"
              />
              <TextField
                variant="outlined"
                placeholder="Số điện thoại"
                name="phone"
                onChange={changeHandler}
                label="Số điện thoại"
              />
            </Stack>
          </Stack>
          <Divider />
          <div className="my-2 px-4">
            <p>Thông tin chức vụ</p>
          </div>
          <Divider />
          <div className="mt-2 px-4">
            <p>Mật khẩu</p>
            <Stack direction="column" spacing={2} width={500} mt={2}>
              <FormControl variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">
                  Mật khẩu
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  type={showPassword ? "text" : "password"}
                  onChange={changeHandler}
                  name="password"
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
              </FormControl>
              <FormControl variant="outlined">
                <InputLabel htmlFor="outlined-adornment-confirm-password">
                  Xác nhận mật khẩu
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-confirm-password"
                  type={showPasswordConfirm ? "text" : "password"}
                  onChange={changeHandler}
                  name="password_confirmation"
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPasswordConfirm}
                        edge="end"
                      >
                        {showPasswordConfirm ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
              </FormControl>
            </Stack>
          </div>
        </Card>
      </Stack>
      <div className="w-full items-center justify-center flex">
        <Button
          variant="contained"
          sx={{
            mt: 2,
            width: "fit-content",
          }}
          onClick={addHandler}
        >
          Thêm
        </Button>
      </div>
    </div>
  );
};

export default AddUserPage;

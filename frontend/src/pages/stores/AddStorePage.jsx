import React, { useContext, useState } from "react";
import { ListStoreContext } from "../../stores/ListStoreContext";
import { useNavigate } from "react-router-dom";
import { call } from "../../utils/api";
import { Card, Divider, Stack, TextField } from "@mui/material";

const AddStorePage = () => {
  const { state, dispatch } = useContext(ListStoreContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = React.useState(false);

  const [addStore, setAddStore] = useState({
    name: "",
    address: "",
    description: "",
    userId: "",
  });
  console.log(
    "🚀 ~ file: AddStorePage.jsx:26 ~ AddStorePage ~ addStore:",
    addStore
  );

  //func
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowPasswordConfirm = () =>
    setShowPasswordConfirm((show) => !show);
  const changeHandler = (e) => {
    setAddStore({ ...addStore, [e.target.name]: e.target.value });
  };

  const addHandler = async () => {
    try {
      call("api/users", "POST", addStore)
        .then((res) => {
          dispatch({ type: "addStore", item: addStore });
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
      <p>Thêm Store</p>
      <Divider />
      <div className="flex items-center w-full">
        <Card sx={{ py: 2, flex: 1, mx: 10, my: 2 }}>
          <div className="px-4 flex justify-between items-center mb-2">
            <p>Cửa hàng A</p>
            <small>Hãy xác nhận thông tin thật kỹ trước khi lưu</small>
          </div>
          <Divider />
          <Stack direction="row" spacing={2} m={2}>
            <TextField
              variant="outlined"
              placeholder="Tên cửa hàng"
              label="Tên cửa hàng"
              name="name"
            />
            <TextField
              variant="outlined"
              placeholder="Địa chỉ"
              label="Địa chỉ"
              name="address"
            />
          </Stack>

          <TextField
            sx={{ mx: 2, width: "800px" }}
            placeholder="Giới thiệu về cửa hàng"
            multiline
            label="Giới thiệu về cửa hàng"
            rows={10}
            // fullWidth
          />
        </Card>
      </div>
    </div>
  );
};

export default AddStorePage;

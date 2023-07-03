import { useContext, useEffect, useState } from "react";
import { ListStoreContext } from "../../stores/ListStoreContext";
import { useNavigate } from "react-router-dom";
import { call } from "../../utils/api";
import {
  Autocomplete,
  Button,
  Card,
  Divider,
  Stack,
  TextField,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { useFormik } from "formik";
import storeValidationSchema from "../../validations/StoreValidation";

const AddStorePage = () => {
  const { state, dispatch } = useContext(ListStoreContext);
  const navigate = useNavigate();

  const [userArr, setUserArr] = useState();
  console.log(
    "🚀 ~ file: AddStorePage.jsx:14 ~ AddStorePage ~ userArr:",
    userArr
  );
  const [addStore, setAddStore] = useState({
    name: "",
    address: "",
    description: "",
    user_id: "",
  });
  console.log(
    "🚀 ~ file: AddStorePage.jsx:26 ~ AddStorePage ~ addStore:",
    addStore
  );

  const formik = useFormik({
    initialValues: addStore,
    validationSchema: storeValidationSchema,
    onSubmit: (values) => {
      console.log(values);
      try {
        call("api/stores", "POST", values)
          .then((res) => {
            dispatch({ type: "addStore", item: values });
            toast.success("Add Successfully", { autoClose: 1000 });
            setTimeout(() => {
              navigate("/stores");
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

  const changeHandler = (e) => {
    setAddStore({ ...addStore, [e.target.name]: e.target.value });
  };

  const addHandler = async () => {
    try {
      call("api/stores", "POST", addStore)
        .then((res) => {
          dispatch({ type: "addStore", item: addStore });
          toast.success("Add Successfully", { autoClose: 1000 });
          setTimeout(() => {
            navigate("/stores");
          }, 1500);
        })
        .catch((err) => console.log("add-error", err));
    } catch (error) {
      console.log(error);
      // toast.error('Something went wrong');
    }
  };

  useEffect(() => {
    const userArr = [];
    const fetchUser = async () => {
      const rs = await call("api/users");
      rs.data.map((item) => userArr.push({ label: item.name, id: item.id }));
      setUserArr(userArr);
    };
    fetchUser();
  }, []);
  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <div className="h-full bg-violet-50 px-5 pt-24 pb-5 overflow-y-scroll hide-scroll">
          <p className="font-semibold mb-2 text-lg">Add Store</p>
          <Divider />
          <div className="flex items-center w-full justify-center">
            <Card sx={{ py: 2, my: 2 }}>
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
                    placeholder="Name of Store"
                    label="Name of Store"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                  />
                  <TextField
                    variant="outlined"
                    placeholder="Address"
                    label="Address"
                    name="address"
                    value={formik.values.address}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.address && Boolean(formik.errors.address)
                    }
                    helperText={formik.touched.address && formik.errors.address}
                  />

                  {userArr && (
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      options={userArr}
                      value={userArr.find(
                        (item) => item.id === formik.values.user_id
                      )}
                      onChange={(e, value) =>
                        formik.setFieldValue("user_id", value?.id)
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Owner"
                          error={
                            formik.touched.user_id &&
                            Boolean(formik.errors.user_id)
                          }
                          helperText={
                            formik.touched.user_id && formik.errors.user_id
                          }
                        />
                      )}
                    />
                  )}
                  <TextField
                    sx={{ mx: 2, width: "800px" }}
                    placeholder="Description about store"
                    multiline
                    label="Description about store"
                    rows={10}
                    name="description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.description &&
                      Boolean(formik.errors.description)
                    }
                    helperText={
                      formik.touched.description && formik.errors.description
                    }
                    // fullWidth
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

export default AddStorePage;

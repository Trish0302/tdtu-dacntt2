import { useContext, useEffect, useState } from "react";
import { ListStoreContext } from "../../stores/ListStoreContext";
import { useNavigate } from "react-router-dom";
import { call, callUpload } from "../../utils/api";
import {
  Autocomplete,
  Button,
  Card,
  CircularProgress,
  Divider,
  Stack,
  TextField,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { useFormik } from "formik";
import storeValidationSchema from "../../validations/StoreValidation";
import { AiOutlineCloudUpload } from "react-icons/ai";

const AddStorePage = () => {
  const { state, dispatch } = useContext(ListStoreContext);
  const navigate = useNavigate();
  const [loadingCallAPI, setLoadingCallAPI] = useState(false);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [userArr, setUserArr] = useState();
  const [addStore, setAddStore] = useState({
    name: "",
    address: "",
    description: "",
    user_id: "",
  });
  const [previewPic, setPreviewPic] = useState();
  const [uploadFile, setUploadFile] = useState();
  console.log(
    "🚀 ~ file: AddStorePage.jsx:33 ~ AddStorePage ~ uploadFile:",
    uploadFile
  );

  const changeUploadPicHandler = (e) => {
    // console.log(e.target.files[0]);
    setPreviewPic(URL.createObjectURL(e.target.files[0]));
    formik.setFieldValue("avatar", e.target.files[0]);
  };

  const changeUploadFileExcel = (e) => {
    setUploadFile(e.target.files[0]);
    console.log(e);
  };

  const handleUploadExcel = () => {
    setLoadingUpload(true);
    const formData = new FormData();
    formData.append("file", uploadFile);

    callUpload(`api/stores/import`, "POST", formData).then((res) => {
      console.log("🚀 ~ file: AddStorePage.jsx:57 ~ call ~ res:", res);
      if (res) {
        setLoadingUpload(false);
      }

      if (res.status == 200) {
        toast.success("Import Excel data successfully!", { autoClose: 1000 });
        setTimeout(() => {
          navigate("/stores");
        }, 1500);
      } else {
        toast.error(res.data.message);
      }
    });
  };

  const formik = useFormik({
    initialValues: addStore,
    validationSchema: storeValidationSchema,
    onSubmit: (values) => {
      console.log(values);
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("address", values.address);
      formData.append("description", values.description);
      formData.append("user_id", values.user_id);
      formData.append("avatar", values.avatar);

      try {
        setLoadingCallAPI(true);
        callUpload("api/stores", "POST", formData)
          .then((res) => {
            if (res) {
              setLoadingCallAPI(false);
            }
            console.log("🚀 ~ file: AddStorePage.jsx:50 ~ .then ~ res:", res);
            dispatch({ type: "addStore", item: values });
            if (res.status == 200) {
              toast.success("Add Successfully", { autoClose: 1000 });
              setTimeout(() => {
                navigate("/stores");
              }, 1500);
            } else {
              let entries = Object.entries(res.data.message);
              console.log(
                "🚀 ~ file: AddStorePage.jsx:68 ~ .then ~ entries:",
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

  //func

  useEffect(() => {
    const userArr = [];
    const fetchUser = async () => {
      const rs = await call("api/users?page_size=100");
      rs.data.map((item) => userArr.push({ label: item.name, id: item.id }));
      setUserArr(userArr);
    };
    fetchUser();
  }, []);
  return (
    <div className="h-full">
      <form onSubmit={formik.handleSubmit} className="h-full">
        <div className="h-full bg-primary-100 px-5 pt-24 pb-5 overflow-y-scroll hide-scroll">
          <p className="font-semibold mb-2 text-lg">Add Store</p>
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
              {!previewPic ? (
                <div className="flex justify-between w-full h-full">
                  <div className="flex items-center justify-center w-full h-full">
                    <label
                      htmlFor="dropzone-file"
                      className="flex flex-col items-center justify-center w-full h-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6 px-3 text-center ">
                        <svg
                          aria-hidden="true"
                          className="w-10 h-10 mb-3 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          ></path>
                        </svg>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">
                            Upload Store Image
                          </span>{" "}
                          or drag to this section
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Format JPEG, PNG,JPG
                        </p>
                      </div>
                      <input
                        id="dropzone-file"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={changeUploadPicHandler}
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <div className="w-full flex flex-col gap-4 justify-center items-center ">
                  <img
                    src={previewPic}
                    className="h-[300px] w-fit object-cover rounded-lg shadow-md block"
                  />

                  <Button variant="outlined" color="error" className="w-full">
                    <label htmlFor="dropzone-file1" className="w-full">
                      Select another image
                    </label>
                  </Button>
                  <input
                    id="dropzone-file1"
                    type="file"
                    className="hidden"
                    onChange={changeUploadPicHandler}
                  />
                </div>
              )}
            </Card>

            <Card sx={{ py: 2, my: 2 }} className="basis-3/4">
              <div className="px-4 flex justify-between items-center mb-2">
                <small>
                  Please confirm the information carefully before saving
                </small>

                <div className="flex gap-3">
                  <label
                    htmlFor="doc"
                    className="flex items-center p-2 gap-2 rounded-3xl border border-gray-300 border-dashed bg-gray-50 cursor-pointer"
                  >
                    <AiOutlineCloudUpload />

                    <div className="space-y-2">
                      <div className="text-xs font-semibold text-gray-700">
                        Upload file Excel
                      </div>
                    </div>
                    <input
                      type="file"
                      id="doc"
                      name="doc"
                      accept=".xlsx, .xls, .csv"
                      onChange={changeUploadFileExcel}
                      hidden
                    />
                  </label>

                  {uploadFile && (
                    <div className="flex items-center gap-3">
                      <small>
                        <i>{uploadFile.name}</i>
                      </small>
                      <button
                        onClick={handleUploadExcel}
                        className="flex items-center p-2 gap-2 rounded-3xl border border-gray-300 border-dashed bg-gray-50 text-xs hover:border-primary-500 hover:bg-primary-500 hover:text-white"
                      >
                        {loadingUpload ? (
                          <CircularProgress size="0.75rem"></CircularProgress>
                        ) : (
                          "Confirm"
                        )}
                      </button>
                    </div>
                  )}
                </div>
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
                    sx={{ width: "100%" }}
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
          </Stack>
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
              disabled={loadingCallAPI}
              type="submit"
            >
              {loadingCallAPI ? (
                <CircularProgress size="1.5rem" color="secondary" />
              ) : (
                "ADD"
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddStorePage;

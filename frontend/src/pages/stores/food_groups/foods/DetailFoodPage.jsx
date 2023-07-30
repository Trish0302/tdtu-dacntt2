import {
  Autocomplete,
  Button,
  Card,
  CircularProgress,
  Divider,
  Stack,
  TextField,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { call } from "../../../../utils/api";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { ListFoodContext } from "../../../../stores/ListFoodContext";
import { numberWithCommas } from "../../../../utils/func";

const DetailFoodPage = () => {
  const { storeId, foodGroupId, foodId } = useParams();
  const [loading, setLoading] = useState(false);

  const [foodGroupArr, setFoodGroupArr] = useState();

  const [updateFood, setUpdateFood] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    food_group_id: foodGroupId,
  });
  console.log(
    "🚀 ~ file: EditFoodGroupPage.jsx:33 ~ EditFoodGroupPage ~ updateFood:",
    updateFood
  );
  const [previewPic, setPreviewPic] = useState();

  //func

  useEffect(() => {
    setLoading(true);
    const data = call(
      `api/stores/${storeId}/food_groups/${foodGroupId}/food/${foodId}`,
      "GET",
      null
    );
    data.then((response) => {
      console.log(
        "🚀 ~ file: EditFoodGroupPage.jsx:57 ~ data.then ~ response:",
        response
      );

      setUpdateFood({
        ...response.data,
        price: numberWithCommas(response.data.price),
      });
      setPreviewPic(response.data.avatar);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const foodGroupArr = [];
    const fetchData = async () => {
      const rs = await call("api/food-groups?page_size=1000");
      rs.data.map((item) =>
        foodGroupArr.push({
          label: item.name,
          id: item.id,
          storeId: item.store_id,
        })
      );
      setFoodGroupArr(foodGroupArr);
    };
    fetchData();
  }, []);
  return (
    <>
      {!loading ? (
        <div className="h-full bg-primary-100 px-5 pt-24 pb-5 overflow-y-scroll hide-scroll">
          <p className="font-semibold mb-2 text-lg">
            Detail Information of Food
          </p>
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
                  <div className="flex items-center justify-center w-full">
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
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">
                            Upload Food Image
                          </span>{" "}
                          or drag to this section
                        </p>
                        <p className="text-xs text-gray-500">
                          Format JPEG, PNG,JPG
                        </p>
                      </div>
                      <input
                        id="dropzone-file"
                        type="file"
                        className="hidden"
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
                  <input id="dropzone-file1" type="file" className="hidden" />
                </div>
              )}
            </Card>
            <Card sx={{ py: 2, my: 2 }}>
              <div className="px-4 flex justify-between items-center mb-2">
                <p className="font-semibold">
                  {" "}
                  Food{" "}
                  <span className="text-primary-500">{updateFood.name}</span>
                </p>
              </div>
              <Divider />
              <Stack direction="column" spacing={2} m={2}>
                <TextField
                  variant="outlined"
                  placeholder="Name of food"
                  label="Name of food"
                  name="name"
                  // onChange={changeHandler}
                  defaultValue={updateFood.name}
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <TextField
                  variant="outlined"
                  placeholder="Slug"
                  label="Slug"
                  name="slug"
                  defaultValue={updateFood.slug}
                  fullWidth
                  // onChange={changeHandler}
                  InputProps={{
                    readOnly: true,
                  }}
                />

                <TextField
                  variant="outlined"
                  placeholder="Price"
                  label="Price"
                  name="price"
                  defaultValue={updateFood.price + " ₫"}
                  // onChange={changeHandler}
                  InputProps={{
                    readOnly: true,
                  }}
                />
                {foodGroupArr && (
                  <Autocomplete
                    disablePortal
                    disabled
                    id="combo-box-demo"
                    options={foodGroupArr}
                    value={foodGroupArr.find(
                      (item) => item.id === updateFood.food_group_id
                    )}
                    renderInput={(params) => (
                      <TextField {...params} label="Food Group" />
                    )}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                )}
              </Stack>

              <TextField
                sx={{ mx: 2, width: "800px" }}
                placeholder="Description about food"
                multiline
                label="Description about food"
                rows={10}
                name="description"
                defaultValue={updateFood.description}
                InputProps={{
                  readOnly: true,
                }}
                // onChange={changeHandler}
                // fullWidth
              />
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

export default DetailFoodPage;

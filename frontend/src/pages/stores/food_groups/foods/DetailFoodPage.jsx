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
        <div className="h-full bg-violet-50 px-5 pt-24 pb-5 overflow-y-scroll hide-scroll">
          <p className="font-semibold mb-2 text-lg">
            Detail Information of Food
          </p>
          <Divider />
          <div className="flex items-center w-full justify-center">
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
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-violet-50">
          <CircularProgress color="secondary" />
        </div>
      )}
    </>
  );
};

export default DetailFoodPage;

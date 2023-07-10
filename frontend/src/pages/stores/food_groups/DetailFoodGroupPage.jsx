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
import { useNavigate, useParams } from "react-router-dom";
import { ListFoodGroupContext } from "../../../stores/ListFoodGroupContext";
import { call } from "../../../utils/api";

const DetailFoodGroupPage = () => {
  const { storeId, id } = useParams();
  const { state, dispatch } = useContext(ListFoodGroupContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [storeArr, setStoreArr] = useState();

  const [updateFoodGroup, setUpdateFoodGroup] = useState({
    name: "",
    slug: "",
    description: "",
    store_id: storeId,
  });
  console.log(
    "🚀 ~ file: EditFoodGroupPage.jsx:33 ~ EditFoodGroupPage ~ updateFoodGroup:",
    updateFoodGroup
  );

  useEffect(() => {
    setLoading(true);
    const data = call(`api/stores/${storeId}/food_groups/${id}`, "GET", null);
    data.then((response) => {
      console.log(
        "🚀 ~ file: EditFoodGroupPage.jsx:57 ~ data.then ~ response:",
        response
      );

      setUpdateFoodGroup(response.data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const storeArr = [];
    const fetchData = async () => {
      const rs = await call("api/stores?page_size=1000");
      rs.data.map((item) => storeArr.push({ label: item.name, id: item.id }));
      setStoreArr(storeArr);
    };
    fetchData();
  }, []);
  return (
    <>
      {!loading ? (
        <div className="h-full bg-violet-50 px-5 pt-24 pb-5 overflow-y-scroll hide-scroll">
          <p className="font-semibold mb-2 text-lg">
            Detail Information of Food Group
          </p>
          <Divider />
          <div className="flex items-center w-full justify-center">
            <Card sx={{ pt: 2, my: 2 }}>
              <div className="px-4 flex justify-between items-center mb-2">
                <p className="font-semibold">
                  Food Group{" "}
                  <span className="text-primary-500">
                    {updateFoodGroup.name}
                  </span>
                </p>
                <Button
                  color="secondary"
                  variant="contained"
                  onClick={() =>
                    navigate(`/stores/${storeId}/food-group/${id}/food`, {
                      state: { storeId: storeId, foodGroupId: id },
                    })
                  }
                >
                  View Food
                </Button>
              </div>
              <Divider />
              <Stack direction="column" spacing={2} m={2}>
                <TextField
                  variant="outlined"
                  placeholder="Name of Food group"
                  label="Name of Food group"
                  name="name"
                  defaultValue={updateFoodGroup.name}
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
                  defaultValue={updateFoodGroup.slug}
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                />
                {storeArr && (
                  <Autocomplete
                    disablePortal
                    disabled
                    id="combo-box-demo"
                    options={storeArr}
                    value={storeArr.find(
                      (item) => item.id === updateFoodGroup.store_id
                    )}
                    renderInput={(params) => (
                      <TextField {...params} label="Store" />
                    )}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                )}
              </Stack>
              <Stack spacing={2} direction="column" m={2}>
                <TextField
                  sx={{ width: "800px" }}
                  placeholder="Description about food group"
                  multiline
                  label="Description about food group"
                  rows={10}
                  name="description"
                  defaultValue={updateFoodGroup.description}
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Stack>
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

export default DetailFoodGroupPage;

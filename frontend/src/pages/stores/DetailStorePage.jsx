import React, { useContext, useEffect, useState } from "react";
import { call } from "../../utils/api";
import { useNavigate, useParams } from "react-router-dom";
import { ListStoreContext } from "../../stores/ListStoreContext";
import {
  Autocomplete,
  Button,
  Card,
  CircularProgress,
  Divider,
  Stack,
  TextField,
} from "@mui/material";

const DetailStorePage = () => {
  const { id } = useParams();
  const { state, dispatch } = useContext(ListStoreContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [userArr, setUserArr] = useState();
  console.log(
    "🚀 ~ file: DetailStorePage.jsx:22 ~ DetailStorePage ~ userArr:",
    userArr
  );
  const [updateStore, setUpdateStore] = useState({
    name: "",
    address: "",
    description: "",
    user_id: "",
  });
  console.log(
    "🚀 ~ file: EditUserPage.jsx:33 ~ EditUserPage ~ updateStore:",
    updateStore
  );

  //func

  useEffect(() => {
    setLoading(true);
    const data = call(`api/stores/${id}`, "GET", null);
    data.then((response) => {
      setUpdateStore(response.data);
      setLoading(false);
    });
  }, []);

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
    <>
      {!loading ? (
        <div className="h-full bg-primary-100 px-5 pt-24 pb-5 overflow-y-scroll hide-scroll">
          <p className="font-semibold mb-2 text-lg">
            Detail Information of Store
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
              <div className="w-full flex flex-col gap-4 justify-center items-center h-full">
                <p className="font-semibold text-lg">Store Image</p>
                <img
                  src={updateStore.avatar}
                  className="h-[300px] w-full object-cover rounded-lg shadow-md block flex-1"
                  alt={updateStore.name}
                />
              </div>
            </Card>
            <Card sx={{ py: 2, my: 2 }} className="basis-3/4">
              <div className="px-4 flex justify-between items-center mb-2">
                <p className="font-semibold">
                  Store{" "}
                  <span className="text-primary-500">{updateStore.name}</span>
                </p>
                <Button
                  color="secondary"
                  variant="contained"
                  onClick={() =>
                    navigate(`/stores/${id}/food-group`, {
                      state: { storeId: id },
                    })
                  }
                >
                  View Food group
                </Button>
              </div>
              <Divider />
              <div className="px-4">
                <Stack
                  direction="column"
                  spacing={2}
                  pt={2}
                  sx={{ width: "100%" }}
                >
                  <TextField
                    variant="outlined"
                    placeholder="Name of Store"
                    label="Name of Store"
                    name="name"
                    defaultValue={updateStore.name}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                  <TextField
                    variant="outlined"
                    placeholder="Address"
                    label="Address"
                    defaultValue={updateStore.address}
                    name="address"
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                  {userArr && (
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      options={userArr}
                      disabled
                      defaultValue={
                        userArr.find((item) => item.id === updateStore.user_id)
                          ?.label
                      }
                      renderInput={(params) => (
                        <TextField {...params} label="Owner" />
                      )}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  )}
                  <TextField
                    sx={{ width: "100%" }}
                    placeholder="Description about store"
                    multiline
                    label="Description about store"
                    rows={10}
                    defaultValue={updateStore.description}
                    name="description"
                    InputProps={{
                      readOnly: true,
                    }}
                    // fullWidth
                  />
                </Stack>
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

export default DetailStorePage;

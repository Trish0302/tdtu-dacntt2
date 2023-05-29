import React, { useEffect, useState } from "react";
import Search from "../../components/search/Search";
import {
  Card,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { call } from "../../utils/api";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";

const StoresPage = () => {
  const [dataStore, setDataStore] = useState();
  console.log(
    "🚀 ~ file: Dashboard.jsx:22 ~ Dashboard ~ dataStore:",
    dataStore
  );

  useEffect(() => {
    const fetchData = async () => {
      const rs = await call("api/stores?page=1", "GET", {});
      console.log("🚀 ~ file: StoresPage.jsx:23 ~ fetchData ~ rs:", rs);
      setDataStore(rs.data);
    };
    fetchData();
  }, []);

  return (
    <div className="h-screen bg-violet-50 px-5">
      <div className="flex items-center">
        <Search />
        <button className="px-6 py-2 text-primary-500 bg-white rounded-lg font-semibold uppercase text-sm mr-10 ml-3">
          Tìm
        </button>
        <button className="px-10 py-2 text-white bg-primary-500 rounded-lg font-semibold uppercase text-sm">
          Thêm
        </button>
      </div>

      <Card sx={{ mt: 2 }}>
        <TableContainer sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="left">ID</TableCell>
                <TableCell align="left">Name</TableCell>
                <TableCell align="left">Address</TableCell>
                <TableCell align="left">Description</TableCell>
                <TableCell align="left">Owner</TableCell>
                <TableCell align="right" />
              </TableRow>
            </TableHead>

            <TableBody>
              {dataStore &&
                dataStore.map((store) => (
                  <TableRow key={store.id}>
                    <TableCell align="left">{store.id}</TableCell>
                    <TableCell align="left">{store.name}</TableCell>
                    <TableCell align="left">{store.address}</TableCell>
                    <TableCell align="left">{store.description}</TableCell>
                    <TableCell align="left">{store?.user?.name}</TableCell>
                    <TableCell align="right">
                      <IconButton aria-label="edit">
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton aria-label="edit">
                        <EditIcon />
                      </IconButton>
                      <IconButton aria-label="delete">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </div>
  );
};

export default StoresPage;

import { AsyncStorage } from "AsyncStorage";
import config from "./config";
import axios from "axios";

export const callNon = async (url, med, params) => {
  const options = {
    method: med,
    timeout: 15000,
    headers: {
      "content-type": "application/json",
      accept: "application/json",
    },
    data: JSON.stringify(params),
    url: `${config.apiUrl}${url}`,
  };
  return axios(options)
    .then((response) => {
      // console.log(response);
      return response.data;
    })
    .catch((err) => {
      console.log(err);
      return err.response;
    });
};

export const call = async (url, med, params) => {
  let tk = null;
  const item = await AsyncStorage.getItem("token-admin");
  // console.log("🚀 ~ file: api.jsx:29 ~ call ~ item:", item);
  if (item !== undefined || item !== "null") {
    const { access_token } = JSON.parse(item);
    tk = access_token;
  }
  const options = {
    method: med,
    timeout: 15000,
    headers: {
      "content-type": "application/json",
      accept: "application/json",
      Authorization: `Bearer ${tk}`,
    },
    data: med === "POST" ? JSON.stringify(params) : params,
    url: `${config.apiUrl}${url}`,
  };
  // console.log("🚀 ~ file: api.jsx:44 ~ call ~ options:", options);

  return axios(options)
    .then((response) => {
      // console.log(`response = `, response.data);
      return response.data;
    })
    .catch((err) => {
      console.log(`err = `, err.response);
      // if (err.response && err.response.data && err.response.data.message) {
      //   return err.response.data.message;
      // }
      return err.response;
    });
};

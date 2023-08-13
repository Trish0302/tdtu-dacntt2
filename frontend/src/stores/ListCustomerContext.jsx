import React, { useReducer, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { call } from "../utils/api";
import { useLocation } from "react-router-dom";

const initialState = {
  list: [],
};
const removeCustomer = (sid, state) => {
  const temp = [...state.list];
  const total = state.total;
  const index = temp.findIndex((item) => item.id === sid);
  temp.splice(index, 1);
  return { ...state, list: temp, total: total - 1 };
};
const addCustomer = (item, state) => {
  const temp = [...state.list];
  temp.unshift(item);
  return { ...state, list: temp };
};
const updateCustomer = (item, state) => {
  const temp = [...state.list];
  const index = temp.findIndex((obj) => obj.id === item.id);
  temp[index] = item;
  return { ...state, list: temp };
};
const getCustomer = (item, state) => {
  const temp = [...state.list];
  const index = temp.findIndex((obj) => obj.id === item.id);
  return index;
};
const reducer = (state, action) => {
  switch (action.type) {
    case "setList":
      return { ...state, list: action.payload.list };
    case "getTotal":
      return { ...state, total: action.payload.total };
    case "getCustomer":
      return getCustomer(action.item, state);
    case "removeCustomer":
      return removeCustomer(action.sid, state);
    case "addCustomer":
      return addCustomer(action.item, state);
    case "updateCustomer":
      return updateCustomer(action.item, state);
    default:
      return { ...state };
  }
};
const ListCustomerContext = React.createContext(initialState);
function ListCustomerProvider({ children }) {
  const location = useLocation();

  const [state, dispatch] = useReducer(reducer, initialState);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getListCustomer();
  }, []);
  async function getListCustomer() {
    const result = await call(`api/customers?page=1&page_size=5`, "GET", {});

    console.log(
      "🚀 ~ file: ListCustomerContext.jsx:64 ~ getListCustomer ~ result:",
      result
    );
    dispatch({ type: "setList", payload: { list: result.data } });
    dispatch({ type: "getTotal", payload: { total: result.paging.total } });
    setIsLoading(false);
  }
  return (
    <ListCustomerContext.Provider value={{ state, dispatch, isLoading }}>
      {children}
    </ListCustomerContext.Provider>
  );
}
ListCustomerProvider.propTypes = {
  children: PropTypes.any,
};
export { ListCustomerContext, ListCustomerProvider };

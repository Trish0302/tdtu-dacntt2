import React, { useReducer, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { call } from "../utils/api";
import { useLocation } from "react-router-dom";

const initialState = {
  list: [],
};
const removeOrder = (sid, state) => {
  const temp = [...state.list];
  const index = temp.findIndex((item) => item.id === sid);
  temp.splice(index, 1);
  return { ...state, list: temp };
};
const addOrder = (item, state) => {
  const temp = [...state.list];
  temp.unshift(item);
  return { ...state, list: temp };
};
const updateOrder = (item, state) => {
  const temp = [...state.list];
  const index = temp.findIndex((obj) => obj.id === item.id);
  temp[index] = item;
  return { ...state, list: temp };
};
const getOrder = (item, state) => {
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
    case "getOrder":
      return getOrder(action.item, state);
    case "removeOrder":
      return removeOrder(action.sid, state);
    case "addOrder":
      return addOrder(action.item, state);
    case "updateOrder":
      return updateOrder(action.item, state);
    default:
      return { ...state };
  }
};
const ListOrderContext = React.createContext(initialState);
function ListOrderProvider({ children }) {
  const location = useLocation();

  const [state, dispatch] = useReducer(reducer, initialState);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getListOrder();
  }, []);
  async function getListOrder() {
    let result;

    result = await call(`api/orders?page=1&page_size=5`, "GET", {});

    dispatch({ type: "setList", payload: { list: result.data } });
    dispatch({ type: "getTotal", payload: { total: result.paging.total } });
    setIsLoading(false);
  }
  return (
    <ListOrderContext.Provider value={{ state, dispatch, isLoading }}>
      {children}
    </ListOrderContext.Provider>
  );
}
ListOrderProvider.propTypes = {
  children: PropTypes.any,
};
export { ListOrderContext, ListOrderProvider };

import React, { useReducer, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { call } from "../utils/api";

const initialState = {
  list: [],
};
const removeVoucher = (sid, state) => {
  const temp = [...state.list];
  const index = temp.findIndex((item) => item.id === sid);
  temp.splice(index, 1);
  return { ...state, list: temp };
};
const addVoucher = (item, state) => {
  const temp = [...state.list];
  temp.unshift(item);
  return { ...state, list: temp };
};
const updateVoucher = (item, state) => {
  const temp = [...state.list];
  const index = temp.findIndex((obj) => obj.id === item.id);
  temp[index] = item;
  return { ...state, list: temp };
};
const getVoucher = (item, state) => {
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
    case "getVoucher":
      return getVoucher(action.item, state);
    case "removeVoucher":
      return removeVoucher(action.sid, state);
    case "addVoucher":
      return addVoucher(action.item, state);
    case "updateVoucher":
      return updateVoucher(action.item, state);
    default:
      return { ...state };
  }
};
const ListVoucherContext = React.createContext(initialState);
function ListVoucherProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getListVoucher();
  }, []);
  async function getListVoucher() {
    const result = await call("api/vouchers?page=1&page_size=5", "GET", {});
    console.log(
      "🚀 ~ file: ListVoucherContext.jsx:59 ~ getListVoucher ~ result:",
      result
    );

    dispatch({ type: "setList", payload: { list: result.data } });
    dispatch({ type: "getTotal", payload: { total: result.paging.total } });
    setIsLoading(false);
  }
  return (
    <ListVoucherContext.Provider value={{ state, dispatch, isLoading }}>
      {children}
    </ListVoucherContext.Provider>
  );
}
ListVoucherProvider.propTypes = {
  children: PropTypes.any,
};
export { ListVoucherContext, ListVoucherProvider };

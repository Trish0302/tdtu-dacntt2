import React, { useReducer, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { call } from "../utils/api";

const initialState = {
  list: [],
};
const removeStore = (sid, state) => {
  const temp = [...state.list];
  const index = temp.findIndex((item) => item.id === sid);
  temp.splice(index, 1);
  return { ...state, list: temp };
};
const addStore = (item, state) => {
  const temp = [...state.list];
  temp.unshift(item);
  return { ...state, list: temp };
};
const updateStore = (item, state) => {
  const temp = [...state.list];
  const index = temp.findIndex((obj) => obj.id === item.id);
  temp[index] = item;
  return { ...state, list: temp };
};
const getStore = (item, state) => {
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
    case "getStore":
      return getStore(action.item, state);
    case "removeStore":
      return removeStore(action.sid, state);
    case "addStore":
      return addStore(action.item, state);
    case "updateStore":
      return updateStore(action.item, state);
    default:
      return { ...state };
  }
};
const ListStoreContext = React.createContext(initialState);
function ListStoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getListStore();
  }, []);
  async function getListStore() {
    const result = await call("api/stores?page=1&page_size=5", "GET", {});
    console.log(
      "🚀 ~ file: ListStoreContext.jsx:59 ~ getListStore ~ result:",
      result
    );

    dispatch({ type: "setList", payload: { list: result.data } });
    dispatch({ type: "getTotal", payload: { total: result.paging.total } });
    setIsLoading(false);
  }
  return (
    <ListStoreContext.Provider value={{ state, dispatch, isLoading }}>
      {children}
    </ListStoreContext.Provider>
  );
}
ListStoreProvider.propTypes = {
  children: PropTypes.any,
};
export { ListStoreContext, ListStoreProvider };

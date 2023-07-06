import React, { useReducer, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { call } from "../utils/api";

const initialState = {
  list: [],
};
const removeUser = (sid, state) => {
  const temp = [...state.list];
  const index = temp.findIndex((item) => item.id === sid);
  temp.splice(index, 1);
  return { ...state, list: temp };
};
const addUser = (item, state) => {
  const temp = [...state.list];
  temp.unshift(item);
  return { ...state, list: temp };
};
const updateUser = (item, state) => {
  const temp = [...state.list];
  const index = temp.findIndex((obj) => obj.id === item.id);
  temp[index] = item;
  return { ...state, list: temp };
};
const getUser = (item, state) => {
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
    case "getUser":
      return getUser(action.item, state);
    case "removeUser":
      return removeUser(action.sid, state);
    case "addUser":
      return addUser(action.item, state);
    case "updateUser":
      return updateUser(action.item, state);
    default:
      return { ...state };
  }
};
const ListUserContext = React.createContext(initialState);
function ListUserProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getListUser();
  }, []);
  async function getListUser() {
    const result = await call("api/users?page=1&page_size=5", "GET", {});
    console.log(
      "🚀 ~ file: ListUserContext.jsx:59 ~ getListUser ~ result:",
      result
    );

    dispatch({ type: "setList", payload: { list: result.data } });
    dispatch({ type: "getTotal", payload: { total: result.total } });
    setIsLoading(false);
  }
  return (
    <ListUserContext.Provider value={{ state, dispatch, isLoading }}>
      {children}
    </ListUserContext.Provider>
  );
}
ListUserProvider.propTypes = {
  children: PropTypes.any,
};
export { ListUserContext, ListUserProvider };

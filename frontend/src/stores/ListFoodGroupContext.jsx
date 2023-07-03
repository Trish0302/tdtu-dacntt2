import React, { useReducer, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { call } from "../utils/api";
import { useLocation } from "react-router-dom";

const initialState = {
  list: [],
};
const removeFoodGroup = (sid, state) => {
  const temp = [...state.list];
  const index = temp.findIndex((item) => item.id === sid);
  temp.splice(index, 1);
  return { ...state, list: temp };
};
const addFoodGroup = (item, state) => {
  const temp = [...state.list];
  temp.unshift(item);
  return { ...state, list: temp };
};
const updateFoodGroup = (item, state) => {
  const temp = [...state.list];
  const index = temp.findIndex((obj) => obj.id === item.id);
  temp[index] = item;
  return { ...state, list: temp };
};
const getFoodGroup = (item, state) => {
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
    case "getFoodGroup":
      return getFoodGroup(action.item, state);
    case "removeFoodGroup":
      return removeFoodGroup(action.sid, state);
    case "addFoodGroup":
      return addFoodGroup(action.item, state);
    case "updateFoodGroup":
      return updateFoodGroup(action.item, state);
    default:
      return { ...state };
  }
};
const ListFoodGroupContext = React.createContext(initialState);
function ListFoodGroupProvider({ children }) {
  const location = useLocation();

  const [state, dispatch] = useReducer(reducer, initialState);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getListFoodGroup();
  }, []);
  async function getListFoodGroup() {
    let result;

    if (location.state) {
      result = await call(
        `api/stores/${location.state.storeId}/food_groups?page=1&page_size=5`,
        "GET",
        {}
      );
      console.log(
        "🚀 ~ file: ListFoodGroupContext.jsx:59 ~ getListFoodGroup ~ result:",
        result
      );
    } else {
      result = await call(`api/food-groups?page=1&page_size=5`, "GET", {});

      console.log(
        "🚀 ~ file: ListFoodGroupContext.jsx:78 ~ getListFoodGroup ~ result:",
        result
      );
    }

    dispatch({ type: "setList", payload: { list: result.data } });
    dispatch({ type: "getTotal", payload: { total: result.paging.total } });
    setIsLoading(false);
  }
  return (
    <ListFoodGroupContext.Provider value={{ state, dispatch, isLoading }}>
      {children}
    </ListFoodGroupContext.Provider>
  );
}
ListFoodGroupProvider.propTypes = {
  children: PropTypes.any,
};
export { ListFoodGroupContext, ListFoodGroupProvider };

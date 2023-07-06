import React, { useReducer, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { call } from "../utils/api";
import { useLocation } from "react-router-dom";

const initialState = {
  list: [],
};
const removeFood = (sid, state) => {
  const temp = [...state.list];
  const index = temp.findIndex((item) => item.id === sid);
  temp.splice(index, 1);
  return { ...state, list: temp };
};
const addFood = (item, state) => {
  const temp = [...state.list];
  temp.unshift(item);
  return { ...state, list: temp };
};
const updateFood = (item, state) => {
  const temp = [...state.list];
  const index = temp.findIndex((obj) => obj.id === item.id);
  temp[index] = item;
  return { ...state, list: temp };
};
const getFood = (item, state) => {
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
    case "getFood":
      return getFood(action.item, state);
    case "removeFood":
      return removeFood(action.sid, state);
    case "addFood":
      return addFood(action.item, state);
    case "updateFood":
      return updateFood(action.item, state);
    default:
      return { ...state };
  }
};
const ListFoodContext = React.createContext(initialState);
function ListFoodProvider({ children }) {
  const location = useLocation();

  const [state, dispatch] = useReducer(reducer, initialState);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getListFood();
  }, []);
  async function getListFood() {
    let result;

    if (location.state) {
      result = await call(
        `api/stores/${location.state.storeId}/food_groups/${location.state.foodGroupId}/food?page=1&page_size=5`,
        "GET",
        {}
      );
    } else {
      result = await call(`api/food?page=1&page_size=5`, "GET", {});
    }
    console.log(
      "🚀 ~ file: ListFoodContext.jsx:71 ~ getListFood ~ result:",
      result
    );

    dispatch({ type: "setList", payload: { list: result.data } });
    dispatch({ type: "getTotal", payload: { total: result.paging.total } });
    setIsLoading(false);
  }
  return (
    <ListFoodContext.Provider value={{ state, dispatch, isLoading }}>
      {children}
    </ListFoodContext.Provider>
  );
}
ListFoodProvider.propTypes = {
  children: PropTypes.any,
};
export { ListFoodContext, ListFoodProvider };

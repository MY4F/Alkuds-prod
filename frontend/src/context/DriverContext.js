import { createContext, useReducer } from "react";
import { useEffect } from "react";
import useLogout from "../hooks/useLogout";
import { useUserContext } from "../hooks/useUserContext";

export const DriverContext = createContext();

export const DriverReducer = (state, action) => {
  switch (action.type) {
    case "SET_DRIVERS":
      return {
        driver: action.payload,
      };
    case "ADD_DRIVER":
      return {
        driver: [action.payload, ...state.driver],
      };
    case "UPDATE_DRIVERS":
      let newDriver = state.driver
      newDriver[action.payload.driverId] = action.payload
      return {
        driver: newDriver,
      };
    case "DELETE_DRIVER":
      return {
        driver: [
          ...state.driver.filter(
            (w) => w._id !== action.payload._id
          ),
        ],
      };
    default:
      return state;
  }
};

export const DriverContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(DriverReducer, {
    driver: null,
  });

  const {logout} = useLogout();
  const { user } = useUserContext()

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    const getDrivers = async () => {
      const response = await fetch("/driver/getDriversInfo", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${user.token}`
        },
      });
      let jsonAns = await response.json();
      if (response.ok) {
        console.log(jsonAns)
        dispatch({ type: "SET_DRIVERS", payload: jsonAns });
      }
      else{
        localStorage.removeItem('user');
        logout()
      }
    };
    if(user)
        getDrivers();
  }, [dispatch,user]);

  return (
    <DriverContext.Provider value={{ ...state, dispatch }}>
      {children}
    </DriverContext.Provider>
  );
};

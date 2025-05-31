import { createContext, useReducer } from "react";
import { useEffect } from "react";
import useLogout from "../hooks/useLogout";
export const AwaitForPaymentTicketsContext = createContext();

export const AwaitForPaymentTicketsReducer = (state, action) => {
  switch (action.type) {
    case "SET_TICKETS":
      return {
        awaitForPaymentTickets: action.payload,
      };
    case "ADD_TICKET":
      {
        let typeObj = {
          "in":"inOrders",
          "out":"outOrders"
        }
        let usedArrObj = state.awaitForPaymentTickets
        for(let j of action.payload){
          usedArrObj[`${typeObj[j.type]}`].push(j)
        }
        return {
            awaitForPaymentTickets: usedArrObj
        };
      }
    case "UPDATE_TICKET":
      let typeObj = {
        "in":"inOrders",
        "out":"outOrders"
      }
      let newArr = []
      let usedArrObj = state.awaitForPaymentTickets
      for(let j of action.payload){
        for(let i = 0 ;i<usedArrObj[`${typeObj[j.type]}`].length;i++){
          if(usedArrObj[`${typeObj[j.type]}`][i]._id === j._id){
            usedArrObj[`${typeObj[j.type]}`][i] = j
          }
        }
      }
      return {
          awaitForPaymentTickets: usedArrObj
      };
    case "DELETE_TICKET":
      {
        let typeObj = {
          "in":"inOrders",
          "out":"outOrders"
        }
        let newArr = []
        let usedArrObj = state.awaitForPaymentTickets
        for(let j of action.payload){
          for(let i = 0 ;i<usedArrObj[`${typeObj[j.type]}`].length;i++){
            if(usedArrObj[`${typeObj[j.type]}`][i]._id === j._id){
              usedArrObj[`${typeObj[j.type]}`].splice(i,1)
            }
          }
        }
        return {
          awaitForPaymentTickets: usedArrObj
        };
      }
    default:
      return state;
  }
};

export const AwaitForPaymentTicketsContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AwaitForPaymentTicketsReducer, {
    awaitForPaymentTickets: {},
  });
  const {logout} = useLogout();
  const user = JSON.parse(localStorage.getItem('user'))
  if(user)
  console.log(user.token)
  useEffect(() => {
    const getAwaitForPaymentTickets = async () => {
      const response = await fetch("/order/getAwaitForPaymentOrdersGroupedByType", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${user.token}`
        },
      });
      let jsonAns = await response.json();
      if (response.ok) {
        console.log(jsonAns)
        dispatch({ type: "SET_TICKETS", payload: jsonAns });
      }else{
        localStorage.removeItem('user');
        logout()
      }
    };
    if(user)
    getAwaitForPaymentTickets();
  }, [dispatch]);

  return (
    <AwaitForPaymentTicketsContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AwaitForPaymentTicketsContext.Provider>
  );
};

import { createContext, useReducer } from "react";
import { useEffect } from "react";
import useLogout from "../hooks/useLogout";

export const FinishedTicketsContext = createContext();

export const FinishedTicketsReducer = (state, action) => {
  switch (action.type) {
    case "SET_TICKETS":
      return {
        finishedTickets: action.payload,
      };
    case "ADD_TICKET":
      {
        let typeObj = {
          "in":"inOrders",
          "out":"outOrders"
        }
        let usedArrObj = state.finishedTickets
        for(let j of action.payload){
          usedArrObj[`${typeObj[j.type]}`].push(j)
        }
        return {
            finishedTickets: usedArrObj
        };
      }
    case "UPDATE_TICKET":
      {  
        let typeObj = {
          "in":"inOrders",
          "out":"outOrders"
        }
        let newArr = []
        let usedArrObj = state.finishedTickets
        for(let j of action.payload){
          for(let i = 0 ;i<usedArrObj[`${typeObj[j.type]}`].length;i++){
            if(usedArrObj[`${typeObj[j.type]}`][i]._id === j._id){
              usedArrObj[`${typeObj[j.type]}`][i] = j
            }
          }
        }
        return {
          finishedTickets: usedArrObj
        };
      }
    case "DELETE_TICKET":
      {
        let typeObj = {
          "in":"inOrders",
          "out":"outOrders"
        }
        let newArr = []
        let usedArrObj = state.finishedTickets
        for(let j of action.payload){
          for(let i = 0 ;i<usedArrObj[`${typeObj[j.type]}`].length;i++){
            if(usedArrObj[`${typeObj[j.type]}`][i]._id === j._id){
              usedArrObj[`${typeObj[j.type]}`].splice(i,1)
            }
          }
        }
        return {
          finishedTickets: usedArrObj
        };
      }
    default:
      return state;
  }
};

export const FinishedTicketsContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(FinishedTicketsReducer, {
    finishedTickets: {},
  });

  const {logout} = useLogout();


  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    const getFinishedTickets = async () => {
      const response = await fetch("/order/getFinishedOrdersInfoGroupedByType", {
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
      }
      else{
        localStorage.removeItem('user');
        logout()
      }
    };
    if(user)
    getFinishedTickets();
  }, [dispatch]);

  return (
    <FinishedTicketsContext.Provider value={{ ...state, dispatch }}>
      {children}
    </FinishedTicketsContext.Provider>
  );
};

import { createContext, useReducer } from "react";
import { useEffect } from "react";
import useLogout from "../hooks/useLogout";

export const UnfinishedTicketsContext = createContext();

export const UnfinishedTicketsReducer = (state, action) => {
  switch (action.type) {
    case "SET_TICKETS":
      return {
        unfinishedTickets: action.payload,
      };
    case "ADD_TICKET":
      {
        let typeObj = {
          "in":"inOrders",
          "out":"outOrders"
        }
        let usedArrObj = state.unfinishedTickets
        for(let j of action.payload){
          usedArrObj[`${typeObj[j.type]}`].push(j)
        }
        return {
          unfinishedTickets: usedArrObj
        };
      };
    case "UPDATE_TICKET":
    {  
      let typeObj = {
        "in":"inOrders",
        "out":"outOrders"
      }
      let newArr = []
      let usedArrObj = state.unfinishedTickets
      for(let j of action.payload){
        for(let i = 0 ;i<usedArrObj[`${typeObj[j.type]}`].length;i++){
          if(usedArrObj[`${typeObj[j.type]}`][i]._id === j._id){
            usedArrObj[`${typeObj[j.type]}`][i] = j
          }
        }
      }
      return {
        unfinishedTickets: usedArrObj
      };
    }
    case "DELETE_TICKET":
      {
        let typeObj = {
          "in":"inOrders",
          "out":"outOrders"
        }
        let newArr = []
        let usedArrObj = state.unfinishedTickets
        console.log("action.payload",action.payload)
        for(let j of action.payload){
          for(let i = 0 ;i<usedArrObj[`${typeObj[j.type]}`].length;i++){
            if(usedArrObj[`${typeObj[j.type]}`][i]._id === j._id){
              usedArrObj[`${typeObj[j.type]}`].splice(i,1)
            }
          }
        }
        return {
          unfinishedTickets: usedArrObj
        };
      }
    default:
      return state;
  }
};

export const UnfinishedTicketsContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(UnfinishedTicketsReducer, {
    unfinishedTickets: {},
  });

  const {logout} = useLogout();


  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    const getUnfinishedTickets = async () => {
      const response = await fetch("/order/getUnfinishedOrdersInfoGroupedByType", {
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
    getUnfinishedTickets();
  }, [dispatch]);

  return (
    <UnfinishedTicketsContext.Provider value={{ ...state, dispatch }}>
      {children}
    </UnfinishedTicketsContext.Provider>
  );
};

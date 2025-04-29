import { createContext, useReducer } from "react";
import { useEffect } from "react";
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
      let typeObj = {
        "in":"inOrders",
        "out":"outOrders"
      }
      let newArr = []
      for(let i = 0 ;i<state.unfinishedTickets[`${typeObj[action.payload.type]}`].length;i++){
        if(state.unfinishedTickets[`${typeObj[action.payload.type]}`][i]._id === action.payload._id){
          newArr.push(action.payload)
        }
        else{
          newArr.push(state.unfinishedTickets[`${typeObj[action.payload.type]}`][i])
        }
      }
      if(typeObj[action.payload.type] === "in")
      {
        return {
          unfinishedTickets: {"inOrders": newArr, "outOrders":state.unfinishedTickets["outOrders"] },
        };
      }
      else
      {
        return {
          unfinishedTickets: {"outOrders": newArr, "inOrders":state.unfinishedTickets["inOrders"] },
        };
      }
      
    case "DELETE_TICKET":
      {
        let typeObj = {
          "in":"inOrders",
          "out":"outOrders"
        }
        let newArr = []
        for(let i = 0 ;i<state.unfinishedTickets[`${typeObj[action.payload.type]}`].length;i++){
          if(state.unfinishedTickets[`${typeObj[action.payload.type]}`][i]._id !== action.payload._id){
            newArr.push(state.unfinishedTickets[`${typeObj[action.payload.type]}`][i])
          }
        }
        if(typeObj[action.payload.type] === "in")
        {
          return {
            unfinishedTickets: {"inOrders": newArr, "outOrders":state.unfinishedTickets["outOrders"] },
          };
        }
        else
        {
          return {
            unfinishedTickets: {"outOrders": newArr, "inOrders":state.unfinishedTickets["inOrders"] },
          };
        }
      }
    default:
      return state;
  }
};

export const UnfinishedTicketsContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(UnfinishedTicketsReducer, {
    unfinishedTickets: {},
  });

  useEffect(() => {
    const getUnfinishedTickets = async () => {
      const response = await fetch("/order/getUnfinishedOrdersInfoGroupedByType", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      let jsonAns = await response.json();
      if (response.ok) {
        console.log(jsonAns)
        dispatch({ type: "SET_TICKETS", payload: jsonAns });
      }
    };
    getUnfinishedTickets();
  }, [dispatch]);

  return (
    <UnfinishedTicketsContext.Provider value={{ ...state, dispatch }}>
      {children}
    </UnfinishedTicketsContext.Provider>
  );
};

import { createContext, useReducer } from "react";
import { useEffect } from "react";
export const FinishedTicketsContext = createContext();

export const FinishedTicketsReducer = (state, action) => {
  switch (action.type) {
    case "SET_TICKETS":
      return {
        finishedTickets: action.payload,
      };
    case "ADD_TICKET":
      return {
        finishedTickets: [action.payload, ...state.finishedTickets],
      };
    case "UPDATE_TICKET":
      let typeObj = {
        "in":"inOrders",
        "out":"outOrders"
      }
      console.log(state.finishedTickets[`${typeObj[action.payload.type]}`][0])
      let newArr = []
      for(let i = 0 ;i<state.finishedTickets[`${typeObj[action.payload.type]}`].length;i++){
        if(state.finishedTickets[`${typeObj[action.payload.type]}`][i]._id === action.payload._id){
          newArr.push(action.payload)
        }
        else{
          newArr.push(state.finishedTickets[`${typeObj[action.payload.type]}`][i])
        }
      }
      if(typeObj[action.payload.type] === "in")
      {
        return {
          finishedTickets: {"inOrders": newArr, "outOrders":state.finishedTickets["outOrders"] },
        };
      }
      else
      {
        return {
          finishedTickets: {"outOrders": newArr, "inOrders":state.finishedTickets["inOrders"] },
        };
      }
    case "DELETE_TICKET":
      return {
        finishedTickets: [
          ...state.finishedTickets.filter(
            (w) => w._id !== action.payload._id
          ),
        ],
      };
    default:
      return state;
  }
};

export const FinishedTicketsContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(FinishedTicketsReducer, {
    finishedTickets: {},
  });

  useEffect(() => {
    const getFinishedTickets = async () => {
      const response = await fetch("/order/getFinishedOrdersInfoGroupedByType", {
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
    getFinishedTickets();
  }, [dispatch]);

  return (
    <FinishedTicketsContext.Provider value={{ ...state, dispatch }}>
      {children}
    </FinishedTicketsContext.Provider>
  );
};

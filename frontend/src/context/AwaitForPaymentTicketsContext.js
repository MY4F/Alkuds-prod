import { createContext, useReducer } from "react";
import { useEffect } from "react";
export const AwaitForPaymentTicketsContext = createContext();

export const AwaitForPaymentTicketsReducer = (state, action) => {
  switch (action.type) {
    case "SET_TICKETS":
      return {
        awaitForPaymentTickets: action.payload,
      };
    case "ADD_TICKET":
      return {
        awaitForPaymentTickets: [action.payload, ...state.awaitForPaymentTickets],
      };
    case "UPDATE_TICKET":
      let typeObj = {
        "in":"inOrders",
        "out":"outOrders"
      }
      console.log(state.awaitForPaymentTickets[`${typeObj[action.payload.type]}`][0])
      let newArr = []
      for(let i = 0 ;i<state.awaitForPaymentTickets[`${typeObj[action.payload.type]}`].length;i++){
        if(state.awaitForPaymentTickets[`${typeObj[action.payload.type]}`][i]._id === action.payload._id){
          newArr.push(action.payload)
        }
        else{
          newArr.push(state.awaitForPaymentTickets[`${typeObj[action.payload.type]}`][i])
        }
      }
      if(typeObj[action.payload.type] === "in")
      {
        return {
            awaitForPaymentTickets: {"inOrders": newArr, "outOrders":state.awaitForPaymentTickets["outOrders"] },
        };
      }
      else
      {
        return {
            awaitForPaymentTickets: {"outOrders": newArr, "inOrders":state.awaitForPaymentTickets["inOrders"] },
        };
      }
    case "DELETE_TICKET":
      return {
        awaitForPaymentTickets: [
          ...state.awaitForPaymentTickets.filter(
            (w) => w._id !== action.payload._id
          ),
        ],
      };
    default:
      return state;
  }
};

export const AwaitForPaymentTicketsContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AwaitForPaymentTicketsReducer, {
    awaitForPaymentTickets: {},
  });

  useEffect(() => {
    const getAwaitForPaymentTickets = async () => {
      const response = await fetch("/order/getAwaitForPaymentOrdersGroupedByType", {
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
    getAwaitForPaymentTickets();
  }, [dispatch]);

  return (
    <AwaitForPaymentTicketsContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AwaitForPaymentTicketsContext.Provider>
  );
};

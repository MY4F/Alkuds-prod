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
      return {
        unfinishedTickets: [action.payload, ...state.unfinishedTickets],
      };
    case "UPDATE_TICKET":
      return {
        unfinishedTickets: [...action.payload],
      };
    case "DELETE_TICKET":
      return {
        unfinishedTickets: [
          ...state.unfinishedTickets.filter(
            (w) => w._id !== action.payload._id
          ),
        ],
      };
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

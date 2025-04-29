import { createContext, useReducer } from "react";
import { useEffect } from "react";
export const NewTicketsContext = createContext();

export const NewTicketsReducer = (state, action) => {
  switch (action.type) {
    case "SET_TICKETS":
      return {
        newTickets: action.payload,
      };
    case "ADD_TICKET":
      return {
        newTickets: [action.payload, ...state.newTickets],
      };
    case "UPDATE_TICKET":
      let typeObj = {
        "in":"inOrders",
        "out":"outOrders"
      }
      let newArr = []
      for(let i = 0 ;i<state.newTickets[`${typeObj[action.payload.type]}`].length;i++){
        if(state.newTickets[`${typeObj[action.payload.type]}`][i]._id === action.payload._id){
          newArr.push(action.payload)
        }
        else{
          newArr.push(state.newTickets[`${typeObj[action.payload.type]}`][i])
        }
      }
      if(typeObj[action.payload.type] === "in")
      {
        return {
          newTickets: {"inOrders": newArr, "outOrders":state.newTickets["outOrders"] },
        };
      }
      else
      {
        return {
          newTickets: {"outOrders": newArr, "inOrders":state.newTickets["inOrders"] },
        };
      }
      
    case "DELETE_TICKET":
      {
        let typeObj = {
          "in":"inOrders",
          "out":"outOrders"
        }
        let newArr = []
        for(let i = 0 ;i<state.newTickets[`${typeObj[action.payload.type]}`].length;i++){
          if(state.newTickets[`${typeObj[action.payload.type]}`][i]._id !== action.payload._id){
            newArr.push(state.newTickets[`${typeObj[action.payload.type]}`][i])
          }
        }
        if(typeObj[action.payload.type] === "in")
        {
          return {
            newTickets: {"inOrders": newArr, "outOrders":state.newTickets["outOrders"] },
          };
        }
        else
        {
          return {
            newTickets: {"outOrders": newArr, "inOrders":state.newTickets["inOrders"] },
          };
        }
      }
    default:
      return state;
  }
};

function isSameDay(date1Str, date2Str) {
    const date1 = new Date(date1Str);
    const date2 = new Date(date2Str);
    console.log(date1,date2)
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
}

const updateState = async(_id) => {
    const statusUpdate = await fetch("/order/orderChangeState", {
        method: "POST",
        body: JSON.stringify({_id}),
        headers: {
          "Content-Type": "application/json",
        }
    })

    const result = await statusUpdate.json()
    return result
}

export const NewTicketsContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(NewTicketsReducer, {
    newTickets: {},
  });

  useEffect(() => {
    const getNewTickets = async () => {
      const response = await fetch("/order/getNewOrdersInfoGroupedByType", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      let jsonAns = await response.json();
      if (response.ok) {
        let newArr = {"inOrders":[],"outOrders":[]}
        for(let i of jsonAns["inOrders"]){
            if(isSameDay(i.date, new Date())){
                let res = updateState(i._id)
            }
            else{
                newArr["inOrders"].push(i)
            }
        }
        for(let i of jsonAns["outOrders"]){
            console.log(isSameDay(i.date, new Date()))
            if(isSameDay(i.date, new Date())){
                let res = updateState(i._id)
            }
            else{
                newArr["outOrders"].push(i)
            }
        }
        dispatch({ type: "SET_TICKETS", payload: jsonAns });
      }
    };
    getNewTickets();
  }, [dispatch]);

  return (
    <NewTicketsContext.Provider value={{ ...state, dispatch }}>
      {children}
    </NewTicketsContext.Provider>
  );
};

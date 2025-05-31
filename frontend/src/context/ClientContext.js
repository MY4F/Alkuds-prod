import { createContext, useReducer } from "react";
import { useEffect } from "react";
import useLogout from "../hooks/useLogout";

export const ClientContext = createContext();

export const ClientReducer = (state, action) => {
  switch (action.type) {
    case "SET_CLIENTS":
      return {
        client: action.payload,
      };
    case "ADD_TICKET":
      return {
        client: [action.payload, ...state.client],
      };
    case "UPDATE_CLIENT":
      let newClient = state.client
      newClient[action.payload.clientId] = action.payload
      return {
        client: newClient,
      };
    case "DELETE_TICKET":
      return {
        client: [
          ...state.client.filter(
            (w) => w._id !== action.payload._id
          ),
        ],
      };
    default:
      return state;
  }
};

export const ClientContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(ClientReducer, {
    client: null,
  });

  const {logout} = useLogout();


  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    const getClients = async () => {
      const response = await fetch("/client/getClientsInfo", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${user.token}`
        },
      });
      let jsonAns = await response.json();
      if (response.ok) {
        console.log(jsonAns)
        dispatch({ type: "SET_CLIENTS", payload: jsonAns });
      }
      else{
        localStorage.removeItem('user');
        logout()
      }
    };
    if(user)
    getClients();
  }, [dispatch]);

  return (
    <ClientContext.Provider value={{ ...state, dispatch }}>
      {children}
    </ClientContext.Provider>
  );
};

import { createContext, useReducer } from "react";
import { useEffect } from "react";
import useLogout from "../hooks/useLogout";
import { useUserContext } from "../hooks/useUserContext";

export const WalletContext = createContext();

export const WalletReducer = (state, action) => {
  switch (action.type) {
    case "SET_WALLET":
      return {
        wallet: action.payload,
      };
    case "ADD_TICKET":
      return {
        wallet: [action.payload, ...state.wallet],
      };
    case "UPDATE_WALLET":
      let newWallet = state.wallet
      console.log(state.wallet)
      newWallet[action.payload.bankName] = action.payload
      return {
        wallet: newWallet
      };
    case "DELETE_TICKET":
      return {
        wallet: [
          ...state.wallet.filter(
            (w) => w._id !== action.payload._id
          ),
        ],
      };
    default:
      return state;
  }
};

export const WalletContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(WalletReducer, {
    wallet: null,
  });

  const {logout} = useLogout();
  const {user} = useUserContext()

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    const getWallets = async () => {
      const response = await fetch("/wallet/getTransactionsGroupedByBank", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${user.token}`
        },
      });
      let jsonAns = await response.json();
      if (response.ok) {
        console.log(jsonAns)
        dispatch({ type: "SET_WALLET", payload: jsonAns });
      }
      else{
        localStorage.removeItem('user');
        logout()
      }
    };
    if(user)
    getWallets();
  }, [dispatch,user]);

  return (
    <WalletContext.Provider value={{ ...state, dispatch }}>
      {children}
    </WalletContext.Provider>
  );
};

import { AwaitForPaymentTicketsContext } from "../context/AwaitForPaymentTicketsContext";
import { useContext } from "react";

export const useAwaitForPaymentTicketsContext = () =>{
    const context = useContext(AwaitForPaymentTicketsContext)
    
    if(!context) {
        throw Error('useSocketContext must be used inside an SocketContextProvider')
      }
    return context
}
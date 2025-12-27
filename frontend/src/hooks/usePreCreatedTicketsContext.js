import { PreCreatedTicketsContext } from "../context/PreCreatedTicketsContext";
import { useContext } from "react";

export const usePreCreatedTicketsContext = () =>{
    const context = useContext(PreCreatedTicketsContext)
    
    if(!context) {
        throw Error('useSocketContext must be used inside an SocketContextProvider')
      }
    return context
}
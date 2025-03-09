import { FinishedTicketsContext } from "../context/FinishedTicketsContext";
import { useContext } from "react";

export const useFinishedTicketsContext = () =>{
    const context = useContext(FinishedTicketsContext)
    
    if(!context) {
        throw Error('useSocketContext must be used inside an SocketContextProvider')
      }
    return context
}
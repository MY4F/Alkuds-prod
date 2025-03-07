import { UnfinishedTicketsContext } from "../context/UnfinishedTicketsContext";
import { useContext } from "react";

export const useUnfinishedTicketsContext = () =>{
    const context = useContext(UnfinishedTicketsContext)
    
    if(!context) {
        throw Error('useSocketContext must be used inside an SocketContextProvider')
      }
    return context
}
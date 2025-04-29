import { NewTicketsContext } from "../context/NewTicketsContext";
import { useContext } from "react";

export const useNewTicketsContext = () =>{
    const context = useContext(NewTicketsContext)
    
    if(!context) {
        throw Error('useSocketContext must be used inside an SocketContextProvider')
      }
    return context
}
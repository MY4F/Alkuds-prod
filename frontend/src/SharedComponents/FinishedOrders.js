import { useEffect, useState } from "react";
import { useSocketContext } from "../hooks/useSocket";
import { useClientContext } from "../hooks/useClientContext";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import InOrders from "../SharedComponents/InOrders";
import { useFinishedTicketsContext } from "../hooks/useFinishedTicketsContext";
const FinishedOrders = () =>{
    const { socket } = useSocketContext();
    const { finishedTickets } = useFinishedTicketsContext();
    const [alignment, setAlignment] = useState('out');
  
    const handleChange = async(event, newAlignment) => {
      setAlignment(newAlignment);
      await socket.emit("send_message", {message:"Hello from the other side",room:"123"});
    };
    useEffect(() => {}, [socket, finishedTickets]);
  
    return (
      <div className="worker-container">
        <div className="type-filter">
          <ToggleButtonGroup
          color="primary"
          size="large"
          value={alignment}
          exclusive
          onChange={handleChange}
          aria-label="Platform"
        >
          <ToggleButton value="in">وارد</ToggleButton>
          <ToggleButton value="out">خارج</ToggleButton>
        </ToggleButtonGroup>
        </div>
        <div className="in-orders">
          <div className="orders-holder">
            {finishedTickets.inOrders && alignment ==="in" &&
            finishedTickets.inOrders.map((i, idx) => <InOrders isFinishedTicket={true} order={i} orderContextIdx={idx} />)}
            {finishedTickets.outOrders && alignment ==="out" &&
            finishedTickets.outOrders.map((i, idx) => <InOrders isFinishedTicket={true} order={i} orderContextIdx={idx} />)}
          </div>
        </div>
      </div>
    );
}

export default FinishedOrders
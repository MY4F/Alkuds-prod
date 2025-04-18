import { useEffect, useState } from "react";
import { useSocketContext } from "../hooks/useSocket";
import { useUnfinishedTicketsContext } from "../hooks/useUnfinishedTicketsContext";
import { useClientContext } from "../hooks/useClientContext";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import InOrders from "../SharedComponents/InOrders";
import { useAwaitForPaymentTicketsContext } from "../hooks/useAwaitForPaymentTicketsContext";

const WorkerMainPage = () => {
  const { socket } = useSocketContext();
  const { unfinishedTickets } = useUnfinishedTicketsContext();
  const { awaitForPaymentTickets } = useAwaitForPaymentTicketsContext
  const [alignment, setAlignment] = useState('out');

  const handleChange = async(event, newAlignment) => {
    setAlignment(newAlignment);
    await socket.emit("send_message", {message:"Hello from the other side",room:"123"});
  };
  
  useEffect(() => {}, [socket, unfinishedTickets, useAwaitForPaymentTicketsContext]);

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
          {unfinishedTickets.inOrders && alignment ==="in" &&
          unfinishedTickets.inOrders.map((i, idx) => <InOrders  isFinishedTicket={false} order={i} orderContextIdx={idx} />)}
          {unfinishedTickets.outOrders && alignment ==="out" &&
          unfinishedTickets.outOrders.map((i, idx) => <InOrders isFinishedTicket={false} order={i} orderContextIdx={idx} />)}
        </div>
      </div>
    </div>
  );
};

export default WorkerMainPage;

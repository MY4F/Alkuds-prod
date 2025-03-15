import React, { useEffect, useState } from "react";
import { useAwaitForPaymentTicketsContext } from "../../hooks/useAwaitForPaymentTicketsContext";
import { useFinishedTicketsContext } from "../../hooks/useFinishedTicketsContext";
import { useUnfinishedTicketsContext } from "../../hooks/useUnfinishedTicketsContext";
import { useParams } from "react-router-dom";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import OrdersViewHolder from "../../ModeratorPages/OrdersViewHolder";
const OrdersPage = () => {
  const [open, setOpen] = useState(false);
  const { category } = useParams();
  const { unfinishedTickets, dispatch : dispatchUnfinishedTickets} = useUnfinishedTicketsContext();
  const { finishedTickets, dispatch : dispatchFinishedTickets } = useFinishedTicketsContext();
  const { awaitForPaymentTickets, dispatch: dispatchAwaitForPaymentTickets } = useAwaitForPaymentTicketsContext();
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [alignment, setAlignment] = useState('out');
  useEffect(() => {
  }, [unfinishedTickets,finishedTickets,awaitForPaymentTickets,dispatchUnfinishedTickets,dispatchFinishedTickets,dispatchAwaitForPaymentTickets]);
  
  const handleChange = async(event, newAlignment) => {
    setAlignment(newAlignment);
    // await socket.emit("send_message", {message:"Hello from the other side",room:"123"});
  };

  let typeObj = { 
    "in":"inOrders",
    "out":"outOrders"
  }
  console.log(category)
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
          {
          category ==="progress-load" && unfinishedTickets[`${typeObj[alignment]}`] &&
          unfinishedTickets[`${typeObj[alignment]}`].map((i, idx) => <OrdersViewHolder isFinishedTicket={false}  order={i} />)
          }
          {
          category ==="progress-pay" && awaitForPaymentTickets[`${typeObj[alignment]}`] &&
          awaitForPaymentTickets[`${typeObj[alignment]}`].map((i, idx) => <OrdersViewHolder isFinishedTicket={true} order={i} />)
          }
          {
          category ==="done" && finishedTickets[`${typeObj[alignment]}`] &&
          finishedTickets[`${typeObj[alignment]}`].map((i, idx) => <OrdersViewHolder isFinishedTicket={true} order={i} />)
          }
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;

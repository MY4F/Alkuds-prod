import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TicketDetails from "./TicketDetails";
import { useClientContext } from "../hooks/useClientContext";
import { useUnfinishedTicketsContext } from "../hooks/useUnfinishedTicketsContext";
const InOrders = ({ order, orderContextIdx}) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { client } = useClientContext();
  const {unfinishedTickets, dispatch } = useUnfinishedTicketsContext();

  
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    height:"80vh",
    'overflow-y':"auto"
  };

  if (!client) {
    console.log("here")
    return <div>Loading...</div>; // Prevents rendering until data is available
  }

  return (
    <>
      <div className="order-container">
        <h2> {client[order.clientId].name} </h2>
        <p>
          توقيت الاوردر <br /> {order.date}
        </p>
        <Button onClick={handleOpen}>افتح الاوردر</Button>
        <Modal
          open={open}
          onClose={handleClose}
          style={{"overflow-y":"auto"}}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
              <TicketDetails orderContextIdx={orderContextIdx} order={order}/>
          </Box>
        </Modal>
      </div>
    </>
  );
};

export default InOrders;

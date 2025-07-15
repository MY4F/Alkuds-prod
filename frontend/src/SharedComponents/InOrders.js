import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TicketDetails from "./TicketDetails";
import { useClientContext } from "../hooks/useClientContext";
import { useUnfinishedTicketsContext } from "../hooks/useUnfinishedTicketsContext";
import { useEffect, useState } from "react";
const InOrders = ({ isFinishedTicket, order, orderContextIdx }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { client } = useClientContext();
  const { unfinishedTickets, dispatch } = useUnfinishedTicketsContext();

  useEffect(() => {}, [unfinishedTickets]);

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
    height: "80vh",
    "overflow-y": "auto",
  };

  if (!client) {
    console.log("here");
    return <div>Loading...</div>; // Prevents rendering until data is available
  }

  return (
    <>
      
      <button
        dir="rtl"
        onClick={handleOpen}
        className="mb-4 sm:items-center items-start gap-5  !text-start !border-[2px] !bg-white border-[#e4e5e6] hover:border-[greenyellow] cursor-pointer !flex sm:flex-row flex-col  !p-4 sm:!justify-between !rounded w-full"
      >
        <div>
          <h2> {client[order.clientId].name} </h2>
          <p className="text-[#6c6f75]">{order.date}</p>
        </div>
      </button>
      <Modal
        open={open}
        onClose={handleClose}
        style={{ "overflow-y": "auto" }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <TicketDetails
            isFinishedTicket={isFinishedTicket}
            orderContextIdx={orderContextIdx}
            order={order}
          />
        </Box>
      </Modal>
    </>
  );
};

export default InOrders;

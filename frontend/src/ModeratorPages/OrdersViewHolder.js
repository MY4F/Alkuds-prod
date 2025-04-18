import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { useClientContext } from "../hooks/useClientContext";
import OrderView from "../SharedComponents/OrderView";
import AddingPriceForm from "../components/AddingPriceForm";

const OrdersViewHolder = ({ order, isFinishedTicket, alignment }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [addingPrice, setAddingPrice] = useState(false);

  const { client } = useClientContext();
  useEffect(() => {}, []);

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
    return <div>Loading...</div>;
  }
  console.log("heeereee");
  console.log(order);

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
        <div className="flex gap-6">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setAddingPrice(true);
            }}
            className="sm:h-[32px] h-auto m-0 pb-1 px-3 rounded  hover:bg-dark-green !w-auto bg-[#00756a] text-white   "
          >
            اضافة عملية دفع
          </button>
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
          <OrderView
            name={client[order.clientId].name}
            order={order}
            isFinishedTicket={isFinishedTicket}
          />
        </Box>
      </Modal>
      <Modal
        className="popup-width"
        open={addingPrice}
        onClose={() => {
          setAddingPrice(false);
        }}
        style={{ "overflow-y": "auto", width: "auto" }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <AddingPriceForm order={order} alignment={alignment} />
        </Box>
      </Modal>
    </>
  );
};

export default OrdersViewHolder;

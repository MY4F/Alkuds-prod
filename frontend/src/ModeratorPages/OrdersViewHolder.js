import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { useClientContext } from "../hooks/useClientContext";
import OrderView from "../SharedComponents/OrderView";
import AddingPriceForm from "../components/AddingPriceForm";
import { useUserContext } from "../hooks/useUserContext";
import { useAwaitForPaymentTicketsContext } from "../hooks/useAwaitForPaymentTicketsContext";
import { useFinishedTicketsContext } from "../hooks/useFinishedTicketsContext";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
const OrdersViewHolder = ({ order, isFinishedTicket, alignment }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [addingPrice, setAddingPrice] = useState(false);
  const { user } = useUserContext()
  const { client, dispatch: clientDispatch } = useClientContext();
  const { dispatch } = useAwaitForPaymentTicketsContext()
  const { dispatch: dispatchFinishedOrders } = useFinishedTicketsContext()
  const [open2, setOpen2] = useState(false);
  const handleClickOpen2 = () => {
    setOpen2(true);
  };

  const handleCloseDialog2 = () => {
    setOpen2(false);
  };

  useEffect(() => {}, [dispatch, clientDispatch, dispatchFinishedOrders ]);

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

  const handleRevertOrder = async() =>{
    try{
      console.log(order)
      const response = await fetch("/order/revertOrder", {
        // Update port if different
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({order}),
      });

      if (!response.ok) throw new Error("Failed to add order");

      const result = await response.json();
      if(response.ok){
        console.log(result)
        dispatch({ type: "SET_TICKETS", payload: result.awaitOrders });
        dispatchFinishedOrders({ type: "SET_TICKETS", payload: result.finishedOrders })
        clientDispatch({ type: "SET_CLIENTS", payload: result.clients })
      }
    }
    catch(err){
      console.log(err)
    }
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
          <p className="text-[#6c6f75]">{order.state}</p>

        </div>
        <div className="flex gap-6">
        <Dialog
            open={open2}
            onClose={handleCloseDialog2}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"مرتجع"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                سيتم ارجاع الاورد، هل قمت بالضغط؟
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={(e)=>{handleCloseDialog2();handleClose();}}>الغاء</Button>
              <Button onClick={(e) =>{
                  handleClose();
                  handleRevertOrder();
                  handleCloseDialog2()
                }} autoFocus>
                موافق
              </Button>
            </DialogActions>
          </Dialog>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleClickOpen2();
          }}
          className="sm:h-[32px] h-auto m-0 pb-1 px-3 rounded  hover:bg-dark-green !w-auto bg-[#00756a] text-white   "
        >
          مرتجع
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
            handleClose={handleClose}
          />
        </Box>
      </Modal>
      {/* <Modal
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
      </Modal> */}
    </>
  );
};

export default OrdersViewHolder;

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
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import LoadingButton from "../SharedComponents/LoadingButton";
import { useUnfinishedTicketsContext } from "../hooks/useUnfinishedTicketsContext";

const OrdersViewHolder = ({ order, isFinishedTicket, alignment }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleClose3 = () => setOpen3(false);
  const [addingPrice, setAddingPrice] = useState(false);
  const { user } = useUserContext();
  const [adding, setAdding] = useState(false);
  const { client, dispatch: clientDispatch } = useClientContext();
  const { dispatch } = useAwaitForPaymentTicketsContext();
  const { dispatch: dispatchFinishedOrders } = useFinishedTicketsContext();
  const { dispatch: dispatchUnfinishedOrders } = useUnfinishedTicketsContext();
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [prices, setPrices] = useState(() =>
    Array.isArray(order?.ticket) ? new Array(order.ticket.length).fill(0) : []
  );

  const handleClickOpen2 = () => {
    setOpen2(true);
  };

  const handleClickOpen3 = () => {
    setOpen3(true);
  };

  const handleCloseDialog2 = () => {
    setOpen2(false);
  };

  useEffect(() => {}, [
    dispatch,
    clientDispatch,
    dispatchFinishedOrders,
    adding,
    dispatchUnfinishedOrders,
  ]);

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

  const style2 = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    "overflow-y": "auto",
  };

  if (!client) {
    console.log("here");
    return <div>Loading...</div>;
  }

  const handleRevertOrder = async () => {
    try {
      console.log(order);
      const response = await fetch("/order/revertOrder", {
        // Update port if different
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ order }),
      });

      if (!response.ok) throw new Error("Failed to add order");

      const result = await response.json();
      if (response.ok) {
        console.log(result);
        dispatch({ type: "SET_TICKETS", payload: result.awaitOrders });
        dispatchFinishedOrders({
          type: "SET_TICKETS",
          payload: result.finishedOrders,
        });
        clientDispatch({ type: "SET_CLIENTS", payload: result.clients });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handlePricingSubmit = async (e) => {
    e.preventDefault();
    try {
      setAdding(true)
      console.log(order);
      const response = await fetch("/order/setIronPrices", {
        // Update port if different
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ orderId: order._id, prices }),
      });

      if (!response.ok) throw new Error("Failed to set prices ");

      const result = await response.json();
      if (response.ok) {
        const profitsUpdates = await fetch(
          "/order/orderFinishStateFirstPrice",
          {
            // Update port if different
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify({ orderId: order._id }),
          }
        );

        if (!profitsUpdates.ok) throw new Error("Failed to set prices ");

        const profitResult = await profitsUpdates.json();
        
        if (profitsUpdates.ok) {
          dispatchUnfinishedOrders({ type: "DELETE_TICKET", payload: [profitResult.newUpdatedOrder] });
          clientDispatch({type:"UPDATE_CLIENT", payload: profitResult.balanceUpdate})
          console.log(profitResult)
          if(profitResult.newUpdatedOrder.state === "جاري انتظار الدفع"){
            dispatch({
              type: "ADD_TICKET",
              payload: [profitResult.newUpdatedOrder],
           });
          }
          else if (profitResult.newUpdatedOrder.state === "منتهي"){
            dispatchFinishedOrders({
              type: "ADD_TICKET",
              payload: [profitResult.newUpdatedOrder],
           });
          }
          setAdding(false)
        }
      }
    } catch (err) {
      console.log(err);
    }
    e.preventDefault();
    setAdding(true);
    console.log(prices);
    setAdding(false);
  };

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
            <DialogTitle id="alert-dialog-title">{"مرتجع"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                سيتم ارجاع الاورد، هل قمت بالضغط؟
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={(e) => {
                  handleCloseDialog2();
                  handleClose();
                }}
              >
                الغاء
              </Button>
              <Button
                onClick={(e) => {
                  handleClose();
                  handleRevertOrder();
                  handleCloseDialog2();
                }}
                autoFocus
              >
                موافق
              </Button>
            </DialogActions>
          </Dialog>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (order.state !== "جاري انتظار التسعيير") {
                handleClickOpen2();
              } else {
                handleClickOpen3();
              }
            }}
            className="sm:h-[32px] h-auto m-0 pb-1 px-3 rounded  hover:bg-dark-green !w-auto bg-[#00756a] text-white   "
          >
            {order.state !== "جاري انتظار التسعيير" ? "مرتجع" : "تسعيير"}
          </button>
        </div>
      </button>
      <Modal
        open={open3}
        onClose={handleClose3}
        style={{ "overflow-y": "auto" }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style2}>
          <form
            className="w-full flex flex-col items-center gap-5 justify-center"
            dir="rtl"
            onSubmit={(e) => handlePricingSubmit(e)}
          >
            {order.ticket.map((item, idx) => (
              <div className="md:w-[50%] w-full flex justify-center">
                <div className="flex flex-col gap-2 w-full max-w-[300px]">
                  <label htmlFor="weight"> اسم الحديد </label>
                  <p> {item.ironName} </p>
                </div>
                <div className="flex flex-col gap-2 w-full max-w-[300px] ">
                  <label htmlFor="weight"> القطر </label>
                  <p> {item.radius} </p>
                </div>
                <div className="flex flex-col gap-2 w-full max-w-[300px] ">
                  <label htmlFor="weight"> الوزن </label>
                  <p> {item.netWeight} </p>
                </div>
                <div className="flex flex-col gap-2 w-full max-w-[300px] ">
                  <label htmlFor="weight"> السعر </label>
                  <input
                    name="weight"
                    type="text"
                    value={prices[idx]}
                    onChange={(e) => {
                      const newPrices = [...prices];
                      newPrices[idx] = e.target.value;
                      setPrices(newPrices);
                    }}
                  />
                </div>
              </div>
            ))}
            <LoadingButton
              loading={adding}
              defaultText="حفظ التسعييره الجديده"
              loadingText="يتم الأضافة ..."
              className="custom-class"
            />
          </form>
        </Box>
      </Modal>
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

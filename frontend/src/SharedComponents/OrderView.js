import { useEffect, useState } from "react";
import Seperator from "../components/Seperator";
import { useUnfinishedTicketsContext } from "../hooks/useUnfinishedTicketsContext";
import ReceiptIcon from "@mui/icons-material/Receipt";
import { useSocketContext } from "../hooks/useSocket";
import swal from "sweetalert";
import LoadingButton from "./LoadingButton";
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import CircularProgress from "@mui/material/CircularProgress";
import { useUserContext } from "../hooks/useUserContext";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useFinishedTicketsContext } from "../hooks/useFinishedTicketsContext";
import { useClientContext } from "../hooks/useClientContext";
import { useAwaitForPaymentTicketsContext } from "../hooks/useAwaitForPaymentTicketsContext";
const OrderView = ({ order, isFinishedTicket, name, handleClose }) => {
  const [ticketsPrices, setTicketsPrices] = useState(
    order.ticket.map((ticket) => ticket.unitPrice)
  );
  const [orderTickets, setOrderTickets] = useState(order.ticket)
  const [deliveryFees, setDeliveryFees] = useState(order.deliveryFees)
  const [firstWeight, setFirstWeight] = useState(order.firstWeight.weight);
  const [firstTime, setFirstTime] = useState(0);
  const [firstDate, setFirstDate] = useState(0);
  const [weight, setWeight] = useState(0);
  const [time, setTime] = useState(0);
  const [date, setDate] = useState(0);
  const [netWeight, setNetWeight] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPrice, setIsLoadingPrice] = useState(false);
  const [isLoadingFees, setIsLoadingFees] = useState(false);
  const { unfinishedTickets, dispatch } = useUnfinishedTicketsContext();
  const { awaitForPaymentTickets, dispatch: awaitDispatch } = useAwaitForPaymentTicketsContext();
  const { socket } = useSocketContext();
  const [saveLoading, setSaveLoading] = useState(false);
  const [isManual, setIsManual] = useState(false)
  const {user} = useUserContext()
  const [openDialogIndex, setOpenDialogIndex] = useState(null);
  const { finishedTickets, dispatch:dispatchFinishedOrders } = useFinishedTicketsContext()
  const [open2, setOpen2] = useState(false);
  const { client , dispatch:clientDispatch} = useClientContext()

  const handleClickOpen2 = () => {
    setOpen2(true);
  };

  const handleCloseDialog2 = () => {
    setOpen2(false);
  };


  const handleClickOpen = (idx) => {
    setOpenDialogIndex(idx);
  };
  
  const handleCloseDialog = () => {
    setOpenDialogIndex(null);
  };

  useEffect(() => {
    // socket.on("receive_order_finish_state", (info) => {
    //   if (info.order === null) {
    //     if (info.message === "Purchase Bill Printed Successfully") {
    //       swal(info.message, "تم طباعه فاتوره المبيعات بنجاح .", "success");
    //     } else {
    //       swal(info.message, "تم طباعه اذن الاستلام بنجاح .", "success");
    //     }
    //   } else
    //     swal(
    //       info.message,
    //       "تم طباعه اذن الاستلام بنجاح و ايضا تغير حاله الاوردر لجاري انتظار الدفع.",
    //       "success"
    //     );
    // });
  }, [
    weight,
    time,
    date,
    netWeight,
    isLoading,
    firstWeight,
    firstDate,
    firstTime,
    socket,
    isManual,
    orderTickets,
    client,
    finishedTickets,
    awaitForPaymentTickets,
    awaitDispatch,
    clientDispatch,
    dispatchFinishedOrders
  ]);

  const updateTicket = async(newWeight,ticketId)=>{
    setIsLoading(true)
    let newTicket = order.ticket[ticketId], newOrder = order
    console.log(newWeight,ticketId,newTicket.weightBefore)
    if(ticketId > 0){
      newTicket.weightBefore = order.ticket[ticketId-1].weightAfter
      newTicket.weightAfter = newWeight
      newTicket.netWeight = Math.abs(newWeight - newTicket.weightBefore)
    }
    else{
      newTicket.weightBefore = order.firstWeight.weight
      newTicket.weightAfter = newWeight 
      console.log(order.firstWeight.weight,newWeight)
      newTicket.netWeight =  Math.abs(newWeight - order.firstWeight.weight)
    }
    newTicket.netWeightForProcessing = newTicket.netWeight 
    setNetWeight(newTicket.netWeight)

    let d = new Date().toLocaleString("en-EG", { timeZone: "Africa/Cairo" });
    let dateArr = d.split(",");
    newTicket.date = dateArr[0] + "," + dateArr[1]

    newOrder.ticket[ticketId] = newTicket

    setOrderTickets([...newOrder.ticket]);

    const ticketUpdateFetch = await fetch('/order/EditOrderTicket',{
      method:"POST",
      headers: {
        "Content-Type": "application/json",
          'Authorization': `Bearer ${user.token}`
      },
      body:JSON.stringify({orderId: order._id,ticket:newOrder.ticket,"ticketId":ticketId})
    })

    const ticketUpdate = await ticketUpdateFetch.json()

    if(ticketUpdateFetch.ok){
      console.log("Ticket Updated: ",ticketUpdate)
      setIsLoading(false)
    }

  }

  const updateTicketPrice = async(e,ticketId, newPrice)=>{
    e.preventDefault()
    setIsLoadingPrice(true)
    console.log(newPrice,ticketId,order._id," here new price ")
    const ticketUpdateFetch = await fetch('/order/EditOrderTicketPrice',{
      method:"POST",
      headers: {
        "Content-Type": "application/json",
          'Authorization': `Bearer ${user.token}`
      },
      body:JSON.stringify({orderId: order._id,idx: ticketId,newPrice:newPrice})
    })

    const ticketUpdate = await ticketUpdateFetch.json()

    if(ticketUpdateFetch.ok && ticketUpdate.message == "success"){
      console.log("Ticket Updated: ",ticketUpdate)
      awaitDispatch({ type: "SET_TICKETS", payload: ticketUpdate.awaitOrders });
      dispatchFinishedOrders({ type: "SET_TICKETS", payload: ticketUpdate.finishedOrders })
      clientDispatch({ type: "SET_CLIENTS", payload: ticketUpdate.clients })
      setIsLoadingPrice(false)
      swal ( "تم تحديث سعر العمليه بنجاح." ,  "تم تحديث البانات الماليه" ,  "success" )
    }else{
      swal ( "حدث عطل، الرجاء المحاوله مجددا  ." , "حاول مجددا بعد قليل." ,  "error" )
    }
  
  }
  



  const updateFirstWeight = async()=>{
    setIsLoading(true)
    const firstWeightUpdateFetch = await fetch('/order/EditOrderFirstWeight',{
      method:"POST",
      headers: {
        "Content-Type": "application/json",
          'Authorization': `Bearer ${user.token}`
      },
      body:JSON.stringify({orderId: order._id,firstWeight:firstWeight})
    })

    const firstWeightUpdate = await firstWeightUpdateFetch.json()
    console.log(firstWeightUpdateFetch)
    if(firstWeightUpdateFetch.ok){
      console.log("Ticket Updated: ",firstWeightUpdate)
      dispatch({ type: "SET_TICKETS", payload: {"outOrders":firstWeightUpdate.outOrders,"inOrders":firstWeightUpdate.inOrders} });
      setIsLoading(false)  
    }
  }

  const handleSubmit = async(e) => {
    e.preventDefault();

    // window.open(
    //   "http://localhost:3000/print/" +
    //     isFinishedTicket.toString() +
    //     "/" + 
    //     order._id,
    //   "_blank"  
    // );
    window.open("https://alkuds-cd6a685335ea.herokuapp.com/print/"+ isFinishedTicket.toString() + "/" + order._id,"_blank")
  };
 
  const handlePurchaseBill = (e) => {
    e.preventDefault();
    // window.open(
    //   "http://localhost:3000/print/purchasebill/" + order._id,
    //   "_blank"
    // );
    window.open("https://alkuds-cd6a685335ea.herokuapp.com/print/purchasebill/"+ order._id,"_blank")
    handleClose()
  };
  const handleCancelChangePrice = (e, idx) => {
    e.preventDefault();
    e.stopPropagation();
    const resetPrices = [...ticketsPrices];
    resetPrices[idx] = order.ticket[idx].unitPrice;
    setTicketsPrices(resetPrices);
  };

  const handleCancelChangeDeliveryFees = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDeliveryFees(order.deliveryFees)
  };
  useEffect(() => {}, []);
  const isAnyPriceChanged = ticketsPrices.some(
    (price, idx) => price !== order.ticket[idx].unitPrice
  );
  const handlSavechanges = async (e) => {
    setSaveLoading(true);
    e.stopPropagation();
    e.preventDefault();
    console.log(ticketsPrices);
    const newOrder = order.ticket.map((ticket, idx) => ({
      ...ticket,
      unitPrice: ticketsPrices[idx] ?? ticket.unitPrice,
    }));

    try {
      const response = await fetch("/order/orderIronPriceUpdate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ order: newOrder }),
      });

      if (!response.ok) {
        // throw new Error("Failed to add order");

      const result = await response.json();
      swal({
        text: "تم تغير التذكار بنجاح",
        icon: "success",
        buttons: "ok",
      }).then(()=>{setSaveLoading(false) ; dispatch(result)});}
    } catch (error) {
      swal({
        text: "حدث خطأ ما برجاء المحاولة مرة اخرى",
        icon: "error",
        buttons: "حاول مرة اخرى",
      }).then(setSaveLoading(false));
    }
  };


  const changeDeliveryFees = async(e) =>{
    console.log("here")
    e.preventDefault();
    setIsLoadingFees(true)
    try{
      const deliveryFeesFetch = await fetch('/order/changeDeliveryPrice',{
      method:"POST",
      headers: {
        "Content-Type": "application/json",
          'Authorization': `Bearer ${user.token}`
      },
      body:JSON.stringify({orderId: order._id,newDeliveryFees:deliveryFees})
    })
     const deliveryFeesOrder = await deliveryFeesFetch.json()
     if(deliveryFeesFetch.ok){
      if(deliveryFeesOrder["order"].state === 'جاري انتظار التحميل'){
        dispatch({type:"UPDATE_TICKET",payload: [deliveryFeesOrder["order"]]})
      }
      else if(deliveryFeesOrder["order"].state === 'جاري انتظار الدفع'){
        awaitDispatch({type:"UPDATE_TICKET",payload: [deliveryFeesOrder["order"]]})

      }
     }
     swal({
        text: "تم تغير التذكار بنجاح",
        icon: "success",
        buttons: "ok",
      }).then(()=>{setIsLoadingFees(false)})
    }
    catch(err){
      console.log(err)
    }
  }

  return (
    <div>
      <Seperator text={`"${name}" تفاصيل طلب`} />
      <form className="w-full px-4 pt-6" onSubmit={(e) => handleSubmit(e)}>
        <div className="w-full flex md:flex-row flex-col gap-5 pb-6">
          <Dialog
            open={open2}
            onClose={handleCloseDialog2}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"تحميل الوزن"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                سيتم تحديث الوزن، هل قمت الضغط؟
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog2}>الغاء</Button>
              <Button onClick={(e) =>{
                  updateFirstWeight()
                  handleCloseDialog2()
                }} autoFocus>
                موافق
              </Button>
            </DialogActions>
          </Dialog>
        { isManual && 
              <div className="md:w-[50%] w-full flex justify-center items-end">
                <div className="flex flex-col gap-2 ">
                  <span onClick={handleClickOpen2}  className="iron-btn "> {isLoading ? <CircularProgress /> : " تحميل الوزن"}{" "} </span>
                </div>
            </div>}
          <div className="md:w-[50%] w-full flex justify-center">
            <div className="flex flex-col gap-2 ">
              <label htmlFor="date"> التاريخ </label>
              <input
                name="date"
                type="text"
                value={
                  order.firstWeight.date
                    ? order.firstWeight.date.split(",")[0]
                    : order.firstWeight.date
                }
                readOnly
              />
            </div>
          </div>
          <div className="md:w-[50%] w-full flex justify-center">
            <div className="flex flex-col gap-2 ">
              <label htmlFor="time"> التوقت </label>
              <input
                name="time"
                type="text"
                value={
                  order.firstWeight.date
                    ? order.firstWeight.date.split(",")[1]
                    : order.firstWeight.date
                }
                readOnly
              />
            </div>
          </div>
          <div className="md:w-[50%] w-full flex justify-center">
            <div className="flex flex-col gap-2 ">
              <label>الوزنه الاولي</label>
              <input
                name="weight"
                type="text"
                value={isManual? firstWeight : order.firstWeight.weight}
                onChange={e=> setFirstWeight(e.target.value)}
                readOnly = {!isManual}
              />
            </div>
          </div>
        </div>
        <div className=" w-full flex justify-center">
                <div className="flex flex-col gap-2 w-full max-w-[300px]">
                  <label className="text-center">المشال</label>
                  <div className="flex flex-col space-y-3">
                    <input
                      type="number"
                      placeholder="المشال"
                      pattern="^[1-9][0-9]*$"
                      value={deliveryFees}
                      onChange={(e) => {
                        setDeliveryFees(e.target.value)
                      }}
                    />
                    {order.deliveryFees !== deliveryFees && (
                      <button
                        onClick={(e) => handleCancelChangeDeliveryFees(e)}
                        className="iron-btn remove w-[100px]"
                      >
                        إلغاء
                      </button>
                    )}
                   {order.state !=="جاري انتظار التسعيير" && <LoadingButton
                      onClick={(e) => {
                        changeDeliveryFees(e);
                      }}
                      defaultText="تغيير المشال"
                      loadingText="يتم تغيير المشال ..."
                      className="print-submit w-[300px]"
                      loading={isLoadingFees}
                    />}
                  </div>
                </div>
              </div>
       { user.user.msg.name === "Ziad" && <div style={{textAlign:"right"}}>
          <FormControlLabel control={<Switch onChange={e=> setIsManual(!isManual)} defaultChecked />} label={ isManual? 'يدوي':"اتوماتيكي" } />
        </div>}
        {orderTickets.map((i, idx) => (
          <>
            <Seperator text={idx + 1 + " تذكره رقم "} />
            <div className="w-full flex md:flex-row flex-col gap-5 pb-6">
              <div className="md:w-[50%] w-full flex justify-center">
                <div className="flex flex-col gap-2 ">
                  <label className="text-center"> نوع الحديد</label>
                  <p className="text-center">{i.ironName}</p>
                </div>
              </div>
              <div className="md:w-[50%] w-full flex justify-center">
                <div className="flex flex-col gap-2 ">
                  <label className="text-center">الوزن المطلوب</label>
                  <p className="text-center">{i.neededWeight}</p>
                </div>
              </div>
              <div className="md:w-[50%] w-full flex justify-center">
                <div className="flex flex-col gap-2">
                  <label className="text-center">قطر الحديد</label>
                  <p className="text-center">{i.radius}</p>
                </div>
              </div>
            </div>
            <div className="w-full flex md:flex-row flex-col gap-5 pb-6">
              <div className="md:w-[50%] w-full flex justify-center">
                <div className="flex flex-col gap-2 ">
                  <label htmlFor="date"> التاريخ </label>
                  <input
                    name="date"
                    type="text"
                    value={
                      orderTickets[idx].date
                        ? orderTickets[idx].date.split(",")[0]
                        : orderTickets[idx].date
                    }
                    readOnly
                  />
                </div>
              </div>
              <div className="md:w-[50%] w-full flex justify-center">
                <div className="flex flex-col gap-2 ">
                  <label htmlFor="time"> التوقت </label>
                  <input
                    name="time"
                    type="text"
                    value={
                      orderTickets[idx].date
                        ? orderTickets[idx].date.split(",")[1]
                        : orderTickets[idx].date
                    }
                    readOnly
                  />
                </div>
              </div>
              <div className="md:w-[50%] w-full flex justify-center">
                <div className="flex flex-col gap-2 ">
                  <label>الوزنه بعد التحميل</label>
                  <input
                    name="weight"
                    type="text"
                    value={orderTickets[idx].weightAfter}
                    onChange={(e) => {
                      const updatedTickets = [...orderTickets];
                      updatedTickets[idx].weightAfter = e.target.value;
                      setOrderTickets(updatedTickets);
                    }}
                    readOnly={!isManual}
                  />
                </div>
              </div>
            </div>
            <div className="w-full flex md:flex-row flex-col gap-5 pb-6">
              <div className="md:w-[50%] w-full flex justify-center">
                <div className="flex flex-col gap-2 ">
                  <label htmlFor="weight"> صافي الوزن </label>
                  <input
                    name="weight"
                    type="text"
                    value={orderTickets[idx].netWeight}
                    readOnly
                  />
                </div>
              </div>
              <div className="md:w-[50%] w-full flex justify-center">
                <div className="flex flex-col gap-2 w-full max-w-[300px]">
                  <label className="text-center">السعر</label>
                  <div className="flex flex-col space-y-3">
                    <input
                      type="number"
                      placeholder="السعر"
                      pattern="^[1-9][0-9]*$"
                      value={ticketsPrices[idx]}
                      onChange={(e) => {
                        const newPrices = [...ticketsPrices];
                        newPrices[idx] = Number(e.target.value);
                        setTicketsPrices(newPrices);
                      }}
                    />
                    {ticketsPrices[idx] !== orderTickets[idx].unitPrice && (
                      <button
                        onClick={(e) => handleCancelChangePrice(e, idx)}
                        className="iron-btn remove w-[100px]"
                      >
                        إلغاء
                      </button>
                    )}
                   {order.state !=="جاري انتظار التسعيير" &&  <LoadingButton
                      onClick={(e) => {
                        e.stopPropagation();
                        updateTicketPrice(e,idx,ticketsPrices[idx]);
                      }}
                      defaultText="تغيير السعر"
                      loadingText="يتم تغيير السعر ..."
                      className="print-submit w-[300px]"
                      loading={isLoadingPrice}
                    />}
                  </div>
                </div>
              </div>
            </div>
            { isManual && <div className="w-full flex md:flex-row flex-col gap-5 pb-6">
              <div className="md:w-[100%] w-full flex justify-center">
                <div className="flex flex-col gap-2 ">
                  <Dialog
                    open={openDialogIndex === idx}
                    onClose={handleCloseDialog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                  >
                    <DialogTitle id="alert-dialog-title">
                      {"تحميل الوزن"}
                    </DialogTitle>
                    <DialogContent>
                      <DialogContentText id="alert-dialog-description">
                        سيتم تحديث الوزن، هل قمت الضغط؟
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleCloseDialog}>الغاء</Button>
                      <Button onClick={(e) =>{
                        console.log(idx)
                        updateTicket(orderTickets[openDialogIndex].weightAfter, openDialogIndex);
                          handleCloseDialog()
                        }} autoFocus>
                        موافق
                      </Button>
                    </DialogActions>
                  </Dialog>
                  <span onClick={() => handleClickOpen(idx)}  className="iron-btn "> {isLoading ? <CircularProgress /> : " تحميل الوزن"}{" "} </span>
                </div>
              </div>
            </div>}
          </>
        ))}
        <div className="w-full flex justify-center">
          {isAnyPriceChanged && (
            <LoadingButton
              // onClick={(e) => {
              //   setSaveLoading(true);
              //   e.stopPropagation();
              //   e.preventDefault();
              //   console.log(ticketsPrices);
              // }}
              onClick={(e) => handlSavechanges(e)}
              defaultText="حفظ التغيرات"
              loadingText="يتم الحفظ ..."
              className="print-submit w-[300px]"
              loading={saveLoading}
            />
          )}
        </div>
       {order.state !=="جاري انتظار التسعيير" &&  <button type="submit" className="print-submit">
          {" "}
          انشاء اذن استلام <ReceiptIcon />{" "}
        </button>}
        {order.state !=="جاري انتظار التسعيير" && <button onClick={(e) => handlePurchaseBill(e)} className="print-submit">
          {" "}
          انشاء فاتوره مبيعات <ReceiptIcon />{" "}
        </button>}
      </form>
    </div>
  );
};

export default OrderView;

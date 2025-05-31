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

const OrderView = ({ order, isFinishedTicket, name, handleClose }) => {
  const [ticketsPrices, setTicketsPrices] = useState(
    order.ticket.map((ticket) => ticket.unitPrice)
  );
  const [orderTickets, setOrderTickets] = useState(order.ticket)
  const [firstWeight, setFirstWeight] = useState(0);
  const [firstTime, setFirstTime] = useState(0);
  const [firstDate, setFirstDate] = useState(0);
  const [weight, setWeight] = useState(0);
  const [time, setTime] = useState(0);
  const [date, setDate] = useState(0);
  const [netWeight, setNetWeight] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { unfinishedTickets, dispatch } = useUnfinishedTicketsContext();
  const { socket } = useSocketContext();
  const [saveLoading, setSaveLoading] = useState(false);
  const [isManual, setIsManual] = useState(false)
  const {user} = useUserContext()
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
    isManual
  ]);

  const updateTicket = async(newWeight,ticketId)=>{
    setIsLoading(true)
    console.log(newWeight)
    let newTicket = order.ticket[ticketId], newOrder = order
    if(ticketId > 0){
      newTicket.weightBefore = order.ticket[ticketId-1].weightAfter
      newTicket.weightAfter = newWeight
      newTicket.netWeight = Math.abs(newWeight - newTicket.weightBefore)
    }
    else{
      newTicket.weightBefore = order.firstWeight.weight
      newTicket.weightAfter = newWeight 
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
      body:JSON.stringify({orderId: order._id,ticket:newOrder.ticket})
    })

    const ticketUpdate = await ticketUpdateFetch.json()

    if(ticketUpdateFetch.ok){
      console.log("Ticket Updated: ",ticketUpdate)
    setIsLoading(false)
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
    window.open("https://alkuds-cd6a685335ea.herokuapp.com/print/"+isFinishedTicket.toString() +"/"+ order._id,"_blank")
  };

  const handlePurchaseBill = (e) => {
    e.preventDefault();
    // window.open(
    //   "http://localhost:3000/print/purchasebill/" + order._id,
    //   "_blank"
    // );
    window.open("https://alkuds-cd6a685335ea.herokuapp.com/print/"+ order._id,"_blank")
    handleClose()
  };
  const handleCancelChangePrice = (e, idx) => {
    e.preventDefault();
    e.stopPropagation();
    const resetPrices = [...ticketsPrices];
    resetPrices[idx] = order.ticket[idx].unitPrice;
    setTicketsPrices(resetPrices);
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


  return (
    <div>
      <Seperator text={`"${name}" تفاصيل طلب`} />
      <form className="w-full px-4 pt-6" onSubmit={(e) => handleSubmit(e)}>
        <div className="w-full flex md:flex-row flex-col gap-5 pb-6">
        { isManual && 
              <div className="md:w-[50%] w-full flex justify-center items-end">
                <div className="flex flex-col gap-2 ">
                  <span onClick={e=>updateFirstWeight()}  className="iron-btn "> {isLoading ? <CircularProgress /> : " تحميل الوزن"}{" "} </span>
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
        <div style={{textAlign:"right"}}>
          <FormControlLabel control={<Switch onChange={e=> setIsManual(!isManual)} defaultChecked />} label={ isManual? 'يدوي':"اتوماتيكي" } />
        </div>
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
                      type="text"
                      placeholder="السعر"
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
                  </div>
                </div>
              </div>
            </div>
            { isManual && <div className="w-full flex md:flex-row flex-col gap-5 pb-6">
              <div className="md:w-[100%] w-full flex justify-center">
                <div className="flex flex-col gap-2 ">
                  <span onClick={e=>updateTicket(orderTickets[idx].weightAfter, idx)}  className="iron-btn "> {isLoading ? <CircularProgress /> : " تحميل الوزن"}{" "} </span>
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
        <button type="submit" className="print-submit">
          {" "}
          انشاء اذن استلام <ReceiptIcon />{" "}
        </button>
        <button onClick={(e) => handlePurchaseBill(e)} className="print-submit">
          {" "}
          انشاء فاتوره مبيعات <ReceiptIcon />{" "}
        </button>
      </form>
    </div>
  );
};

export default OrderView;

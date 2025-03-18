import { useEffect, useState } from "react";
import Seperator from "../components/Seperator";
import CircularProgress from "@mui/material/CircularProgress";
import { useUnfinishedTicketsContext } from "../hooks/useUnfinishedTicketsContext";
import { Button } from "@mui/material";
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { useSocketContext } from "../hooks/useSocket";
import swal from 'sweetalert';
const OrderView = ({ order, isFinishedTicket }) => {
  const [firstWeight, setFirstWeight] = useState(0)
  const [firstTime, setFirstTime] = useState(0);
  const [firstDate, setFirstDate] = useState(0);
  const [weight, setWeight] = useState(0);
  const [time, setTime] = useState(0);
  const [date, setDate] = useState(0);
  const [netWeight, setNetWeight] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { unfinishedTickets, dispatch } = useUnfinishedTicketsContext();
  const { socket } = useSocketContext();
  useEffect(() => {
    socket.on("receive_order_finish_state", (info) => {
      if(info.order === null){
        if(info.message === "Purchase Bill Printed Successfully"){
          swal ( info.message ,  "تم طباعه فاتوره المبيعات بنجاح ." ,  "success" )
        }
        else{
          swal ( info.message ,  "تم طباعه اذن الاستلام بنجاح ." ,  "success" )
        }
      }
      else
        swal ( info.message ,  "تم طباعه اذن الاستلام بنجاح و ايضا تغير حاله الاوردر لجاري انتظار الدفع." ,  "success" )
  });
  }, [weight, time, date, netWeight, isLoading,firstWeight,firstDate,firstTime,socket]);

  const handleSubmit = (e) =>{
    e.preventDefault()
    // window.open("http://localhost:3000/print/"+ isFinishedTicket.toString() + "/" + order._id,"_blank")
    window.open("https://alkuds-cd6a685335ea.herokuapp.com/print/"+ isFinishedTicket.toString() + "/" + order._id,"_blank")
  }

  const handlePurchaseBill = (e) =>{
    e.preventDefault()
    // window.open("http://localhost:3000/print/purchasebill/" + order._id,"_blank")
    window.open("https://alkuds-cd6a685335ea.herokuapp.com/print/purchasebill/"+ order._id,"_blank")
  }
 
  return (
    <div>
      <form className="w-full px-4 pt-6"onSubmit={e=>handleSubmit(e)}>
        <div className="w-full flex md:flex-row flex-col gap-5 pb-6">
          <div className="md:w-[50%] w-full flex justify-center">
            <div className="flex flex-col gap-2 ">
              <label htmlFor="date"> التاريخ </label>
              <input name="date" type="text" value={order.firstWeight.date ? order.firstWeight.date.split(',')[0]: order.firstWeight.date} readOnly />
            </div>
          </div>
          <div className="md:w-[50%] w-full flex justify-center">
            <div className="flex flex-col gap-2 ">
              <label htmlFor="time"> التوقت </label>
              <input name="time" type="text" value={order.firstWeight.date ? order.firstWeight.date.split(',')[1]: order.firstWeight.date} readOnly />
            </div>
          </div>
          <div className="md:w-[50%] w-full flex justify-center">
            <div className="flex flex-col gap-2 ">
              <label>الوزنه الاولي</label>
              <input name="weight" type="text" value={order.firstWeight.weight} readOnly />
            </div>
          </div>
        </div>
        {order.ticket.map((i, idx) => (
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
                  <input name="date" type="text" value={order.ticket[idx].date? order.ticket[idx].date.split(',')[0]:order.ticket[idx].date} readOnly />
                </div>
              </div>
              <div className="md:w-[50%] w-full flex justify-center">
                <div className="flex flex-col gap-2 ">
                  <label htmlFor="time"> التوقت </label>
                  <input name="time" type="text" value={order.ticket[idx].date? order.ticket[idx].date.split(',')[1]:order.ticket[idx].date} readOnly />
                </div>
              </div>
              <div className="md:w-[50%] w-full flex justify-center">
                <div className="flex flex-col gap-2 ">
                  <label>الوزنه بعد التحميل</label>
                  <input name="weight" type="text" value={order.ticket[idx].weightAfter} readOnly/>
                </div>
              </div>
            </div>
            <div className="w-full flex md:flex-row flex-col gap-5 pb-6">
              <div className="md:w-[50%] w-full flex justify-center">
                <div className="flex flex-col gap-2 ">
                  <label htmlFor="weight"> صافي الوزن </label>
                  <input name="weight" type="text" value={order.ticket[idx].netWeight} readOnly />
                </div>
              </div>
              <div className="md:w-[50%] w-full flex justify-center">
                <div className="flex flex-col gap-2 w-full max-w-[300px]">
                  <label className="text-center">السعر</label>
                  <input
                    readOnly
                    type="text"
                    placeholder=" السعر"
                    value={order.ticket[idx].unitPrice}
                    // onChange={(e) => {
                    //   const updatedTickets = [...tickets];
                    //   updatedTickets[index].totalPrice = e.target.value;
                    //   setTickets(updatedTickets);
                    // }}
                  />
                </div>
              </div>
            </div>
            
            
          </>
        ))}
        <button type="submit" className="print-submit"> انشاء اذن استلام <ReceiptIcon/> </button>
        <button onClick={e => handlePurchaseBill(e)} className="print-submit"> انشاء فاتوره مبيعات <ReceiptIcon/> </button>
      </form>
    </div>
  );
};

export default OrderView;

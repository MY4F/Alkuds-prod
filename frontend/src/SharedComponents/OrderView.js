import { useEffect, useState } from "react";
import Seperator from "../components/Seperator";
import { useUnfinishedTicketsContext } from "../hooks/useUnfinishedTicketsContext";
import ReceiptIcon from "@mui/icons-material/Receipt";
import { useSocketContext } from "../hooks/useSocket";
import swal from "sweetalert";
import LoadingButton from "./LoadingButton";
const OrderView = ({ order, isFinishedTicket, name }) => {
  const [ticketsPrices, setTicketsPrices] = useState(
    order.ticket.map((ticket) => ticket.unitPrice)
  );
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
  useEffect(() => {
    socket.on("receive_order_finish_state", (info) => {
      if (info.order === null) {
        if (info.message === "Purchase Bill Printed Successfully") {
          swal(info.message, "تم طباعه فاتوره المبيعات بنجاح .", "success");
        } else {
          swal(info.message, "تم طباعه اذن الاستلام بنجاح .", "success");
        }
      } else
        swal(
          info.message,
          "تم طباعه اذن الاستلام بنجاح و ايضا تغير حاله الاوردر لجاري انتظار الدفع.",
          "success"
        );
    });
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
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // window.open(
    //   "http://localhost:3000/print/" +
    //     isFinishedTicket.toString() +
    //     "/" +
    //     order._id,
    //   "_blank"
    // );
    window.open("https://alkuds-cd6a685335ea.herokuapp.com/print/"+  isFinishedTicket.toString() + "/" + order._id,"_blank")
  };

  const handlePurchaseBill = (e) => {
    e.preventDefault();
    // window.open(
    //   "http://localhost:3000/print/purchasebill/" + order._id,
    //   "_blank"
    // );
    window.open("https://alkuds-cd6a685335ea.herokuapp.com/print/"+ order._id,"_blank")
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
                value={order.firstWeight.weight}
                readOnly
              />
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
                  <input
                    name="date"
                    type="text"
                    value={
                      order.ticket[idx].date
                        ? order.ticket[idx].date.split(",")[0]
                        : order.ticket[idx].date
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
                      order.ticket[idx].date
                        ? order.ticket[idx].date.split(",")[1]
                        : order.ticket[idx].date
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
                    value={order.ticket[idx].weightAfter}
                    readOnly
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
                    value={order.ticket[idx].netWeight}
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
                    {ticketsPrices[idx] !== order.ticket[idx].unitPrice && (
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

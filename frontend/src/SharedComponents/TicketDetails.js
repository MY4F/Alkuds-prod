import { useEffect, useRef, useState } from "react";
import Seperator from "../components/Seperator";
import { confirmAlert } from "react-confirm-alert";
import CircularProgress from "@mui/material/CircularProgress";
import { useUnfinishedTicketsContext } from "../hooks/useUnfinishedTicketsContext";
import ReceiptIcon from "@mui/icons-material/Receipt";
import { useSocketContext } from "../hooks/useSocket";
import swal from "sweetalert";
import { useAwaitForPaymentTicketsContext } from "../hooks/useAwaitForPaymentTicketsContext";
import { useUserContext } from "../hooks/useUserContext";
import "react-confirm-alert/src/react-confirm-alert.css";

const TicketDetails = ({ order, orderContextIdx, isFinishedTicket }) => {
  const [firstWeight, setFirstWeight] = useState(0);
  const [firstTime, setFirstTime] = useState(0);
  const [firstDate, setFirstDate] = useState(0);
  const [weight, setWeight] = useState(0);
  const [time, setTime] = useState(0);
  const [date, setDate] = useState(0);
  const [netWeight, setNetWeight] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { unfinishedTickets, dispatch } = useUnfinishedTicketsContext();
  const {
    awaitForPaymentTicketsContext,
    dispatch: awaitForPaymentTicketsContextUpdate,
  } = useAwaitForPaymentTicketsContext();
  const { socket } = useSocketContext();
  const { user } = useUserContext();
  const toast = useRef(null);
  useEffect(() => {
    socket.on("receive_order_new_state", async (info) => {
      console.log(info);
      if (info.order === null) {
        swal(info.message, "تم طباعه اذن الاستلام بنجاح .", "success");
      } else {
        swal(
          info.message,
          "تم طباعه اذن الاستلام بنجاح و ايضا تغير حاله الاوردر لجاري انتظار الدفع.",
          "success"
        );
      }
      if (!isFinishedTicket) {
        console.log("here", info.order);
        dispatch({ type: "DELETE_TICKET", payload: [info.order] });
        awaitForPaymentTicketsContextUpdate({
          type: "ADD_TICKET",
          payload: [info.order],
        });
      }
    });
  }, [
    unfinishedTickets,
    awaitForPaymentTicketsContext,
    awaitForPaymentTicketsContextUpdate,
    dispatch,
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
    window.open("https://alkuds-cd6a685335ea.herokuapp.com/print/"+ isFinishedTicket.toString() + "/" + order._id,"_blank")
  };

  const updateFirstWeight = async (weight) => {
    const firstWeightUpdateFetch = await fetch("order/EditOrderFirstWeight", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({ orderId: order._id, firstWeight: weight }),
    });

    const firstWeightUpdate = await firstWeightUpdateFetch.json();

    if (firstWeightUpdateFetch.ok) {
      console.log("Ticket Updated: ", firstWeightUpdate);
      dispatch({
        type: "SET_TICKETS",
        payload: {
          outOrders: firstWeightUpdate.outOrders,
          inOrders: firstWeightUpdate.inOrders,
        },
      });
    }
  };

  const updateTicket = async (newWeight, ticketId) => {
    console.log(ticketId);
    let newTicket = order.ticket[ticketId],
      newOrder = order;
    if (ticketId > 0) {
      newTicket.weightBefore = order.ticket[ticketId - 1].weightAfter;
      newTicket.weightAfter = newWeight;
      newTicket.netWeight = Math.abs(newWeight - newTicket.weightBefore);
    } else {
      newTicket.weightBefore = order.firstWeight.weight;
      newTicket.weightAfter = newWeight;
      newTicket.netWeight = Math.abs(newWeight - order.firstWeight.weight);
    }
    newTicket.netWeightForProcessing = newTicket.netWeight;
    setNetWeight(newTicket.netWeight);

    let d = new Date().toLocaleString("en-EG", { timeZone: "Africa/Cairo" });
    let dateArr = d.split(",");
    newTicket.date = dateArr[0] + "," + dateArr[1];

    newOrder.ticket[ticketId] = newTicket;

    const ticketUpdateFetch = await fetch("order/EditOrderTicket", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        orderId: order._id,
        ticket: newOrder.ticket,
        ticketId: ticketId,
      }),
    });

    const ticketUpdate = await ticketUpdateFetch.json();
    if (ticketUpdateFetch.ok) {
      console.log("Ticket Updated: ", ticketUpdate);
    } else if (
      ticketUpdateFetch.status === 400 &&
      ticketUpdate.error === "Not enough data of that iron available"
    ) {
      swal(
        `لا يوجد ما يكفي من الوزن لهذا الحديد لتغطية الوزن المطلوب.\nالوزن المتاح هو ${ticketUpdate.availableWeight} كجم.`,
        "",
        "error"
      );
    }
  };

  function confirmAsync() {
    return new Promise((resolve) => {
      confirmAlert({
        title: "هل تريد اعاده الوزنه مره اخري؟",
        message: "",
        buttons: [
          {
            label: "نعم",
            onClick: () => resolve(true),
          },
          {
            label: "لا",
            onClick: () => resolve(false),
          },
        ],
      });
    });
  }

  const handleGetFirstWeight = async (e, weight) => {
    let isYes = false;
    e.preventDefault();
    console.log("hehe", weight);
    if (weight > 0) {
      const isYes = await confirmAsync();
      if (!isYes) {
        console.log("User cancelled");
        return;
      }
    }

    setIsLoading(true);
    const weightFetch = await fetch("/irons/getScaleWeight", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });

    const weightJson = await weightFetch.json();
    if (weightFetch.ok) {
      let d = new Date().toLocaleString("en-EG", { timeZone: "Africa/Cairo" });
      let dateArr = d.split(",");
      setFirstWeight(weightJson.weight);
      setFirstDate(dateArr[0]);
      setFirstTime(dateArr[1]);
    }
    await updateFirstWeight(weightJson.weight);
    setIsLoading(false);
  };

  const handleGetWeight = async (e, idx, weight) => {
    e.preventDefault();
    if (weight > 0) {
      const isYes = await confirmAsync();
      if (!isYes) {
        console.log("User cancelled");
        return;
      }
    }

    setIsLoading(true);
    const weightFetch = await fetch("/irons/getScaleWeight", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });

    const weightJson = await weightFetch.json();

    if (weightFetch.ok) {
      let d = new Date().toLocaleString("en-EG", { timeZone: "Africa/Cairo" });
      let dateArr = d.split(",");
      setWeight(weightJson.weight);
      setDate(dateArr[0]);
      setTime(dateArr[1]);
    }

    await updateTicket(weightJson.weight, idx);
    setIsLoading(false);
  };

  return (
    <div>
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
                value={
                  firstWeight != 0 ? firstWeight : order.firstWeight.weight
                }
              />
            </div>
          </div>
          <div className="md:w-[50%] w-full flex justify-center">
            <div className="flex flex-col gap-2 justify-end">
              <button
                onClick={(e) =>
                  !isLoading &&
                  handleGetFirstWeight(e, order.firstWeight.weight)
                }
                className="iron-btn"
              >
                {isLoading ? <CircularProgress /> : " تحميل الوزن"}{" "}
              </button>
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
                <div className="flex flex-col gap-2 justify-end">
                  <button
                    onClick={(e) =>
                      !isLoading &&
                      handleGetWeight(e, idx, order.ticket[idx].weightAfter)
                    }
                    className="iron-btn"
                  >
                    {isLoading ? <CircularProgress /> : " تحميل الوزن"}{" "}
                  </button>
                </div>
              </div>
            </div>
          </>
        ))}
        <button type="submit" className=" print-submit">
          {" "}
          انشاء اذن استلام <ReceiptIcon />{" "}
        </button>
      </form>
    </div>
  );
};

export default TicketDetails;

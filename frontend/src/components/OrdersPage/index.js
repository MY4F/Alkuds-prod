import React, { useEffect, useState } from "react";
import { useAwaitForPaymentTicketsContext } from "../../hooks/useAwaitForPaymentTicketsContext";
import { useFinishedTicketsContext } from "../../hooks/useFinishedTicketsContext";
import { useUnfinishedTicketsContext } from "../../hooks/useUnfinishedTicketsContext";
import { useParams } from "react-router-dom";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import OrdersViewHolder from "../../ModeratorPages/OrdersViewHolder";
import Seperator from "../Seperator";
import { useNewTicketsContext } from "../../hooks/userNewTicketsContext";
const OrdersPage = () => { 
  const { category } = useParams();
  const [alignment, setAlignment] = useState("out");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dateSearchApplied, setDateSearchApplied] = useState(false);
  const [filteredDates, setFilteredDates] = useState([]);
  const [loadRange, setLoadRange] = useState(9);
  const [noMoreLoad, setNoMoreLoad] = useState(false);
  const { unfinishedTickets} = useUnfinishedTicketsContext();
  const { finishedTickets} = useFinishedTicketsContext();
  const { awaitForPaymentTickets} = useAwaitForPaymentTicketsContext();
  const { newTickets } = useNewTicketsContext();
  useEffect(() => {}, [
    unfinishedTickets,
    finishedTickets,
    awaitForPaymentTickets,
    newTickets
  ]);

  const handleChange = async (event, newAlignment) => {
    setAlignment(newAlignment);
    // await socket.emit("send_message", {message:"Hello from the other side",room:"123"});
  };

  let typeObj = {
    in: "inOrders",
    out: "outOrders",
  };
  const handleDateFilters = (e) => {
    e.preventDefault();
    setFilteredDates([startDate, endDate]);
    setDateSearchApplied(true);
  };
  const assignList = () => {
    if (category === "progress-load" && unfinishedTickets[typeObj[alignment]]) {
      return [...unfinishedTickets[typeObj[alignment]]];
    } else if (
      category === "progress-pay" &&
      awaitForPaymentTickets[`${typeObj[alignment]}`]
    ) {
      return [...awaitForPaymentTickets[`${typeObj[alignment]}`]];
    } else if (
      category === "done" &&
      finishedTickets[`${typeObj[alignment]}`]
    ) {
      return [...finishedTickets[`${typeObj[alignment]}`], ...awaitForPaymentTickets[`${typeObj[alignment]}`]];
    }else if (
      category === "new" &&
      newTickets[`${typeObj[alignment]}`]
    ){
      console.log(newTickets)
      return [...newTickets[`${typeObj[alignment]}`]];
    }
  };
  const list = assignList();
  const morepictures = () => {
    setLoadRange((prev) => prev + 6);

    if (
      loadRange + 6 >=
      list.filter((i) => {
        if (!startDate || !endDate || !dateSearchApplied) return true;
        const itemDate = new Date(i.date);
        const start = new Date(filteredDates[0]);
        const end = new Date(filteredDates[1]);
        return itemDate >= start && itemDate <= end;
      }).length
    ) {
      setNoMoreLoad(true);
    }
  };

  return (
    <div className="worker-container">
      <div
        dir="rtl"
        className="flex flex-col gap-2 lg:gap-0 lg:flex-row w-full justify-evenly items-center"
      >
        <ToggleButtonGroup
          dir="ltr"
          color="primary"
          size="large"
          value={alignment}
          exclusive
          onChange={handleChange}
          aria-label="Platform"
        >
          <ToggleButton
            onClick={() => {
              setDateSearchApplied(false);
              setStartDate("");
              setEndDate("");
              setLoadRange(9);
              setNoMoreLoad(false);
            }}
            value="in"
          >
            وارد
          </ToggleButton>
          <ToggleButton
            onClick={() => {
              setDateSearchApplied(false);
              setStartDate("");
              setEndDate("");
              setLoadRange(9);
              setNoMoreLoad(false);
            }}
            value="out"
          >
            خارج
          </ToggleButton>
        </ToggleButtonGroup>
        {(category === "done" || category === "progress-pay") && <form
          className="flex lg:flex-row flex-col gap-2 lg:gap-4"
          onSubmit={(e) => handleDateFilters(e)}
        >
          <div className="flex items-center gap-2">
            <label>من</label>
            <input
              required
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <label>الى</label>
            <input
              required
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <button className="iron-btn add-btn">بحث</button>
        </form>}
      </div>

      <Seperator
        text={
          category === "progress-load"
            ? "طلبات جاري التحميل"
            : category === "progress-pay"
            ? "طلبات جاري الدفع"
            : category === "done"
            ? "طلبات تمت و جاري انتظار الدفع"
            : category === "new"
            ? "طلبات جديده"
            :" "
        }
      />
      <div className="in-orders">
        <div className="orders-holder">
          <div className="w-full flex flex-col items-center">
            {list &&
              list
                .filter((i) => {
                  const itemDate = new Date(i.date);
                  const startOfToday = new Date();
                  startOfToday.setHours(0, 0, 0, 0);
                  const endOfToday = new Date();
                  endOfToday.setHours(23, 59, 59, 999);
                  if(category === "progress-load"){
                    return itemDate >= startOfToday && itemDate <= endOfToday;
                  }
                  else if(category === 'new'){
                    console.log(i,"here")
                    return itemDate > endOfToday;
                  }
                  else if(category === 'progress-pay' || category === 'done'){
                    if (!startDate || !endDate || !dateSearchApplied) return true;
                    const itemDate = new Date(i.date);
                    const start = new Date(filteredDates[0]);
                    const end = new Date(filteredDates[1]);
                    return itemDate >= start && itemDate <= end;
                  }
                })
                .slice(0, loadRange)
                .map((i, idx) => (
                  <OrdersViewHolder
                    alignment={alignment}
                    isFinishedTicket={false}
                    order={i}
                    className="w-full "
                  />
                ))}
            {noMoreLoad || !list || list.length < 6 ? null : (
              <button
                className="max-w-32 iron-btn add-btn"
                onClick={morepictures}
              >
                اظهار المزيد
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;

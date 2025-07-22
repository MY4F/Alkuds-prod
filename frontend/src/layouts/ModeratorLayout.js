import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import kuds from "../assets/images/kuds.png";
import useLogout from "../hooks/useLogout";
import { useSocketContext } from "../hooks/useSocket";
import { useUnfinishedTicketsContext } from "../hooks/useUnfinishedTicketsContext";
import { useAwaitForPaymentTicketsContext } from "../hooks/useAwaitForPaymentTicketsContext";
import { ToastContainer, toast, cssTransition } from 'react-toastify';
import { useClientContext } from "../hooks/useClientContext";
import { useFinishedTicketsContext } from "../hooks/useFinishedTicketsContext";

export default function ModeratorLayout() {

  const { socket } = useSocketContext();
  const { unfinishedTickets, dispatch } = useUnfinishedTicketsContext();
  const { awaitForPaymentTickets, dispatch: awaitForPaymentTicketsUpdate } = useAwaitForPaymentTicketsContext()
  const { finishedTickets , dispatch: finishedTicketsUpdate} = useFinishedTicketsContext()
  const { client , dispatch: updateClient } = useClientContext()
  useEffect(()=>{
    const handleReceiveOrderFinishState = (info) => {
      console.log("i am heree");
      if (info.order === null) {
        toast.warn('حدث عطل في تعديل الاوردر', {
          position: "top-right",
          autoClose: false,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        toast.success('تم تعديل حاله اوردر عميل بأسم ' + info.order.clientName, {
          position: "top-right",
          autoClose: false,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
  
        if (info.order.state === "جاري انتظار التحميل") {
          console.log("tahmeel");
          dispatch({ type: "UPDATE_TICKET", payload: [info.order] });
        } else if (info.order.state === "جاري انتظار الدفع") {
          console.log("daf3");
          dispatch({ type: "DELETE_TICKET", payload: [info.order] });
          awaitForPaymentTicketsUpdate({ type: "ADD_TICKET", payload: [info.order] });
        } else if (info.order.state === "منتهي") {
          console.log("montahy");
          dispatch({ type: "DELETE_TICKET", payload: [info.order] });
          awaitForPaymentTicketsUpdate({ type: "DELETE_TICKET", payload: [info.order] });
          finishedTicketsUpdate({ type: "ADD_TICKET", payload: [info.order] });
        }
  
        updateClient({ type: "UPDATE_CLIENT", payload: info.client });
      }
    };
  
    socket.on("receive_order_finish_state", handleReceiveOrderFinishState);
  
    return () => {
      socket.off("receive_order_finish_state", handleReceiveOrderFinishState); // Cleanup
    };

  },[dispatch, awaitForPaymentTicketsUpdate, socket, updateClient,finishedTicketsUpdate, awaitForPaymentTickets,finishedTickets, unfinishedTickets])


  const checkNav = (e) => {
    const user = window.confirm("هل تريد الذهاب من هذه الصفحه؟");
    if (!user) {
      e.preventDefault();
    }
  };
  const { logout } = useLogout();
  const handleLogout = () => {
    logout();
  };


  return (
    <div className="background ">
      <div className="container  max-w-[1900px] flex-col-reverse max-w-none md:max-[] md:flex-row gap-4 w-full md:p-7 p-0">
        <div className="main-content min-h-[90vh]  md:min-h-[82vh] w-full rounded-none md:rounded-[50px]">
          <ToastContainer/>
          <Outlet />
        </div>

        <div className="nav w-full md:w-[15%] flex-row md:flex-col space-y-12 pr-0">
          <div className="flex justify-end hidden md:flex">
            <img src={kuds} className="size-14 md:size-auto mr-0" />
          </div>
          <div className="nav-container  w-full gap-4 flex md:flex-col flex-row-reverse   justify-center  py-4 overflow-y-auto">
            <div
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              className="items-center gap-4 flex md:flex-col flex-row-reverse  overflow-y-auto md:overflow-hidden px-6"
            >
              <NavLink className="text-center" to={"/up"}>
                {" "}
                الرئيسيه{" "}
              </NavLink>
              <NavLink className="text-center" to={"moneyvault"}>
                الخزنه
              </NavLink>
              <NavLink className="text-center" to={"/up/impexp"}>
                جرد
              </NavLink>
              <NavLink className="text-center" to={"/up/day"}>
                يوميه
              </NavLink>

              <NavLink className="text-center" to={"clientbill"}>
                كشفات الحسابات
              </NavLink>
              <NavLink className="text-center" to={"settings"}>
                اعدادات
              </NavLink>
              <NavLink className="text-center" to={"customersbalance"}>
                رصيد العملاء
              </NavLink>

              <button onClick={handleLogout} className="iron-btn logout">
                {" "}
                تسجيل خروج{" "}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

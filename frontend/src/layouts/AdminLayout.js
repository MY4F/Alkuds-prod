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
export default function AdminLayout() {
 
  const { socket } = useSocketContext();
  const { unfinishedTickets, dispatch } = useUnfinishedTicketsContext();
  const { awaitForPaymentTickets, dispatch: awaitForPaymentTicketsUpdate } = useAwaitForPaymentTicketsContext()
  const { finishedTickets , dispatch: finishedTicketsUpdate} = useFinishedTicketsContext()
  const { client , dispatch: updateClient } = useClientContext()
  useEffect(()=>{
    const handleReceiveOrderFinishState = (info) => {
      console.log(info);
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
    
    const handleReceiveTransaction = (info)=>{
      console.log(info.transaction_details.bankName)
      if(info.transaction === null){
        toast.warn('حدث عطل في المعامله البنكيه ', {
          position: "top-right",
          autoClose: false,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          });
      }
      else{
        console.log("heeree")
        toast.success('تم تحويل مبلغ مالي الي  ' + info.transaction_details.bankName, {
          position: "top-right",
          autoClose: false,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          });
      }
    }
    
    socket.on("receive_order_finish_state", handleReceiveOrderFinishState);
    socket.on("receive_transaction", handleReceiveTransaction);
    



    return () => {
      socket.off("receive_order_finish_state", handleReceiveOrderFinishState); // Cleanup
      socket.off("receive_transaction", handleReceiveTransaction); // Cleanup

    };


  },[dispatch, awaitForPaymentTicketsUpdate, socket, updateClient, awaitForPaymentTickets])

  const checkNav = (e) => {
    const user = window.confirm("هل تريد الذهاب من هذه الصفحه؟");
    if (!user) {
      e.preventDefault();
    }
  };
  const {logout} = useLogout();
  const handleLogout = () =>{
      logout()
  }
  return (
    <div className="background ">
      <div className="container h-[1px] max-w-[1900px] flex-col-reverse max-w-none md:max-[] md:flex-row gap-4 w-full md:p-7 p-0">
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
              style={{"scrollbarWidth": "none" ,  "msOverflowStyle": "none"}}
              className="items-center gap-4 flex md:flex-col flex-row-reverse  overflow-y-auto md:overflow-hidden px-6"
            >
              <NavLink className="text-center" to={"/up"}>
                {" "}
                الرئيسيه{" "}
              </NavLink>
              <NavLink className="text-center" to={"impexp"}>
                جرد
              </NavLink>
              <NavLink className="text-center" to={"day"}>
                يوميه
              </NavLink>

              <NavLink className="text-center" to={"settings"}>
                اعدادات
              </NavLink>

              <NavLink className="text-center" to={"clientbill"}>
                كشف الحسابات
              </NavLink>
              <NavLink className="text-center" to={"personal-account-statement"}>
                كشف حسابات شخصية
              </NavLink>

              <NavLink className="text-center" to={"moneyvault"}>
                الخزنه
              </NavLink>

              <NavLink className="text-center" to={"profitreports"}>
                التقارير
              </NavLink>

              <button onClick={handleLogout} className="iron-btn logout"> تسجيل خروج </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import kuds from "../assets/images/kuds.png";
import useLogout from "../hooks/useLogout";
import { useSocketContext } from "../hooks/useSocket";
import { ToastContainer, toast, cssTransition } from 'react-toastify';
import { useUnfinishedTicketsContext } from "../hooks/useUnfinishedTicketsContext";

export default function RootLayout() {

  const { socket } = useSocketContext();
  const { unfinishedTickets, dispatch } = useUnfinishedTicketsContext();
  
  useEffect(()=>{
    socket.on("receive_order_creation", (info) => {
      console.log(info)
      if(info.order === null){
        toast.warn('حدث عطل في اضافه الاوردر', {
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
        console.log("hereeeee")
        toast.success('تم اضافه اوردر جديد', {
          position: "top-right",
          autoClose: false,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          });
          dispatch({type:"ADD_TICKET",payload: [info.order]})
      }
    });
  },[dispatch])

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
    <div className="background">
      
      <div className="container  max-w-[1900px] flex-col-reverse max-w-none md:max-[] md:flex-row gap-4 w-full md:p-7 p-0">
        <div className="main-content min-h-[90vh]  md:min-h-[82vh] w-full rounded-none md:rounded-[50px]">
        <ToastContainer/>

          <Outlet />
        </div>

        <div className="nav w-full md:w-[15%] flex-row md:flex-col space-y-12 pr-0">
          <div className="flex justify-end hidden md:flex">
            <img src={kuds} />
          </div>
          <div className="nav-container  w-full gap-4 flex md:flex-col flex-row-reverse   justify-center  py-4 overflow-y-auto">
            <div
              style={{
                "sscrollbarWidth": "none",
                "-ms-overflow-style": "none",
              }}
              className="items-center gap-4 flex md:flex-col flex-row-reverse  overflow-y-auto md:overflow-hidden px-6"
            >
              <NavLink className="text-center" to={"/"}>
                {" "}
                الرئيسيه{" "}
              </NavLink>
              <NavLink className="text-center" to={"createOrders"}>
                {" "}
                انشاء طلب{" "}
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
              <button onClick={handleLogout} className="iron-btn logout"> تسجيل خروج </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import OrderModal from "../components/OrderModal/index";
import { ReactComponent as NewIcon } from "../assets/icons/new.svg";
import { ReactComponent as LoadIcon } from "../assets/icons/load.svg";
import { ReactComponent as PayIcon } from "../assets/icons/pay.svg";
import { ReactComponent as DoneIcon } from "../assets/icons/done.svg";
import Seperator from "../components/Seperator";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
const ModeratorMainPage = () => {
  const [type, setType] = useState("");
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const handleOpen = (x) => {
    if(x==1){
      setType("out");
    }
    else{
      setType("in");
    }
    setOpen(true)
  };
  const handleClose = () => setOpen(false);
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
    height:"80vh",
    'overflow-y':"auto"
  };
  return (
    <section className="p-8 size-full flex flex-col gap-4">
      <Seperator text="انشاء طلب" />
      <Modal
        open={open}
        onClose={handleClose}
        style={{"overflow-y":"auto"}}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <OrderModal type={type} />
        </Box>
      </Modal>
      <div
        className="displayHidden space-x-4"
        style={{
          margin: "0 auto",
          width: "80%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <button
          onClick={(e) => handleOpen(1)}
          className=" text-[14px] md:text-[25px] min-w-[110px] add-btn iron-btn w-[50%] whitespace-nowrap "
        >
          انشاء طلب خارج
        </button>
        <button
          onClick={(e)=>handleOpen(2)}
          className=" w-[50%] whitespace-nowrap add-btn iron-btn min-w-[110px] text-[14px] md:text-[25px]"
        >
          انشاء طلب وارد
        </button>
      </div>
      <Seperator text="الطلبات" />

      <div className="w-full flex md:flex-row flex-col py-6  gap-8" dir="rtl">
        <button
          onClick={() => navigate(`orders/new`)}
          className="cursor-pointer hover:border-[greenyellow] p-5 flex border-[2px] flex-col items-center justify-center gap-4 rounded  md:flex-1 min-h-60"
        >
          <NewIcon className="size-14" />
          <h1 className="text-4xl">جديد</h1>
        </button>
        <button
          onClick={() => navigate(`orders/progress-load`)}
          className="cursor-pointer p-5  hover:border-[greenyellow] flex border-[2px] flex-col items-center justify-center gap-4 rounded  md:flex-1  min-h-60"
        >
          <LoadIcon className="size-14" />
          <h1 className="text-4xl">جاري التحميل</h1>
        </button>
        <button
          onClick={() => navigate(`orders/progress-pay`)}
          className="cursor-pointer p-5  hover:border-[greenyellow] flex border-[2px] flex-col items-center justify-center gap-4 rounded  md:flex-1 min-h-60"
        >
          <PayIcon className="size-14" />
          <h1 className="text-4xl">جاري الدفع</h1>
        </button>
        <button
          onClick={() => navigate(`orders/done`)}
          className="cursor-pointer p-5  hover:border-[greenyellow] flex border-[2px] flex-col items-center justify-center gap-4 rounded  md:flex-1 min-h-60"
        >
          <DoneIcon className="size-14" />
          <h1 className="text-4xl">تم</h1>
        </button>
      </div>
    </section>
  );
};

export default ModeratorMainPage;

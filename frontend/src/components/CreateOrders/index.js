import React, { useState } from "react";
import Seperator from "../Seperator";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import OrderModal from "../OrderModal/index";
import DownOrderModal from "../DownOrderModal";
const CreateOrders = () => {
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const [type, setType] = useState("");
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
    height: "80vh",
    "overflow-y": "auto",
  };
  const handleOpen = (x) => {
    if (x == 1) {
      setType("out");
    } else {
      setType("in");
    }
    setOpen(true);
  };
  const path = typeof window !== "undefined" ? window.location.pathname : "";
  const urlMode = path.includes("/down") ? "down" : path.includes("/up") ? "up" : null;
  return (
    <section className="p-8 size-full flex flex-col gap-4">
      <Seperator text="انشاء طلب" />
      <Modal
        open={open}
        onClose={handleClose}
        style={{ "overflow-y": "auto" }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {
            urlMode === "down" && <DownOrderModal preOrder={null} type={type} closeFun={handleClose} />
          }
          {
            urlMode !== "down" &&  <OrderModal type={type} closeFun={handleClose} />
          }
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
          onClick={(e) => handleOpen(2)}
          className=" w-[50%] whitespace-nowrap add-btn iron-btn min-w-[110px] text-[14px] md:text-[25px]"
        >
          انشاء طلب وارد
        </button>
      </div>
    </section>
  );
};

export default CreateOrders;

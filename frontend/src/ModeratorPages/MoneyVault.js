import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { useClientContext } from "../hooks/useClientContext";
import CashInput from "../SharedComponents/CashInput";
const MoneyVault = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { client } = useClientContext();
  useEffect(() => {}, []);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    'overflow-y':"auto"
  };

  return (
    <div className="vault-container">
      <Button style={{width:"80%", background:"black",color:"white"}} className="cash-btn"  onClick={handleOpen}>اضافه عمليه ماليه</Button>
      <Modal
        open={open}
        onClose={handleClose}
        style={{ "overflow-y": "auto" }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <CashInput/>
        </Box>
      </Modal>

        <div>
            walltes here
        </div>
      
    </div>
  );
};

export default MoneyVault;

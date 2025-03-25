import { Fragment, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { useClientContext } from "../hooks/useClientContext";
import CashInput from "../SharedComponents/CashInput";
import { useWalletContext } from "../hooks/useWalletContext";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import CircularProgress from "@mui/material/CircularProgress";

const Row = (props) => {
  const { row } = props;
  const [open, setOpen] = useState(false);

  return (
    <Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align="right" component="th" scope="row">
          {row.bankName}
        </TableCell>
        <TableCell component="th" scope="row" align="right">
          {row.totalAmount}
        </TableCell>
      </TableRow>
      <TableRow style={{ verticalAlign: "baseline" }}>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography
                variant="h6"
                gutterBottom
                component="div"
                style={{ direction: "rtl", textAlign: "right" }}
              >
                العمليات
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell align="right">اسم العميل</TableCell>
                    <TableCell align="right">رقم الاوردر</TableCell>
                    <TableCell align="right">النوع</TableCell>
                    <TableCell align="right">ملاحظات</TableCell>
                    <TableCell align="right">المبلغ</TableCell>
                    <TableCell align="right">التاريخ</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.transactions.map((transactionRow) => (
                    <TableRow key={transactionRow.clientName}>
                      <TableCell align="right" component="th" scope="row">
                        {transactionRow.clientName}
                      </TableCell>
                      <TableCell align="right" component="th" scope="row">
                        {transactionRow.orderId}
                      </TableCell>
                      <TableCell align="right" component="th" scope="row">
                        {(transactionRow.type  === "in")? "وارد":"خارج"}
                      </TableCell>
                      <TableCell align="right" component="th" scope="row">
                        {transactionRow.notes}
                      </TableCell>
                      <TableCell align="right" component="th" scope="row">
                        {transactionRow.amount}
                      </TableCell>
                      <TableCell align="right" component="th" scope="row">
                        {transactionRow.date}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  );
};

const MoneyVault = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { client } = useClientContext();
  const { wallet } = useWalletContext();
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (wallet && client) {
      setIsLoading(true)
      let wallets = [...Object.keys(wallet)],
        walletsArr = [];
      for (let i of wallets) {
        let transactionObj, transactionsArr = []
        for (let j of wallet[i].transactions) {
          console.log(j);
          transactionObj = {
            clientName: client[j.clientId].name,
            orderId: j.orderId,
            type: j.type,
            notes: j.notes,
            amount: j.amount,
            date: j.date,
          }
          transactionsArr.push(transactionObj)
        }
        walletsArr.push(
          createData(wallet[i]._id,i, wallet[i].totalAmount, transactionsArr)
        );
      }
      console.log(walletsArr);
      setRows([...walletsArr]);
      setIsLoading(false)
    }
  }, [wallet, rows]);

  if (!client || !wallet) {
    return <div> Loading.... </div>;
  }

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
    "overflow-y": "auto",
  };

  function createData(walletId, bankName, totalAmount, transactions) {
    return {
      walletId,
      bankName,
      totalAmount,
      transactions,
    };
  }

  return (
    <div className="vault-container">
      <Button
        style={{ width: "80%", background: "black", color: "white" }}
        className="cash-btn"
        onClick={handleOpen}
      >
        اضافه عمليه ماليه
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        style={{ "overflow-y": "auto" }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <CashInput />
        </Box>
      </Modal>

      <div className="walletsHolder">
        <TableContainer component={Paper}>
          <Table style={{ direction: "rtl" }} aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell align="right"> فتح العمليات</TableCell>
                <TableCell align="right">اسم الحساب</TableCell>
                <TableCell align="right">اجمالي المبلغ</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!isLoading ? (
                rows.map((row) => <Row key={row.walletId} row={row} />)
              ) : (
                <CircularProgress />
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default MoneyVault;

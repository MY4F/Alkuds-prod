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
import { useUserContext } from "../hooks/useUserContext";

const Row = (props) => {
  const { row } = props;
  const [open, setOpen] = useState(false);

  return (
    <Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <div className="flex gap-4 items-center">
            <p className="text-xl">العمليات</p>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </div>
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
              {row.transactions.length > 0 ? (
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
                          {transactionRow.type === "in" ? "استلام من" : "تحويل الي"}
                        </TableCell>
                        <TableCell align="right" component="th" scope="row">
                          {transactionRow.notes}
                        </TableCell>
                        <TableCell align="right" component="th" scope="row">
                          {transactionRow.amount.toLocaleString()}
                        </TableCell>
                        <TableCell align="right" component="th" scope="row">
                          {transactionRow.date}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="w-full text-center text-xl">لا يوجد عمليات</p>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  );
};

const MoneyVault = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleOpen2 = () => setOpen2(true);
  const handleClose2 = () => setOpen2(false);
  const handleOpen3 = () => setOpen3(true);
  const handleClose3 = () => setOpen3(false);
  const { client } = useClientContext();
  const { wallet, dispatch } = useWalletContext();
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [transactionMonth, setTransactionMonth] = useState();
  const [filteredRows, setFilteredRows] = useState([]);
  const [currentCheques, setCurrentCheques] = useState([])
  const { user } = useUserContext()
  useEffect(() => {
    if (wallet && client) {
      setIsLoading(true);
      let wallets = [...Object.keys(wallet)],
        walletsArr = [];
      for (let i of wallets) {
        let transactionObj,
          transactionsArr = [];
        for (let j of wallet[i].transactions) {
          transactionObj = {
            clientName: client[j.clientId].name,
            orderId: j.orderId,
            type: j.type,
            notes: j.notes,
            amount: j.amount,
            date: j.date,
          };
          transactionsArr.push(transactionObj);
        }
        walletsArr.push(
          createData(
            wallet[i]._id,
            i,
            wallet[i].totalAmount.toLocaleString(),
            transactionsArr
          )
        );
      }

      setRows([...walletsArr]);
      setFilteredRows([...walletsArr]);
      setIsLoading(false);
    }

    const getCurrentCheques = async() =>{
      let chequesCall
      try{
        chequesCall = await fetch(
          "/wallet/getCurrentCheques",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        const chequesData = await chequesCall.json();

        if (chequesCall.ok){
          setCurrentCheques([...chequesData])
        }
      }
      catch(err){
        console.log(err)
      }
    }
    getCurrentCheques()
  }, [wallet, dispatch]);

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
  const handleMonthSubmit = (e) => {
    e.preventDefault();
    setIsSearching(true);
    let tempRows = JSON.parse(JSON.stringify(rows));
    let TempFilteredRows = tempRows.map((row) => {
      let filteredTxns = row.transactions.filter((txn) => {
        if (new Date(txn.date.slice(0, 7)) > new Date(transactionMonth)) {
          row.totalAmount = row.totalAmount.toString();
          row.totalAmount = row.totalAmount.replaceAll(",", "");
          console.log(parseFloat(row.totalAmount));
          row.totalAmount = parseFloat(row.totalAmount) - txn.amount;
        }
        return txn.date.slice(0, 7) === transactionMonth;
      });

      return {
        ...row,
        transactions: filteredTxns,
      };
    });

    setFilteredRows(TempFilteredRows);
  };

  return (
    <div className="vault-container">
      <div style={{ width: "100%", display: "flex", flexDirection: "row" }}>
        <Button
          style={{ width: "30%", background: "black", color: "white" }}
          className="cash-btn"
          onClick={handleOpen}
        >
          اضافه عمليه ماليه
        </Button>
        <Button
          style={{ width: "30%", background: "black", color: "white" }}
          className="cash-btn"
          onClick={handleOpen2}
        >
          اضافه شخصيه او نقديه ماليه
        </Button>

        <Button
          style={{ width: "30%", background: "black", color: "white" }}
          className="cash-btn"
          onClick={handleOpen3}
        >
          شيكات
        </Button>

      </div>
      <Modal
        open={open}
        onClose={handleClose}
        style={{ "overflow-y": "auto" }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <CashInput isKudsPersonnel={false} isCheque={false} />
        </Box>
      </Modal>

      <Modal
        open={open2}
        onClose={handleClose2}
        style={{ "overflow-y": "auto" }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <CashInput isKudsPersonnel={true} isCheque={false} />
        </Box>
      </Modal>


      <Modal
        open={open3}
        onClose={handleClose3}
        style={{ "overflow-y": "auto" }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <CashInput isKudsPersonnel={false} isCheque={true} />
        </Box>
      </Modal>

      <div className="walletsHolder flex-col gap-3 justify-start">
        <form
          onSubmit={handleMonthSubmit}
          dir="rtl"
          className="w-full flex-col justify-center py-6 flex items-center gap-2"
        >
          <div>
            <label> عمليات شهر : </label>
            <input
              required
              type="month"
              value={transactionMonth}
              onChange={(e) => setTransactionMonth(e.target.value)}
            />
          </div>
          <div className="w-full flex-col flex space-y-4 items-center">
            <button type="submit" className="iron-btn search-btn w-auto">
              {" "}
              بحث{" "}
            </button>
            {isSearching && (
              <button
                className="iron-btn remove w-auto"
                onClick={(e) => {
                  e.preventDefault();
                  setTransactionMonth("");
                  setIsSearching(false);
                  setFilteredRows(rows);
                }}
              >
                الغاء البحث
              </button>
            )}
          </div>
        </form>
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
                filteredRows.map((row,idx) => {return idx!==6 && <Row key={row.walletId} row={row} />})
              ) : (
                <CircularProgress />
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <div style={{'height':'100px'}}></div>

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
                currentCheques.map((row) => <Row key={row.walletId} row={row} />)
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

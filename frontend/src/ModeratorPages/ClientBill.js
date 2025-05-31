import PropTypes from "prop-types";
import Box from "@mui/material/Box";
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
import TablePagination from '@mui/material/TablePagination';
import { Fragment, useEffect, useState } from "react";
import { useClientContext } from "../hooks/useClientContext";
import CircularProgress from "@mui/material/CircularProgress";
import { useUserContext } from "../hooks/useUserContext";

const Row = (props) => {
  const { row } = props;
  const [open, setOpen] = useState(false);
  const [openStatement, setOpenStatement] = useState(false);

  return (
    <Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" }  }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpenStatement(!openStatement)}
          >
            {openStatement ? (
              <KeyboardArrowUpIcon />
            ) : (
              <KeyboardArrowDownIcon />
            )}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row" align="right">{(row.type === "in")? "وارد":"خارج"}</TableCell>
        <TableCell component="th" scope="row" align="right">{row.state}</TableCell>
        <TableCell component="th" scope="row" align="right">{row.totalPrice.toLocaleString()}</TableCell>
        <TableCell component="th" scope="row" align="right">{row.paidAmount.toLocaleString()}</TableCell>
        <TableCell component="th" scope="row" align="right">{(row.totalPrice - row.paidAmount).toLocaleString()}</TableCell>
        <TableCell component="th" scope="row" align="right">{row.date}</TableCell>
      </TableRow>
      <TableRow style={{verticalAlign:"baseline"}}>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography
                variant="h6"
                gutterBottom
                component="div"
                style={{ direction: "rtl", textAlign:"right" }}
              >
                طلبيات
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell align="right">اسم الصنف</TableCell>
                    <TableCell align="right">القطر</TableCell>
                    <TableCell align="right">الكميه</TableCell>
                    <TableCell align="right">السعر</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.tickets.map((ticketRow) => (
                    <TableRow key={ticketRow.ironName}>
                      <TableCell align="right" component="th" scope="row">{ticketRow.ironName} </TableCell>
                      <TableCell align="right" component="th" scope="row">{ticketRow.radius}</TableCell>
                      <TableCell align="right" component="th" scope="row">{ticketRow.netWeight}</TableCell>
                      <TableCell align="right" component="th" scope="row">{ticketRow.price.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={openStatement} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography
                variant="h6"
                gutterBottom
                component="div"
                style={{ direction: "rtl", textAlign:"right"  }}
              >
                مدفوعات
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell align="right">رقم المستند</TableCell>
                    <TableCell align="right">جهه الدفع</TableCell>
                    <TableCell align="right">المبلغ</TableCell>
                    <TableCell align="right">التاريخ</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.statements.length>0? row.statements.map((statementRow) => (
                    <TableRow key={statementRow.walletId}>
                      <TableCell align="right" component="th" scope="row">{statementRow.walletId}</TableCell>
                      <TableCell align="right" component="th" scope="row">
                        {statementRow.bankName}
                      </TableCell>
                      <TableCell align="right" component="th" scope="row">{statementRow.paidAmount.toLocaleString()}</TableCell>
                      <TableCell align="right" component="th" scope="row">{statementRow.date}</TableCell>
                    </TableRow>
                  )): "لا يوجد تحويلات"}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  );
};

const ClientBill = () => {
  const [clients, setClients] = useState("اختر عميل");
  const { client } = useClientContext();
  const [selectedClient, setSelectedClient] = useState('')
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);
  const [balance, setBalance] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0)
  const [transactionMonth, setTransactionMonth] = useState();
  const [statementRows, setStatementRows] = useState([])
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [previousBalance, setPreviousBalance] = useState(0)
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const { user } = useUserContext();
  useEffect(() => {
    const getPreviousMonthBalance = async() =>{
      

    }
    if(selectedClient!=="")
      getPreviousMonthBalance()
  }, [clients, rows, isLoading, client, selectedClient]);
  
  const columns = [
    { id: 'id', label: 'رقم المستند', minWidth: 170 },
    { id: 'date', label: 'التاريخ', minWidth: 100 },
    {
      id: 'bankName',
      label: 'جهه الدفع',
      minWidth: 170,
      align: 'right',
      format: (value) => value,
    },
    {
      id: 'amount',
      label: 'المبلغ',
      minWidth: 170,
      align: 'right',
      format: (value) => value.toLocaleString(),
    },
  ];

  if (!client) {
    console.log("here");
    return <div>Loading...</div>; // Prevents rendering until data is available
  }
  const handleChange = async (e) => {
    e.preventDefault()
    setIsLoading(true);
    try {
      console.log(transactionMonth)
      const getClientOrderFetch = await fetch(
        "/order/getClientOrders",
        {
          method: "POST",
          body:JSON.stringify({"date":transactionMonth,"id":selectedClient}),
          headers: {
            "Content-Type": "application/json",
          'Authorization': `Bearer ${user.token}`
          },
        }
      );

      const getClientOrder = await getClientOrderFetch.json();

      const getClientTransactionsFetch = await fetch(
        "/wallet/getSpecificClientTransactions",
        {
          method: "POST",
          body:JSON.stringify({"date":transactionMonth,"clientId":selectedClient}),
          headers: {
            "Content-Type": "application/json",
          'Authorization': `Bearer ${user.token}`
          },
        }
      );

      const getClientTransactions = await getClientTransactionsFetch.json();

      const previousMonthBalanceFetch = await fetch('/wallet/getOldClientBalance',{
        'method':'POST',
        'body':JSON.stringify({"date":transactionMonth,"clientId":selectedClient}),
        'headers': {
            "Content-Type": "application/json",
          'Authorization': `Bearer ${user.token}`
        },
      })

      const previousMonthBalance = await previousMonthBalanceFetch.json()

      console.log(previousMonthBalance);
      if (getClientOrderFetch.ok && getClientTransactionsFetch.ok && previousMonthBalanceFetch.ok) {
        console.log(getClientOrder.orders);
        setRows([...getClientOrder.orders]);
        setBalance(client[selectedClient].balance);
        setTotalPaid(getClientOrder.paid);
        setTotalPrice(getClientOrder.price);
        setTotalProfit(getClientOrder.profit)
        setStatementRows([...getClientTransactions])
        setPreviousBalance(previousMonthBalance)
      }
    } catch (err) {
      console.log(err);
    }
    setIsLoading(false);
  };

  

  return (
    <div>
      <div className="name-filter">
      <form
          onSubmit={e=>handleChange(e)}
          dir="rtl"
          className="w-full flex-col justify-center py-6 flex items-center gap-2"
        >
          <div>
            <label> عمليات شهر : </label>
            <input
              required
              type="date"
              value={transactionMonth}
              onChange={(e) => setTransactionMonth(e.target.value)}
            />
          </div>
          <select  onChange={(e) => {
                setClients(client[e.target.value].name);
                setSelectedClient(e.target.value)
          }} required>
            <option value="" disabled selected> اختر عميل </option>
              {client &&
                [...Object.keys(client)].map((i, idx) => {
                  { return (!client[i].isKudsPersonnel) && <option value={client[i].clientId}> {client[i].name} </option>}
                })}
          </select>
          <button type="submit" className="iron-btn search-btn w-auto">
            {" "}
            بحث{" "}
          </button>
        </form>
      </div>
      <div style={{"display":"flex","flexDirection":"column","gap":"50px"}}>
      
    
    <TableContainer component={Paper}>
        <Table style={{ direction: "rtl" }} aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell align="right">طلبيات</TableCell>
              <TableCell align="right">مدفوعات</TableCell>

              <TableCell align="right">النوع</TableCell>
              <TableCell align="right">الحاله</TableCell>
              <TableCell align="right">الاجمالي</TableCell>
              <TableCell align="right">المسدد</TableCell>
              <TableCell align="right">المتبقي</TableCell>
              <TableCell align="right">التاريخ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody >
            {!isLoading ? (
              rows.map((row) => <Row key={row.name} row={row} />)
            ) : (
              <CircularProgress />
            )}
            <TableRow>

              <TableCell colSpan={2}>اجمالي قيمه الاصناف</TableCell>
              <TableCell style={{ direction: "ltr" }} component="th" scope="row" align="right">{totalPrice.toLocaleString()}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2}>اجمالي الدفعات</TableCell>
              <TableCell style={{ direction: "ltr" }} component="th" scope="row" align="right">{totalPaid.toLocaleString()}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2}>رصيد الشهر الماضي </TableCell>
              <TableCell style={{ direction: "ltr" }} component="th" scope="row" align="right">{previousBalance}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2}>الرصيد </TableCell>
              <TableCell style={{ direction: "ltr" }} component="th" scope="row" align="right">{balance.toLocaleString()}</TableCell>
            </TableRow>
            { user.user.msg.name === "Sobhy" && <TableRow>
              <TableCell colSpan={2}>صافي الربح</TableCell>
              <TableCell component="th" scope="row" align="right">{totalProfit.toLocaleString()}</TableCell>
            </TableRow>}
          </TableBody>
        </Table>
    </TableContainer>

    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {statementRows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === 'number'
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 15]}
        component="div"
        count={statementRows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
    </div>
    </div>

  );
};

export default ClientBill;

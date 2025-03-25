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
import { Fragment, useEffect, useState } from "react";
import { useClientContext } from "../hooks/useClientContext";
import CircularProgress from "@mui/material/CircularProgress";

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
        <TableCell align="right" component="th" scope="row">
          {row.orderId}
        </TableCell>
        <TableCell component="th" scope="row" align="right">{(row.type === "in")? "وارد":"خارج"}</TableCell>
        <TableCell component="th" scope="row" align="right">{row.state}</TableCell>
        <TableCell component="th" scope="row" align="right">{row.totalPrice}</TableCell>
        <TableCell component="th" scope="row" align="right">{row.paidAmount}</TableCell>
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
                      <TableCell align="right" component="th" scope="row">{ticketRow.price}</TableCell>
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
                      <TableCell align="right" component="th" scope="row">{statementRow.paidAmount}</TableCell>
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
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);
  const [balance, setBalance] = useState(0);
  useEffect(() => {console.log("here")}, [clients, rows, isLoading, client]);

  if (!client) {
    console.log("here");
    return <div>Loading...</div>; // Prevents rendering until data is available
  }
  const handleChange = async (e) => {
    setIsLoading(true);
    setClients(client[e.target.value].name);
    const clientData = e.target.value;
    try {
      const getClientOrderFetch = await fetch(
        "/order/getClientOrders/" + clientData,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const getClientOrder = await getClientOrderFetch.json();
      console.log(getClientOrder);
      if (getClientOrderFetch.ok) {
        let orders = [],
          price = 0,
          paid = 0;
        for (let i = 0; i < getClientOrder.length; i++) {
            console.log(getClientOrder[i].totalPaid, i)
          price += getClientOrder[i].totalPrice;
          paid += getClientOrder[i].totalPaid;
          let tickets = [],
            statements = [];
          for (let j = 0; j < getClientOrder[i]["ticket"].length; j++) {
            tickets.push({
              ironName: getClientOrder[i]["ticket"][j].ironName,
              radius: getClientOrder[i]["ticket"][j].radius,
              netWeight: getClientOrder[i]["ticket"][j].netWeight,
              price: getClientOrder[i]["ticket"][j].unitPrice,
            });
          }
          for (let j = 0; j < getClientOrder[i]["statement"].length; j++) {
            statements.push({
              walletId: getClientOrder[i]["statement"][j]._id,
              bankName: getClientOrder[i]["statement"][j].bankName,
              paidAmount: getClientOrder[i]["statement"][j].paidAmount,
              date: getClientOrder[i]["statement"][j].date,
            });
          }

          orders.push(
            createData(
              getClientOrder[i]._id,
              getClientOrder[i].type,
              getClientOrder[i].state,
              getClientOrder[i].totalPrice,
              getClientOrder[i].totalPaid,
              getClientOrder[i].date,
              tickets,
              statements
            )
          );
        }
        console.log(orders);
        setRows([...orders]);
        setBalance(client[e.target.value].balance);
        setTotalPaid(paid);
        setTotalPrice(price);
      }
    } catch (err) {
      console.log(err);
    }
    setIsLoading(false);
  };

  function createData(
    orderId,
    type,
    state,
    totalPrice,
    paidAmount,
    date,
    tickets,
    statements
  ) {
    return {
      orderId,
      type,
      state,
      totalPrice,
      paidAmount,
      date,
      tickets,
      statements,
    };
  }

  return (
    <div>
      <div className="name-filter">
        <select  onChange={(e) => handleChange(e)}>
        <option value={1}> اختر عميل </option>
          {client &&
            [...Object.keys(client)].map((i, idx) => (
              <option value={client[i].clientId}> {client[i].name} </option>
            ))}
        </select>
      </div>
      <TableContainer component={Paper}>
        <Table style={{ direction: "rtl" }} aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell align="right">طلبيات</TableCell>
              <TableCell align="right">مدفوعات</TableCell>

              <TableCell align="right">رقم الاوردر</TableCell>
              <TableCell align="right">النوع</TableCell>
              <TableCell align="right">الحاله</TableCell>
              <TableCell align="right">الاجمالي</TableCell>
              <TableCell align="right">المسدد</TableCell>
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
              <TableCell component="th" scope="row" align="right">{totalPrice}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2}>اجمالي الدفعات</TableCell>
              <TableCell component="th" scope="row" align="right">{totalPaid}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2}>الرصيد</TableCell>
              <TableCell component="th" scope="row" align="right">{balance}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ClientBill;

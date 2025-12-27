import React, { useEffect, useState } from "react";
import inventory from "../assets/images/inventory_icon.PNG";
import "../assets/css/impexp.css";
import { useWalletContext } from "../hooks/useWalletContext";
import { useClientContext } from "../hooks/useClientContext";
import CircularProgress from "@mui/material/CircularProgress";
import { useUserContext } from "../hooks/useUserContext";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Seperator from "../components/Seperator";
const DayExpenseRow = (props) => {
  const { data, client } = props;
  let sign = data["sign"] || " "
  console.log(data)
  return (
    <div>
        {/* <span> {data["notes"]} </span>
        <span>-</span>
        <span> {data["bankName"]} </span>
        <span>-</span>
        <span>{client[data["clientId"]].name}</span>
        <span>-</span>
        <span>{data["amount"]}</span>
        <span> | </span>
        <span> {sign}</span> */}

        <div dir="ltr">
          {client[data["clientId"]].name} &nbsp; - &nbsp; 
          &nbsp; {data["bankName"]} &nbsp; - 
          {data["notes"]} &nbsp; - &nbsp; 
          <span dir="ltr">{data["amount"]}</span> &nbsp; | &nbsp; 
          <span dir="ltr">{sign}</span> &nbsp;
        </div>    
      </div>
  );
};

const Impexp = () => {
  const [dailyData, setDailyData] = useState([]);
  const [totalWeight, setTotalWeight] = useState(0);
  const { wallet } = useWalletContext();
  const [transactions, setTransactions] = useState("");
  const [startDate, setStartDate] = useState();
  const { client } = useClientContext();
  const [showPricePerTon, setShowPricePerTon] = useState(false);
  const [showExpenseRow, setShowExpenseRow] = useState(false);
  const [showTotalPrice, setShowTotalPrice] = useState(false);
  const { user } = useUserContext();
  const [showTable, setShowTable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log(user.user.msg.name);
    if (
      user.user.msg.name === "Sobhy" ||
      user.user.msg.name === "Ziad"
    ) {
      setShowPricePerTon(true);
      setShowTotalPrice(true);
    }
    if(user.user.msg.name === "Osama" ){
      console.log("Hassan user")
      setShowExpenseRow(true);
    }
  }, []);
  useEffect(() => {}, [
    dailyData,
    totalWeight,
    startDate,
    transactions,
    isLoading,
  ]);

  if (!wallet || !client) {
    return <div> Loading... </div>;
  }

  // + - 900 - name - bank - note
  const getDailyData = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (!showTable) {
      setShowTable(true);
    }

    const response = await fetch((user.user.msg.name === "Sobhy" ||user.user.msg.name === "Ziad") ? "/irons/getIronStorage":"/irons/getIronStorageNonAdmin", {
      method: "POST",
      body: JSON.stringify({ startDate }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });
    const { ironStorage, total } = await response.json();
    console.log(ironStorage)
    const transactionsFetch = await fetch("/wallet/getWalletInventoryByDate", {
      method: "POST",
      body: JSON.stringify({ startDate }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });

    const transactions = await transactionsFetch.json();
    if (transactionsFetch.ok && response.ok) {
      console.log(transactions)
      setDailyData([...ironStorage]);
      setTransactions([...transactions]);
      setTotalWeight(total);
    }
    setIsLoading(false);
  };

  return (
    <div className="print-section page-breakable" style={{ display: "flex", flexDirection: "column" }}>
      <div className="header">
        <img src={inventory} alt="ohoh" />
        <h1>الجرد اليومي</h1>
      </div>
      <form
        className="no-print flex lg:flex-col items-center flex-col gap-2 lg:gap-4"
        onSubmit={(e) => getDailyData(e)}
      >
        <div className="no-print mt-3 flex flex-row-reverse justify-center  items-center gap-2">
          <div className="margin-for-print">
            <label dir="rtl" className="text-center mb-0">
              الجرد حتى تاريخ :
            </label>
            <p className="print-only">{startDate}</p>
          </div>
          <input
            className="no-print"
            required
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <button type="submit" className="no-print iron-btn search-btn">
          {" "}
          بحث{" "}
        </button>
        {!showTable && (
          <p className="text-center text-xl font-bold">
            يرجى اختيار تاريخ لعرض بيانات الجرد حتى ذلك اليوم
          </p>
        )}
      </form>
      {showTable && (
        <>
          {!isLoading ? (
            <div className="space-y-5 items-center">
              <div
                className="print-only"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-start",
                }}
              >
                <table className="out-table">
                  <thead>
                    <tr>
                      <th className="text-center border-l-2 border-black p-2">
                        {" "}
                        نقديه{" "}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions &&
                      transactions.map((i, idx) => (
                        <>
                         {(showPricePerTon || showExpenseRow) && <DayExpenseRow data={i} key={idx} client={client} />}
                        </>
                      ))}
                  </tbody>
                </table>
                <table style={{ direction: "rtl" }} className="impexp-table">
                  <thead>
                    <tr>
                      <th className="text-center border-l-2 border-black">
                        وزن الحديد
                      </th>
                      <th className="text-center border-l-2 border-black">
                        القطر
                      </th>
                      <th className="text-center border-l-2 border-black">
                        النوع
                      </th>
                      {showPricePerTon && (
                        <th className="text-center border-black">سعر/طن</th>
                      )}
                      {showTotalPrice && (
                        <th className="text-center border-black">
                          اجمالي السعر
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {dailyData.map((el) => (
                      <>
                        {((el.weight > 0 || el.weight < 0) &&
                          el.radius === "6") && ( !el.highlight ||(el.highlight && showPricePerTon))&& (
                            <tr  style={{ border: "2px solid black", "background": el.highlight? 'orange':'none' }}>
                              <td className=" text-center border-l-2 border-black">
                                {el.weight.toLocaleString()}
                              </td>
                              <td className="text-center border-l-2 border-black">
                                {el.radius}
                              </td>
                              <td className="text-center border-l-2 border-black">
                                {" "}
                                {el.name}
                              </td>
                              {showPricePerTon && (
                                <td className="text-center border-l-2 border-black">
                                  {" "}
                                  {el.price}
                                </td>
                              )}
                              {showTotalPrice && (
                                <td className="text-center border-l-2 border-black">
                                  {" "}
                                  {el.totalPrice}
                                </td>
                              )}
                            </tr>
                          )}
                      </>
                    ))}
                    {dailyData.map((el) => (
                      <>
                        {(el.weight > 0 || el.weight < 0) &&
                          el.radius === "8" && ( !el.highlight ||(el.highlight && showPricePerTon))&&(
                            <tr style={{ border: "2px solid black" , "background": el.highlight? 'orange':'none' }}>
                              <td className="text-center border-l-2 border-black">
                                {" "}
                                {el.weight.toLocaleString()}
                              </td>
                              <td className="text-center border-l-2 border-black">
                                {el.radius}
                              </td>
                              <td className="text-center border-l-2 border-black">
                                {" "}
                                {el.name}
                              </td>
                              {showPricePerTon && (
                                <td className="text-center border-l-2 border-black">
                                  {" "}
                                  {el.price}
                                </td>
                              )}
                              {showTotalPrice && (
                                <td className="text-center border-l-2 border-black">
                                  {" "}
                                  {el.totalPrice}
                                </td>
                              )}
                            </tr>
                          )}
                      </>
                    ))}
                    {dailyData.map((el) => (
                      <>
                        {(el.weight > 0 || el.weight < 0) &&
                          el.radius !== "6" &&
                          el.radius !== "8"  && ( !el.highlight ||(el.highlight && showPricePerTon))&& (
                            <tr style={{ border: "2px solid black", "background": el.highlight? 'orange':'none'  }}>
                              <td className="text-center border-l-2 border-black">
                                {" "}
                                {el.weight.toLocaleString()}
                              </td>
                              <td className="text-center border-l-2 border-black">
                                {el.radius}
                              </td>
                              <td className="text-center border-l-2 border-black">
                                {el.name}
                              </td>
                              {showPricePerTon && (
                                <td className="text-center border-l-2 border-black">
                                  {" "}
                                  {el.price}
                                </td>
                              )}
                              {showTotalPrice && (
                                <td className="text-center border-l-2 border-black">
                                  {" "}
                                  {el.totalPrice}
                                </td>
                              )}
                            </tr>
                          )}
                      </>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td className="p-2 text-center border-r-2 border-b-2 border-l-2 border-black">
                        {totalWeight}
                      </td>
                      <th className="p-2 text-center border-black border-l-2 border-b-2">
                        اجمالي الوزن
                      </th>
                    </tr>
                  </tfoot>
                </table>
              </div>
              { (showPricePerTon || showExpenseRow) && <Seperator text="الخزنه"  />}
             { (showPricePerTon||showExpenseRow) && <TableContainer
                component={Paper}
                className="no-print"
                sx={{ border: "1px solid black" }}
              >
                <Table
                  style={{ direction: "rtl" }}
                  aria-label="collapsible table"
                >
                  <TableHead>
                    <TableRow>
                      <TableCell
                        align="center"
                        sx={{ width: "50%", border: "1px solid black" }}
                      >
                        اسم الحساب
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ width: "50%", border: "1px solid black" }}
                      >
                        اجمالي المبلغ
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {wallet &&
                      Object.entries(wallet).map(
                        ([accountName, accountData]) => (
                          <TableRow key={accountData._id}>
                            <TableCell
                              align="center"
                              sx={{ border: "1px solid black" }}
                            >
                              {accountName}
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ border: "1px solid black" }}
                            >
                              {accountData.totalAmount.toLocaleString("ar-EG")}
                            </TableCell>
                          </TableRow>
                        )
                      )}
                  </TableBody>
                </Table>
              </TableContainer>}
            </div>
          ) : (
            <div className="text-center">
              <CircularProgress />
            </div>
          )}
          <button
            className="no-print iron-btn mt-5 max-w-80 font-bold text-xl"
            onClick={(e) => {
              window.print();
            }}
          >
            {" "}
            طباعه
          </button>
        </>
      )}
    </div>
  );
};

export default Impexp;

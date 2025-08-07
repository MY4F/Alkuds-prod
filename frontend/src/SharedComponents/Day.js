import React, { useEffect, useState } from "react";
import { useClientContext } from "../hooks/useClientContext";
import { useUserContext } from "../hooks/useUserContext";
import CircularProgress from "@mui/material/CircularProgress";

const InTableRow = ({ w, name, raduis, ironName, price, loggedUser }) => {
  return (
    <tr>
      <td style={{ minWidth: "90px" }}> {name} </td>
      <th style={{ minWidth: "90px" }}> {ironName} </th>
      <td> {raduis} </td>
      <td> {w.toLocaleString()} </td>
      { loggedUser && <td> {price.toLocaleString()} </td> }
    </tr>
  );
};

const OutTableRow = ({ name, raduis, w, ironName }) => {
  return (
    <tr>
      <td style={{ minWidth: "90px" }}> {name} </td>
      <th style={{ minWidth: "90px" }}> {ironName} </th>
      <td> {raduis} </td>
      <td> {w} </td>
    </tr>
  );
};

const Day = () => {
  const { user } = useUserContext();
  const [inArrWeightArr, setInArrWeightArr] = useState([]);
  const [outArrWeightArr, setOutArrWeightArr] = useState([]);
  const [startDate, setStartDate] = useState([]);
  const [totalOut, setTotalOut] = useState(0);
  const [totalIn, setTotalIn] = useState(0);
  const { client } = useClientContext();
  const [showTable, setShowTable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [noTicketsForThatDay, setNoTicketsForThatday] = useState(false);
  const [ showPriceColumn , setShowPriceColumn ] = useState(false)
  useEffect(() => {
    console.log(user.user.msg.username)
    if(user.user.msg.username !== "admin2"){
      setShowPriceColumn(true)  
    }
  }, [user,inArrWeightArr, outArrWeightArr, totalOut, totalIn]);

  if (!client) {
    return <div>Loading...</div>; // Prevents rendering until data is available
  }

  const getTicketsInfo = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (!showTable) {
      setShowTable(true);
    }
    const response = await fetch("/order/getTicketsForDay", {
      method: "POST",
      body: JSON.stringify({ startDate }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });
    const json = await response.json();

    if (json.length == 0 ) {
      setNoTicketsForThatday(true);
    }else {
      setNoTicketsForThatday(false);
    }
    let tOut = 0,
      tIn = 0;
    if (response.ok) {
      let inArr = [],
        outArr = [];
      for (let i of json) {
        if (i.type === "in") {
          console.log(i);
          for (let j = 0; j < i.ticket.length; j++) {
            let kgDummy = i.ticket[j].netWeight / 1000;
            let kgStr = kgDummy.toString();
            let kgSplit;
            let kgValue;
            tIn += parseInt(i.ticket[j].netWeight);
            if (kgStr.indexOf(".") !== -1) {
              kgSplit = kgStr.split(".");
              console.log(kgStr);
              kgValue = parseInt(kgSplit[1].padEnd(3, "0"));
            } else kgValue = 0;
            let obj = {
              name: client[i.clientId].name,
              w: i.ticket[j].netWeight,
              raduis: i.ticket[j].radius,
              ironName: i.ticket[j].ironName,
              field5: " ",
              money: " "
            };
            inArr.push(obj);
          }
        }
        setOutArrWeightArr([...inArr]);
        setTotalIn(tIn);
        console.log(inArr);
      }
      for (let i of json) {
        if (i.type === "out") {
          for (let j = 0; j < i.ticket.length; j++) {
            let kgDummy = i.ticket[j].netWeight / 1000;
            let kgStr = kgDummy.toString();
            let kgSplit = kgStr.split(".");
            let kgValue;
            tOut += Math.abs(parseInt(i.ticket[j].netWeight));
            if (kgStr.indexOf(".") !== -1) {
              kgValue = parseInt(kgSplit[1].padEnd(3, "0"));
            } else {
              kgValue = 0;
            }
            let obj = {
              name: client[i.clientId].name,
              ironName: i.ticket[j].ironName,
              w: i.ticket[j].netWeight,
              raduis: i.ticket[j].radius,
              unitPrice: i.ticket[j].unitPrice
            };
            outArr.push(obj);
          }
        }
        setInArrWeightArr([...outArr]);
        setTotalOut(tOut);
        console.log(outArr);
      }
    }
    setIsLoading(false);
  };

  const MMDDYYYYDate = () => {
    let d = new Date().toLocaleString();
    let dateArr = d.split(",");
    d = dateArr[0];
    let e = d.split("/");
    return e[1] + "/" + e[0] + "/" + e[2];
  };
  return (
    <>
      <p className="no-print mb-3" style={{ textAlign: "center" }}>
        {" "}
        {MMDDYYYYDate()} / {new Date().toLocaleTimeString()}
      </p>
      <form
        className="flex lg:flex-col items-center flex-col gap-2 lg:gap-4"
        onSubmit={(e) => getTicketsInfo(e)}
      >
        <div className="no-print mt-3 flex flex-row-reverse justify-center  items-center gap-2">
          <div className="margin-for-print">
            <label dir="rtl" className="text-center mb-0">
              تاريخ اليومية :
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
            الرجاء اختيار تاريخ لعرض تفاصيل اليومية الخاصة بهذا اليوم
          </p>
        )}
      </form>
      {showTable && (
        <>
          {isLoading ? (
            <div className="text-center">
              <CircularProgress />
            </div>
          ) : noTicketsForThatDay ? (
            <p className="text-center text-xl font-bold">
              لا يوجد اي عمليات في هذا اليوم
            </p>
          ) : (
            <>
              <div className="daily-table-holder">
                <table className="in-table" align="right">
                  <thead>
                    <tr>
                      <th> مورد بضاعه </th>
                      <th> نوع </th>
                      <th> م </th>
                      <th> وزن</th>
                    </tr>
                  </thead>
                  <tbody>
                    {outArrWeightArr.map((i, idx) => (
                      <OutTableRow
                        key={idx}
                        ironName={i.ironName}
                        name={i.name}
                        w={i.w}
                        raduis={i.raduis}
                      />
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td>{totalIn}</td>
                      <th>اجمالي الوزن</th>
                    </tr>
                  </tfoot>
                </table>
                <table className="in-table">
                  <thead>
                    <tr>
                      <th> العميل </th>
                      <th> نوع </th>
                      <th> م </th>
                      <th> وزن</th>
                      { showPriceColumn && <th> سعر</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {inArrWeightArr.map((i, idx) => (
                      <InTableRow
                        key={idx}
                        name={i.name}
                        ironName={i.ironName}
                        w={i.w}
                        raduis={i.raduis}
                        price={parseFloat(i.w * parseFloat(i.unitPrice/1000))}
                        loggedUser={showPriceColumn}
                      />
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td>{totalOut}</td>
                      <th>اجمالي الوزن</th>
                    </tr>
                  </tfoot>
                </table>
              </div>
              <button
                className="no-print iron-btn font-bold max-w-80 text-xl mt-5"
                onClick={(e) => window.print()}
              >
                {" "}
                طباعه
              </button>
            </>
          )}
        </>
      )}
    </>
  );
};

export default Day;

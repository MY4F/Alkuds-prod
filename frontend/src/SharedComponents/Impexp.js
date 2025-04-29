import React, { useEffect, useState } from "react";
import inventory from "../assets/images/inventory_icon.PNG";
import "../assets/css/impexp.css";
import { useWalletContext } from "../hooks/useWalletContext";
import { useClientContext } from "../hooks/useClientContext";

const DayExpenseRow = (props) => {
  const { data, client } = props;
  return (
    <>
      <div>
        {data["notes"]}&nbsp; - &nbsp;{data["amount"]} &nbsp; - &nbsp; {client[data["clientId"]].name}
      </div>
    </>
  );
};

const Impexp = () => {
  const [dailyData, setDailyData] = useState([]);
  const [totalWeight, setTotalWeight] = useState(0);
  const { wallet } = useWalletContext();
  const [transactions, setTransactions] = useState("");
  const [startDate, setStartDate] = useState();
  const { client } = useClientContext()
  useEffect(() => {}, [dailyData, totalWeight, startDate, transactions]);

  if (!wallet || !client) {
    return <div> Loading... </div>;
  }

  const getDailyData = async (e) => {
    e.preventDefault();
    const response = await fetch("/irons/getIronStorage", {
      method: "POST",
      body: JSON.stringify({ startDate }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const ironStorage = await response.json();
    let d = new Date().toLocaleString("en-EG", { timeZone: "Africa/Cairo" });
    let dateArr = d.split(",");
    // console.log(dateArr[0] );
    // console.log(ironStorage[0].props[0].date == dateArr[0]);

    let dummyDailyData = [],
      total = 0;
    console.log(ironStorage);
    ironStorage.map((iron) => {
      iron[Object.keys(iron)[0]].map((prop) => {
        total += parseInt(prop.weight);
        let rowitem = {
          name: Object.keys(iron)[0],
          weight: prop.weight,
          radius: prop.radius,
        };
        dummyDailyData.push(rowitem);
      });
    });

    const transactionsFetch = await fetch("/wallet/getWalletInventoryByDate", {
      method: "POST",
      body: JSON.stringify({ startDate }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const transactions = await transactionsFetch.json();
    if (transactionsFetch.ok && response.ok) {
      console.log(dummyDailyData);
      setDailyData([...dummyDailyData]);
      setTransactions([...transactions]);
      setTotalWeight(total);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div className="header">
        <img src={inventory} alt="ohoh" />
        <h1>الجرد اليومي</h1>
      </div>
      <form
        className="flex lg:flex-col items-center flex-col gap-2 lg:gap-4"
        onSubmit={(e) => getDailyData(e)}
      >
        <div className="flex items-center gap-2">
          <input
            required
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <button type="submit" className="iron-btn search-btn">
          {" "}
          بحث{" "}
        </button>
      </form>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
        }}
      >
        <table className="out-table">
          <thead>
            <tr>
              <th> نقديه </th>
              <th> +/- </th>
            </tr>
          </thead>
          <tbody>
            {transactions &&
              transactions.map((i, idx) => (
                <>
                  <DayExpenseRow data={i} key={idx} client={client} />
                </>
              ))}
          </tbody>
        </table>
        <table style={{ direction: "rtl" }} className="impexp-table">
          <thead>
            <tr>
              <th>وزن الحديد</th>
              <th>القطر</th>
              <th>النوع</th>
            </tr>
          </thead>
          <tbody>
            {dailyData.map((el) => (
              <>
                {(el.weight > 0 || el.weight < 0) && el.radius === "6" && (
                  <tr style={{ border: "2px solid black" }}>
                    <td>{el.weight}</td>
                    <td>{el.radius}</td>
                    <td> {el.name}</td>
                  </tr>
                )}
              </>
            ))}
            {dailyData.map((el) => (
              <>
                {(el.weight > 0 || el.weight < 0) && el.radius === "8" && (
                  <tr style={{ border: "2px solid black" }}>
                    <td>{el.weight}</td>
                    <td>{el.radius}</td>
                    <td> {el.name}</td>
                  </tr>
                )}
              </>
            ))}
            {dailyData.map((el) => (
              <>
                {(el.weight > 0 || el.weight < 0) &&
                  el.radius !== "6" &&
                  el.radius !== "8" && (
                    <tr style={{ border: "2px solid black" }}>
                      <td>{el.weight}</td>
                      <td>{el.radius}</td>
                      <td>{el.name}</td>
                    </tr>
                  )}
              </>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td>{totalWeight}</td>
              <th>اجمالي الوزن</th>
            </tr>
          </tfoot>
        </table>
      </div>
      <button className="iron-btn" onClick={(e) => {
          window.print()
        }}>
        {" "}
        طباعه
      </button>
    </div>
  );
};

export default Impexp;

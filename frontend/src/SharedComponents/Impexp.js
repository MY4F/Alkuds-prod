import React, { useEffect, useState } from "react";
import inventory from "../assets/images/inventory_icon.PNG";
import "../assets/css/impexp.css";
import { useWalletContext } from "../hooks/useWalletContext";
import { useClientContext } from "../hooks/useClientContext";
import CircularProgress from "@mui/material/CircularProgress";

import { useUserContext } from "../hooks/useUserContext";
// import { useUserContext } from "@/hooks/useUserContext";

const DayExpenseRow = (props) => {
  const { data, client } = props;

  return (
    <>
      <div>
        {data["notes"]}&nbsp; - &nbsp;{data["amount"]} &nbsp; - &nbsp;{" "}
        {client[data["clientId"]].name}
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
  const { client } = useClientContext();
  const [showPricePerTon, setShowPricePerTon] = useState(false);
  const [showTotalPrice, setShowTotalPrice] = useState(false);
  const { user } = useUserContext();
  const [showTable, setShowTable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    console.log(user.user.msg.name);
    if (user.user.msg.name === "Osama") {
      setShowPricePerTon(true);
    } else if (user.user.msg.name === "Sobhy" || user.user.msg.name === "Ziad") {
      setShowPricePerTon(true);
      setShowTotalPrice(true);
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

  const getDailyData = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (!showTable) {
      setShowTable(true);
    }
    const response = await fetch("/irons/getIronStorage", {
      method: "POST",
      body: JSON.stringify({ startDate }),
      headers: {
        "Content-Type": "application/json",
          'Authorization': `Bearer ${user.token}`
      },
    });
    const { ironStorage, total } = await response.json();
    const transactionsFetch = await fetch("/wallet/getWalletInventoryByDate", {
      method: "POST",
      body: JSON.stringify({ startDate }),
      headers: {
        "Content-Type": "application/json",
          'Authorization': `Bearer ${user.token}`
      },
    });

    const transactions = await transactionsFetch.json();
    if (transactionsFetch.ok && response.ok) {
      setDailyData([...ironStorage]);
      setTransactions([...transactions]);
      setTotalWeight(total);
    }
    setIsLoading(false);
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
        <div className="mt-3 flex flex-row-reverse justify-center  items-center gap-2">
          <label className="text-center">الجرد حتى تاريخ :</label>
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
        {!showTable && (
          <p className="text-center text-xl font-bold">
            يرجى اختيار تاريخ لعرض بيانات الجرد حتى ذلك اليوم
          </p>
        )}
      </form>
      {showTable && (
        <>
          {!isLoading ? (
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
                    <th className="text-center border-l-2 border-black p-2">
                      {" "}
                      نقديه{" "}
                    </th>
                    <th className="text-center border-l-2 border-black p-2">
                      {" "}
                      +/-{" "}
                    </th>
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
                      <th className="text-center border-black">اجمالي السعر</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {dailyData.map((el) => (
                    <>
                      {(el.weight > 0 || el.weight < 0) &&
                        el.radius === "6" && (
                          <tr style={{ border: "2px solid black" }}>
                            <td className=" text-center border-l-2 border-black">
                              {el.weight}
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
                        el.radius === "8" && (
                          <tr style={{ border: "2px solid black" }}>
                            <td className="text-center border-l-2 border-black">
                              {" "}
                              {el.weight}
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
                        el.radius !== "8" && (
                          <tr style={{ border: "2px solid black" }}>
                            <td className="text-center border-l-2 border-black">
                              {" "}
                              {el.weight}
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
          ) : (
            <div className="text-center">
              <CircularProgress />
            </div>
          )}
          <button
            className="iron-btn mt-5 max-w-80 font-bold text-xl"
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

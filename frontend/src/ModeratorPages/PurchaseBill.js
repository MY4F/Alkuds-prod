import { useLoaderData, useParams } from "react-router-dom";
import { useClientContext } from "../hooks/useClientContext";
import kudsPrint from "../assets/images/kuds-print.png";
import qr from "../assets/images/qr.png";
import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/fontawesome-free-solid";
import { useSocketContext } from "../hooks/useSocket";
const Receipt = ({ order }) => {
  let arr = [],
  totalPriceSum = 0;

  console.log(order.ticket.length);
  for (let idx = 0; idx < order.ticket.length; idx++) {
    totalPriceSum += order.ticket[idx].realTotalPrice;
    arr.push(
      <div className="generated-iron-block">
        <div className="client-print-data" style={{ direction: "rtl" }}>
          <p className="total-weight">
            <span>قطر:</span>
            &nbsp;
            <span>{order.ticket[idx].radius}</span>
          </p>
          <p className="total-weight">
            <span>صافي الكميه:</span>
            &nbsp;
            <span>{order.ticket[idx].netWeight}</span>
          </p>
          <p className="total-weight">
            <span>السعر</span>
            &nbsp;
            <span>{order.ticket[idx].unitPrice}</span>
          </p>
          <p className="total-weight">
            <span>الاجمالي</span>
            &nbsp;
            <span>{order.ticket[idx].realTotalPrice}</span>
          </p>
        </div>
      </div>
    );
  }
  return (
    <>
      {arr.map((i, idx) => (
        <>
          {i}
          <div className="horizontal-line"></div>
        </>
      ))}

      <p style={{ width: "66%", textAlign: "left", fontSize: "15px" }}>
        <span>اجمالي الفاتوره:</span>
        <span> {totalPriceSum} </span>
      </p>
    </>
  );
};

const PurchaseBill = () => {
  const { socket } = useSocketContext();
  const order = useLoaderData();
  const { client } = useClientContext();
  const { isFinishedTicket } = useParams();
  useEffect(() => {
    const closeAfterPrint = () => {
      window.close();
    };

    window.addEventListener("afterprint", closeAfterPrint);

    return () => {
      window.removeEventListener("afterprint", closeAfterPrint);
    };
  }, [socket]);

  if (!client) {
    
    return <div>Loading...</div>; 
  }

  const handlePrint = async () => {
    if (window.confirm("هل تريد طباعه التيكيت") === true) {
      await socket.emit("send_order_update", {
        message: "Purchase Bill Printed Successfully",
        room: "123",
        order: null,
      });
      window.print();
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${require("../assets/images/kuds-watermark.png")})`,
      }}
      className="print-content"
    >
      <div className="print-header">
        <div className="header-img-holder">
          <img style={{ width: "70%" }} src={kudsPrint} />
          <span>01002112431</span>
          <p
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
            }}
          >
            <span> منطقه كمائن الجير خلف طريق العين السخنه </span>
            <span> 48 </span>
          </p>
        </div>
        <div className="type-date-holder">
          <h1> فاتوره مبيعات </h1>
          <span> {new Date().toLocaleString()} </span>
        </div>
        <img style={{ width: "15%", margin: "30px" }} src={qr} />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          justifyContent: "flex-end",
          textAlign: "left",
          width: "100%",
          margin: "10px 0",
        }}
        className="static-info"
      >
        <div className="static-data-holder client-print-data">
          <p>
            <span> {client[order.clientId].name} </span>
            &nbsp;
            <span>: اسم العميل</span>
          </p>
        </div>
      </div>
      <Receipt order={order} />

      <button onClick={(e) => handlePrint()} className="iron-btn print-btn">
        {" "}
        طباعه {<FontAwesomeIcon icon={faPrint} bounce />}
      </button>
    </div>
  );
};

export default PurchaseBill;

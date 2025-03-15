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
    totalWeight =
      order.ticket[order.ticket.length - 1].weightAfter -
      order.firstWeight.weight;
  console.log(order.ticket.length);
  for (let idx = 0; idx < order.ticket.length; idx++) {
    arr.push(
      <div className="generated-iron-block">
        <div className="client-print-data">
          <p>
            <span>قطر:</span>
            &nbsp;
            <span>{order.ticket[idx].radius}</span>
          </p>
        </div>
        <div className="client-print-data">
          <div>
            <p>
              <span>وزنه {idx + 2} :</span>
              <span> {order.ticket[idx].weightAfter} </span>
            </p>
          </div>
          <div>
            <p>
              <span> وزنه {idx + 1} :</span>
              &nbsp;
              <span> {order.ticket[idx].weightBefore} </span>
            </p>
          </div>
        </div>
        <p className="total-weight client-print-data">
          صافي الوزنه:{order.ticket[idx].netWeight}
        </p>
      </div>
    );
  }

  return arr.map((i, idx) => (
    <>
      {i}
      <div className="horizontal-line"></div>
      {
        <p style={{ width: "66%", textAlign: "left", fontSize: "15px" }}>
          <span>الوزن الصافي:</span>
          <span> {totalWeight} </span>
        </p>
      }
    </>
  ));
};

const ReceiptPrintPage = () => {
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
    console.log("here");
    return <div>Loading...</div>; // Prevents rendering until data is available
  }

  const handlePrint = async () => {
    if (window.confirm("هل تريد طباعه التيكيت") === true) {
      try {
        if (order.state === "progress" && !isFinishedTicket) {
          const orderStateUpdateFetch = await fetch("/order/orderFinishState", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ orderId: order._id }),
          });

          const orderStateUpdate = await orderStateUpdateFetch.json();
          if (orderStateUpdateFetch.ok) {
            await socket.emit("send_order_update", {
              message: "Order Printed Successfully",
              room: "123",
              order: orderStateUpdate,
            });
          } else {
            await socket.emit("send_order_update", {
              message: "Order failed to print",
              room: "123",
              order: orderStateUpdate,
            });
          }
        } else {
          await socket.emit("send_order_update", {
            message: "Order Printed Successfully",
            room: "123",
            order: null,
          });
        }
      } catch (err) {
        console.log(err);
      }
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
          <h1> اذن استلام بضاعه </h1>
          <span> {order.type === "in" ? "داخل" : "خارج"} </span>
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
            <span>{client[order.clientId].address}</span>
            &nbsp;
            <span>: عنوان العميل</span>
          </p>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <p>
            <span> {client[order.clientId].name} </span>
            &nbsp;
            <span>: اسم العميل</span>
          </p>
        </div>
        <div className="static-data-holder">
          <p>
            <span> 1 </span>
            &nbsp;
            <span>: رقم العربيه</span>
          </p>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <p>
            <span> 1</span>
            &nbsp;
            <span>: رقم المقطوره</span>
          </p>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <p>
            <span> 1 </span>
            &nbsp;
            <span>: رقم السائق</span>
          </p>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <p>
            <span>1</span>
            &nbsp;
            <span>: اسم السائق</span>
          </p>
        </div>
        <div className="static-data-holder">
          <p>__________________/ت.المستلم</p>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <p>__________________/المستلم</p>
        </div>
      </div>
      <Receipt order={order} />
      <p>
        انا الموقع ادناه استلمت البضاعه المبينه بعاليه بحاله جيده بصفه امانه
        لحين توريد ثمنها بإصال مستقل.
      </p>
      <p>اقرار استلام عميل</p>
      <p style={{ width: "100%" }}>______________________/الاسم</p>
      <p style={{ width: "100%" }}>_____________________/التوقع</p>

      <button onClick={(e) => handlePrint()} className="iron-btn print-btn">
        {" "}
        طباعه {<FontAwesomeIcon icon={faPrint} bounce />}
      </button>
    </div>
  );
};

export default ReceiptPrintPage;

export const GetOrder = async ({ params }) => {
  const { id } = params;
  const res = await fetch(`/order/getSpecificTicket/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res;
};

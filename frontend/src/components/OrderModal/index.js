import React, { useEffect, useState } from "react";
import Seperator from "../Seperator/index";

const OrderModal = ({ onClose, type }) => {
  const [selectedClient, setSelectedClient] = useState("");
  const [clientInfo, setClientsInfo] = useState([]);
  const [price, setPrice] = useState(0);
  const [date, setDate] = useState();
  const [tickets, setTickets] = useState([
    { ironName: "", radius: "", neededWeight: "", totalPrice: "" },
  ]);

  useEffect(() => {
    const getClientsInfo = async () => {
      const response = await fetch("/clients/getClientsInfo", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const json = await response.json();
      setClientsInfo(json);
    };

    getClientsInfo();
  }, []);
  const HandleFormSubmission = async (e) => {
    e.preventDefault();
    const data = {
      clientId: selectedClient,
      totalPrice: price,
      date: date,
      ticket: tickets,
      type: type,
    };
    console.log(data);
    try {
      const response = await fetch("/order/addOrder", {
        // Update port if different
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to add order");

      const result = await response.json();
      //TODO: add any user interaction here instead of clg
      console.log("Order added:", result);
    } catch (error) {
      console.error("Error submitting order:", error);
    }
  };
  return (
    <div dir="rtl">
      <Seperator text={`بيانات طلب ${type}`} />
      <form className="w-full px-4 pt-6" onSubmit={HandleFormSubmission}>
        <div className="w-full flex md:flex-row flex-col gap-5 pb-6">
          <div className="md:w-[50%] w-full flex justify-center">
            <div className="flex flex-col gap-2 w-full max-w-[300px]">
              <label className="text-center">أسم العميل</label>
              <select
                req
                uired
                value={selectedClient}
                onChange={(e) => {
                  setSelectedClient(e.target.value);
                }}
                className="w-full md:w-[300px]"
              >
                <option value="">أسم العميل</option>
                {clientInfo.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="md:w-[50%] w-full flex justify-center">
            <div className="flex flex-col gap-2 w-full max-w-[300px]">
              <label className="text-center">التاريخ </label>
              <input
                required
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                }}
                type="date"
                className="w-full md:w-[300px]"
              />
            </div>
          </div>
        </div>
        {tickets.map((_, index) => (
          <div key={index}>
            <Seperator text={`تذكرة رقم ${index + 1}`} />
            <div className="w-full flex md:flex-row flex-col gap-5 py-6">
              <div className="md:w-[50%] w-full flex justify-center">
                <div className="flex flex-col gap-2 w-full max-w-[300px]">
                  <label className="text-center">نوع الحديد</label>
                  <select
                    required
                    className="w-full md:w-[300px]"
                    value={tickets[index].ironName}
                    onChange={(e) => {
                      const updatedTickets = [...tickets];
                      updatedTickets[index].ironName = e.target.value;
                      setTickets(updatedTickets);
                    }}
                  >
                    <option value="">نوع الحديد</option>
                    <option value="السويس للصلب">السويس للصلب</option>
                    <option value="الجارحي">الجارحي</option>
                    <option value="عز">عز</option>
                    <option value="مصريين">مصريين</option>
                    <option value="بشاي">بشاي</option>
                    <option value="مركبي">مركبي</option>
                    <option value="المدينة">المدينة</option>
                    <option value="العلا">العلا</option>
                    <option value="جيوشي">جيوشي</option>
                    <option value="عنتر">عنتر</option>
                    <option value="مصر ستيل">مصر ستيل</option>
                    <option value="العربيه">العربيه</option>
                    <option value="بيانكو">بيانكو</option>
                    <option value="عشري">عشري</option>
                    <option value="عياد">عياد</option>
                    <option value="اركو ستيل">اركو ستيل</option>
                    <option value="اكتوبر ستيل">اكتوبر ستيل</option>
                    <option value="الكومي">الكومي</option>
                  </select>
                </div>
              </div>
              <div className="md:w-[50%] w-full flex justify-center">
                <div className="flex flex-col gap-2 w-full max-w-[300px]">
                  <label className="text-center">القطر </label>

                  <select
                    required
                    className="w-full"
                    value={tickets[index].radius}
                    onChange={(e) => {
                      const updatedTickets = [...tickets];
                      updatedTickets[index].radius = e.target.value;
                      setTickets(updatedTickets);
                    }}
                  >
                    <option>اختر قطر</option>
                    <option>6</option>
                    <option>8</option>
                    <option>10</option>
                    <option>12</option>
                    <option>14</option>
                    <option>16</option>
                    <option>18</option>
                    <option>20</option>
                    <option>22</option>
                    <option>25</option>
                    <option>32</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="w-full flex md:flex-row flex-col gap-5 py-6">
              <div className="md:w-[50%] w-full flex justify-center">
                <div className="flex flex-col gap-2 w-full max-w-[300px]">
                  <label className="text-center">الوزن المطلوب</label>
                  <input
                    required
                    type="text"
                    placeholder="الوزن المطلوب"
                    value={tickets[index].neededWeight}
                    onChange={(e) => {
                      const updatedTickets = [...tickets];
                      updatedTickets[index].neededWeight = e.target.value;
                      setTickets(updatedTickets);
                    }}
                  />
                </div>
              </div>
              <div className="md:w-[50%] w-full flex justify-center">
                <div className="flex flex-col gap-2 w-full max-w-[300px]">
                  <label className="text-center">السعر</label>
                  <input
                    required
                    type="text"
                    placeholder=" السعر"
                    value={tickets[index].totalPrice}
                    onChange={(e) => {
                      const updatedTickets = [...tickets];
                      updatedTickets[index].totalPrice = e.target.value;
                      setTickets(updatedTickets);
                    }}
                  />
                </div>
              </div>
            </div>
            {tickets.length > 1 && (
              <button
                className="iron-btn remove"
                onClick={(e) => {
                  e.preventDefault();
                  setTickets((prev) => prev.filter((_, i) => i !== index));
                }}
              >
                ازاله تذكرة رقم {index + 1}
              </button>
            )}{" "}
          </div>
        ))}
        <button
          className="iron-btn add-btn"
          onClick={(e) => {
            e.preventDefault();
            setTickets((prev) => [
              ...prev,
              { ironName: "", radius: "", neededWeight: "", price: "" },
            ]);
          }}
        >
          اضافه تذكرة
        </button>
        <button
          type="submit"
          className="iron-btn max-w-[300px] bg-[greenyellow]"
        >
          انشاء طلب
        </button>
      </form>
    </div>
  );
};

export default OrderModal;

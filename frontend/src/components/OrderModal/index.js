import React, { useEffect, useState } from "react";
import Seperator from "../Seperator";

const OrderModal = ({ onClose }) => {
  const [ticketNumber, setTicketNumber] = useState(1);
  const [clientInfo, setClientsInfo] = useState([]);
  const [ironInfo, setIronInfo] = useState([]);
  const [ironRadius, setIronRadius] = useState();
  useEffect(() => {
    const getClientsInfo = async () => {
      const response = await fetch(
        "http://localhost:8000/clients/getClientsInfo",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const json = await response.json();
      setClientsInfo(json);
    };
    const getIronStorage = async () => {
      const response = await fetch(
        "http://localhost:8000/irons/getIronStorage",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const json = await response.json();
      setIronInfo(json);
    };
    getClientsInfo();
    getIronStorage();
  }, []);
  return (
    <div dir="rtl" className="modal">
      <span
        className="displayHidden"
        onClick={onClose}
        style={{ fontSize: "30px", cursor: "pointer" }}
      >
        &times;
      </span>
      <Seperator text="بيانات اوردر خارج" />
      <form className="w-full px-4 pt-6">
        <div className="w-full flex md:flex-row flex-col gap-5 pb-6">
          <div className="md:w-[50%] w-full flex justify-center">
            <div className="flex flex-col gap-2 ">
              <label className="text-center">أسم العميل</label>
              <select className="w-full md:w-[300px]">
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
            <div className="flex flex-col gap-2">
              <label className="text-center">التاريخ </label>
              <input type="date" className="w-full md:w-[300px]" />
            </div>
          </div>
        </div>
        {Array.from({ length: ticketNumber }, (_, index) => (
          <div key={index}>
            <Seperator text={`وزنة رقم ${index + 1}`} />
            <div className="w-full flex md:flex-row flex-col gap-5 pb-6">
              <div className="md:w-[50%] w-full flex justify-center">
                <div className="flex flex-col gap-2 ">
                  <label className="text-center">نوع الحديد</label>
                  <select className="w-full md:w-[300px]">
                    <option value="">نوع الحديد</option>
                    {ironInfo.map((client) => (
                      <option key={ironInfo.id} value={ironInfo.name}>
                        {ironInfo.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="md:w-[50%] w-full flex justify-center">
                <div className="flex flex-col gap-2">
                  <label className="text-center">القطر </label>
                  {/* <input type="date" className="w-full md:w-[300px]" /> */}
                  <select
                    value={ironRadius}
                    onChange={(e) => setIronRadius(e.target.value)}
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
          </div>
        ))}
      </form>
    </div>
  );
};

export default OrderModal;

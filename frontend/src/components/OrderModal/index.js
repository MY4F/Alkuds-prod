import React, { useEffect, useState } from "react";
import Seperator from "../Seperator/index";
import { useClientContext } from "../../hooks/useClientContext";
import swal from "sweetalert";
import LoadingButton from "../../SharedComponents/LoadingButton";
import { useSocketContext } from "../../hooks/useSocket";
import { useUnfinishedTicketsContext } from "../../hooks/useUnfinishedTicketsContext";
import { useUserContext } from "../../hooks/useUserContext";
const OrderModal = ({ onClose, type, closeFun }) => {
  const [price, setPrice] = useState(0);
  const [date, setDate] = useState();
  const [selectedClientName, setSelectedClientName] = useState('');
  const [clients, setClients] = useState("اختر عميل");
  const { client } = useClientContext();
  const [adding, setAdding] = useState(false);
  const [deliveryFees, setDeliveryFees] = useState(0);
  const { unfinishedTickets, dispatch } = useUnfinishedTicketsContext();
  const {user} = useUserContext()
  const [password, setPassword] = useState("")
  const [tickets, setTickets] = useState([
    { ironName: "", radius: "", neededWeight: "", unitPrice: "" },
  ]);
  const { socket } = useSocketContext();
 
  useEffect(()=>{},[

  ])

  const HandleFormSubmission = async (e) => {
    setAdding(true);
    e.preventDefault();
    const data = {
      clientId: clients,
      totalPrice: 0,
      date: date,
      ticket: tickets,
      type: type,
      deliveryFees: deliveryFees,
      clientName: selectedClientName,
      password
    };
    try {
      const response = await fetch("/order/addOrder", {
        // Update port if different
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to add order");

      const result = await response.json();
      if(response.ok){
        if(!("exceededIronArr" in result)){
          await socket.emit("send_order_creation", {
            message: "Order Printed Successfully",
            room: "123",
            order: result,
          });
          dispatch({type:"ADD_TICKET",payload: [result]})
          swal({
            text: "تم انشاء طلب بنجاح",
            icon: "success",
          }).then(e=>{
            setAdding(false)
            closeFun()
          });
        }
        else{
          let errStr = ""
          for(let i of result.exceededIronArr){
            errStr += i
          }
          swal({
            text: "لم يتم انشاء الاوردر لعدم وجود حديد كافي: " + errStr,
            icon: "error",
          }).then(e=>{
            setAdding(false)
            closeFun()
          });
        }
      }
    } catch (error) {
      swal({
        text: "حدث خطأ ما برجاء المحاولة مرة اخرى",
        icon: "error",
        buttons: "حاول مرة اخرى",
      }).then(e=>{
          setAdding(false)
          closeFun()
        }
      );
    }
  };


  return (
    <div dir="rtl">
      <Seperator text={`بيانات طلب ${type == "in" ? "وارد" : "خارج"}`} />
      <form className="w-full px-4 pt-6" onSubmit={HandleFormSubmission}>
        <div className="w-full flex md:flex-row flex-col gap-5 pb-6">
          <div className="md:w-[33%] w-full flex justify-center">
            <div className="flex flex-col gap-2 w-full max-w-[300px]">
              <label className="text-center">أسم العميل</label>
              <input 
                name="clientsList"
                list="clients"
                placeholder="ابحث ..."
                className="w-full md:w-[300px]"
                onChange={(e) => {
                  const selectedName = e.target.value;
                  setSelectedClientName(selectedName)
                  const selectedClient = Object.values(client).find(c => c.name === selectedName);
                  if(selectedClient){
                    console.log(selectedClient["clientId"])
                    setClients(selectedClient["clientId"]);
                  }
                }}
                type=""
                required />
                <datalist id="clients">
                    {client &&
                      [...Object.keys(client)].map((i, idx) => 
                        
                      {  
                        if(type ==="in" && client[i].isFactory){
                          return <option value={client[i].name}>
                          {" "}
                          {client[i].clientId}{" "}
                          </option>
                        }
                        else if(type ==="out" && client[i].isClient && !client[i].isKudsPersonnel){
                          return <option value={client[i].name}>
                          {" "}
                          {client[i].clientId}{" "}
                          </option>
                        }
                      })}
                </datalist>
            </div>
          </div>
          <div className="md:w-[33%] w-full flex justify-center">
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
          {/* <div className="md:w-[33%] w-full flex justify-center">
            <div className="flex flex-col gap-2 w-full max-w-[300px]">
              <label className="text-center">كلمه السر لبضاعه اول الشهر </label>
              <input
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                type="password"
                className="w-full md:w-[300px]"
              />
            </div>
          </div> */}
          {type === 'out' && <div className="md:w-[33%] w-full flex justify-center">
            <div className="flex flex-col gap-2 w-full max-w-[300px]">
              <label className="text-center">المشال</label>
              <input
                required
                value={deliveryFees}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*\.?\d*$/.test(value)) {
                    setDeliveryFees(value);
                  }
                }}
                type="text"
                className="w-full md:w-[300px]"
                placeholder="المشال"
              />
            </div>
          </div>}
        </div>
        {tickets.map((_, index) => (
          <div key={index}>
            <Seperator text={`تذكرة رقم ${index + 1}`} />
            <div className="w-full flex md:flex-row flex-col gap-5 py-6">
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
                    <option value="حديدنا">حديدنا</option>
                    <option value="السويس للصلب">السويس للصلب</option>
                    <option value="الجارحي">الجارحي</option>
                    <option value="عز">عز</option>
                    <option value="مصريين">مصريين</option>
                    <option value="بشاي">بشاي</option>
                    <option value="مراكبي">مراكبي</option>
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
                      const value = e.target.value;
                      if (/^\d*\.?\d*$/.test(value)) {
                        const updatedTickets = [...tickets];
                        updatedTickets[index].neededWeight = e.target.value;
                        setTickets(updatedTickets);
                      }
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
                    value={tickets[index].unitPrice}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*\.?\d*$/.test(value)) {
                        const updatedTickets = [...tickets];
                        updatedTickets[index].unitPrice = value;
                        setTickets(updatedTickets);
                      }
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
        <LoadingButton
          loading={adding}
          defaultText="انشاء طلب"
          loadingText="يتم انشاء الطلب ..."
          className="bg-[greenyellow]"
        />
      </form>
    </div>
  );
};

export default OrderModal;

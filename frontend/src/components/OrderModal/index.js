import React, { useEffect, useState } from "react";
import Seperator from "../Seperator/index";
import { useClientContext } from "../../hooks/useClientContext";
import swal from "sweetalert";
import LoadingButton from "../../SharedComponents/LoadingButton";
import { useSocketContext } from "../../hooks/useSocket";
import { useUnfinishedTicketsContext } from "../../hooks/useUnfinishedTicketsContext";
import { useUserContext } from "../../hooks/useUserContext";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { useDriverContext } from "../../hooks/useDriverContext";
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
  const [personName, setPersonName] = useState([]);
  const { driver } = useDriverContext();
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };
  
  console.log(driver)

  const names = [
    'Oliver Hansen',
    'Van Henry',
    'April Tucker',
    'Ralph Hubbard',
    'Omar Alexander',
    'Carlos Abbott',
    'Miriam Wagner',
    'Bradley Wilkerson',
    'Virginia Andrews',
    'Kelly Snyder',
  ];
  const { socket } = useSocketContext();
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleCloseDialog = () => {
    setOpen(false);
  };

  useEffect(()=>{},[

  ])

  const HandleFormSubmission = async (e) => {
    setAdding(true);
    handleClickOpen()
    e.preventDefault();
  };


  return (
    <div dir="rtl">
      <Seperator text={`بيانات طلب ${type == "in" ? "وارد" : "خارج"}`} />
      <Dialog
        open={open}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"انشاء اوردر جديد"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
             هل تريد انشاء اوردر جديد بهذه المعايير المكتوبه ادني:
          </DialogContentText>
          <DialogContentText id="alert-dialog-description">
            {
              tickets.map((i,idx)=>{
                return ( 
                  <div style={{direction:"rtl"}}>
                    <Seperator text={`تفاصيل التذكره رقم ${idx+1}`} />
                    <h4> نوع الحديد : {i.ironName} </h4>
                    <h4> قطر : {i.radius} </h4>
                    <h4> الوزن المطلوب : {parseFloat(i.neededWeight).toLocaleString()} </h4>
                    <h4> السعر : {parseFloat(i.unitPrice).toLocaleString()} </h4>
                  </div> 
                )
              })
            }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={(e) => {
            handleCloseDialog()
            setAdding(false)
          }}>الغاء</Button>
          <Button onClick={async(e) =>{
              handleCloseDialog()
              let driversArr = []
              for(let d of driver){
                if(personName.includes(d.name))
                driversArr.push({
                  name: d.name,
                  number: d.mobile
                })
              }
              console.log(driversArr)
              const data = {
                clientId: clients,
                totalPrice: 0,
                date: date,
                ticket: tickets,
                type: type,
                deliveryFees: deliveryFees,
                clientName: selectedClientName,
                password,
                drivers: driversArr
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
              setAdding(false)
            }} autoFocus>
            موافق
          </Button>
        </DialogActions>
      </Dialog>
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
              <label className="text-center">السائق  </label>
              <FormControl>
                <InputLabel id="demo-multiple-checkbox-label">سائق</InputLabel>
                <Select
                  labelId="demo-multiple-checkbox-label"
                  id="demo-multiple-checkbox"
                  multiple
                  value={personName}
                  onChange={handleChange}
                  input={<OutlinedInput label="اختر سائق" />}
                  renderValue={(selected) => selected.join(', ')}
                  style={{"backgroundColor":"white"}}
                >
                  {driver && driver.map((d,idx) => (
                    <MenuItem key={idx} value={d.name}>
                      <Checkbox checked={personName.includes(d.name)} />
                      <ListItemText primary={d.name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
          
          <div className="md:w-[33%] w-full flex justify-center">
            <div className="flex flex-col gap-2 w-full max-w-[300px]">
              <label className="text-center">كلمه السر لبضاعه اول الشهر </label>
              <input
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                type="password"
                className="w-full md:w-[300px]"
              />
            </div>
          </div>
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

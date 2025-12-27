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
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { useDriverContext } from "../../hooks/useDriverContext";
import { confirmAlert } from "react-confirm-alert";
import axios from "axios";
import { usePreCreatedTicketsContext } from "../../hooks/usePreCreatedTicketsContext";
import { useAwaitForPaymentTicketsContext } from "../../hooks/useAwaitForPaymentTicketsContext";
const DownOrderModal = ({ preOrder, onClose, type, closeFun }) => {
  const [price, setPrice] = useState(0);
  const [date, setDate] = useState();
  const [selectedClientName, setSelectedClientName] = useState();
  const [clients, setClients] = useState("اختر عميل");
  const { client } = useClientContext();
  const [adding, setAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deliveryFees, setDeliveryFees] = useState(0);
  const { preCreatedTickets, dispatch } = usePreCreatedTicketsContext();
  const {
      awaitForPaymentTicketsContext,
      dispatch: awaitForPaymentTicketsContextUpdate,
    } = useAwaitForPaymentTicketsContext();
  const {user} = useUserContext()
  const [password, setPassword] = useState("")
  const [netWeight, setNetWeight] = useState(0);
  const [ironList, setIronList] = useState([])
  const [order,setOrder] = useState(preOrder)
  const [tickets, setTickets] = useState(preOrder!==null ? preOrder.ticket : [
    { ironName: "", radius: "", neededWeight: 0, unitPrice: "", netWeight: 0 ,weightAfter:0},
  ]);
  const { socket } = useSocketContext();
  const [firstWeight, setFirstWeight] = useState({weight: 0, date: ""});
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


  function confirmAsync() {
      return new Promise((resolve) => {
        confirmAlert({
          title: "هل تريد اعاده الوزنه مره اخري؟",
          message: "",
          buttons: [
            {
              label: "نعم",
              onClick: () => resolve(true),
            },
            {
              label: "لا",
              onClick: () => resolve(false),
            },
          ],
        });
      });
    }
  const updateFirstWeight = async (weight) => {
    if(!clients){
      window.alert("برجاء اختيار عميل من القائمه")
      return
    }
    let newCreatedOrder = await createNewOrder()
    const firstWeightUpdateFetch = await fetch("/order/EditPreOrderFirstWeight", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({ orderId: newCreatedOrder._id, firstWeight: weight }),
    });

    const firstWeightUpdate = await firstWeightUpdateFetch.json();

    if (firstWeightUpdateFetch.ok) {
    setOrder(firstWeightUpdate["orderUpdate"])
    console.log(firstWeightUpdate["orderUpdate"])
      console.log("Ticket Updated: ", firstWeightUpdate);
      dispatch({
        type: "SET_TICKETS",
        payload: {
          outOrders: firstWeightUpdate.outOrders,
          inOrders: firstWeightUpdate.inOrders,
        },
      });
    }
  };

  const updateTicket = async (newWeight, ticketId) => {
    console.log(ticketId);
    let newTicket = order.ticket[ticketId]
    let newOrder = order;
    if (ticketId > 0) {
      newTicket.weightBefore = order.ticket[ticketId - 1].weightAfter;
      newTicket.weightAfter = newWeight;
      newTicket.netWeight = Math.abs(newWeight - newTicket.weightBefore);
    } else {
      console.log(order)
      newTicket.weightBefore = order.firstWeight.weight;
      newTicket.weightAfter = newWeight;
      newTicket.netWeight = Math.abs(newWeight - order.firstWeight.weight);
    }
    newTicket.netWeightForProcessing = newTicket.netWeight;
    setNetWeight(newTicket.netWeight);

    let d = new Date().toLocaleString("en-EG", { timeZone: "Africa/Cairo" });
    let dateArr = d.split(",");
    newTicket.date = dateArr[0] + "," + dateArr[1];

    newOrder.ticket[ticketId] = newTicket;

    const ticketUpdateFetch = await fetch("/order/EditPreOrderTicket", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        orderId: order._id,
        ticket: newOrder.ticket,
        ticketId: ticketId,
      }),
    });

    const ticketUpdate = await ticketUpdateFetch.json();
    setOrder(ticketUpdate["orderUpdate"])
    setTickets(ticketUpdate["orderUpdate"].ticket)
    if (ticketUpdateFetch.ok) {
        setOrder(ticketUpdate["orderUpdate"])
        dispatch({
        type: "SET_TICKETS",
        payload: {
          outOrders: ticketUpdate.outOrders,
          inOrders: ticketUpdate.inOrders,
        },
      });
      console.log("Ticket Updated: ", ticketUpdate);
    } else if (
      ticketUpdateFetch.status === 400 &&
      ticketUpdate.error === "Not enough data of that iron available"
    ) {
      swal(
        `لا يوجد ما يكفي من الوزن لهذا الحديد لتغطية الوزن المطلوب.\nالوزن المتاح هو ${ticketUpdate.availableWeight} كجم.`,
        "",
        "error"
      );
    }
  };
    const handleGetFirstWeight = async (e, weight) => {
    let isYes = false;
    e.preventDefault();
    console.log("hehe", weight);
    if (weight > 0) {
      const isYes = await confirmAsync();
      if (!isYes) {
        console.log("User cancelled");
        return;
      }
    }
 
    setIsLoading(true);
    // const weightFetch = await fetch("/irons/getScaleWeight", {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${user.token}`,
    //   },
    // });

    // const weightJson = await weightFetch.json();
    // if (weightFetch.ok) {
    //   let d = new Date().toLocaleString("en-EG", { timeZone: "Africa/Cairo" });
    //   let dateArr = d.split(",");
    // }
    
    // setIsLoading(false);

    await axios
    .get("http://localhost:8000/irons/getScaleWeight") // local service running on user's PC
    .then(async(response) => {
      let newWeight = response.data.weight;
      await updateFirstWeight(newWeight);
      setIsLoading(false);
    })
    .catch((error) => {
      console.error("Error reaching local API:", error);
    });

  };

  
  const createNewOrder  = async(e)=>{
    let driversArr = []
    for(let d of driver){
      if(personName.includes(d.name))
      driversArr.push({
        name: d.name,
        number: d.mobile
      })
    }
    if(user && user.user.msg.name === "Hassan")
      tickets.shift()
    const data = {
      clientId: clients,
      totalPrice: 0,
      firstWeight: firstWeight,
      date: date,
      ticket: tickets,
      type: type,
      deliveryFees: deliveryFees,
      clientName: selectedClientName,
      password,
      drivers: driversArr,
      isDown:true
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
      setAdding(false)
        return result

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
  }


const handleGetWeight = async (e, idx, weight) => {
    e.preventDefault();
    // if (weight > 0) {
    //   const isYes = await confirmAsync();
    //   if (!isYes) {
    //     console.log("User cancelled");
    //     return;
    //   }
    // }



    if (weight > 0) {
      const isYes = await confirmAsync();
      if (!isYes) {
        console.log("User cancelled");
        return;
      }
    }
    
    setIsLoading(true);
    // const response = await fetch("/irons/getScaleWeight", {
    //     method: "GET",
    //     headers: {
    //       "Content-Type": "application/json",
    //       'Authorization': `Bearer ${user.token}`
    //     },
    // });
    // let jsonAns = await response.json();
    // if (response.ok) {

    //     await updateTicket( jsonAns["weight"], idx);
    //     setIsLoading(false);
    // }

    await axios
    .get("http://localhost:8000/irons/getScaleWeight") // local service running on user's PC
    .then(async(response) => {
      let newWeight = response.data.weight;
      await updateTicket( newWeight, idx);
      setIsLoading(false);
    })
    .catch((error) => {
      console.error("Error reaching local API:", error);
    });

  };

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
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleCloseDialog = () => {
    setOpen(false);
  };

  useEffect(()=>{
    socket.on("receive_order_new_state", async (info) => {
      console.log(info);
      if (info.order === null) {
        swal(info.message, "تم طباعه اذن الاستلام بنجاح .", "success");
      } else {
        swal(
          info.message,
          "تم طباعه اذن الاستلام بنجاح و ايضا تغير حاله الاوردر لجاري انتظار الدفع.",
          "success"
        );
      }
        console.log("here", info.order);
        dispatch({ type: "DELETE_TICKET", payload: [info.order] });
        awaitForPaymentTicketsContextUpdate({
          type: "ADD_TICKET",
          payload: [info.order],
        });
    });
    const getIronList = async() =>{
      const response = await fetch('/irons/getIronList',{
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${user.token}`
          }
      });

      let data = await response.json()

      if(response.ok){
        setIronList(data)
      }
    }
    getIronList()
  },[order])

  const HandleFormSubmission = async (e) => {
    setAdding(true);
    handleClickOpen()
    e.preventDefault();
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    closeFun()
    window.open(
      "http://localhost:3000/print/" +
        "false" +
        "/" +
        order._id,
      "_blank"
    );
    // window.open("https://alquds1-f4054fcbf7e6.herokuapp.com/print/"+ "false" + "/" + order._id,"_blank")
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
                    <h4> الوزن المطلوب : {user.user.msg.name === "Hassan" ? parseFloat(i.netWeight).toLocaleString():parseFloat(i.neededWeight).toLocaleString()} </h4>
                    {user.user.msg.name !== "Hassan"  && <h4> السعر : {parseFloat(i.unitPrice).toLocaleString()} </h4>}
                  </div> 
                )
              })
            }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={(e) => {
            setAdding(false)
            handleCloseDialog()
          }}>الغاء</Button>
          <Button onClick={async(e) =>{
              handleCloseDialog()
              await handleSubmit(e)
              handleCloseDialog()

            }} autoFocus>
            موافق
          </Button>
        </DialogActions>
      </Dialog>
      <form className="w-full px-4 pt-6" onSubmit={HandleFormSubmission}>
        {!preOrder && <div className="w-full flex md:flex-row flex-col gap-5 pb-6">
          <div className="md:w-[33%] w-full flex justify-center">
            <div className="flex flex-col gap-2 w-full max-w-[300px]">
              <label className="text-center">أسم العميل</label>
              <input 
                name="clientsList"
                list="clients"
                value={selectedClientName}
                placeholder="ابحث ..."
                className="w-full md:w-[300px]"
                onChange={(e) => {
                  const selectedName = e.target.value;
                  setSelectedClientName(selectedName)
                  const selectedClient = Object.values(client).find(c => c.name === selectedName);
                    if(selectedClient){
                    console.log(selectedClient["clientId"])
                    setClients(selectedClient["clientId"]);
                    // clear any previous custom validity message so the form can be submitted
                    e.target.setCustomValidity("");
                    } else {
                    // invalid entry (not from the datalist) -> prevent form submission
                    setClients(null);
                    e.target.setCustomValidity("الرجاء اختيار عميل من القائمة");
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
          
          {  user.user.msg.name === "Ziad" &&  <div className="md:w-[33%] w-full flex justify-center">
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
          </div>}
          
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
        </div>}
        <div className="w-full flex md:flex-row flex-col gap-5 pb-6">
              <div className="md:w-[50%] w-full flex justify-center">
                <div className="flex flex-col gap-2 ">
                  <label htmlFor="weight">  الوزنه الاولي </label>
                  <input
                    name="weight"
                    type="text"
                    value={order!=null?order.firstWeight.weight:0}
                    readOnly
                  />
                </div>
              </div>
              <div className="md:w-[50%] w-full flex justify-center">
                <div className="flex flex-col gap-2 justify-end">
                  <button
                    onClick={(e) =>{
                            if(!isLoading ){
                                handleGetFirstWeight(e,order!=null?order.firstWeight.weight:0)
                            }
                        }
                    }
                    className="iron-btn"
                  >
                    {isLoading ? <CircularProgress /> : " تحميل الوزن"}{" "}
                  </button>
                </div>
              </div>
        </div>
        {tickets.map((item, index) => (
          <div key={index}>
            <Seperator text={`تذكرة رقم ${index + 1}`} />
           { <div className="w-full flex md:flex-row flex-col gap-5 py-6">
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
                      const updatedTickets2 = [...order.ticket];
                      updatedTickets2[index].radius = e.target.value;
                      order.ticket = updatedTickets2
                      setOrder(order)
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
                      const updatedTickets2 = [...order.ticket];
                      updatedTickets2[index].ironName = e.target.value;
                      order.ticket = updatedTickets2
                      setOrder(order)
                    }}
                  >
                    <option value="">نوع الحديد</option>
                    {ironList &&
                      ironList.map((i,idx)=>(
                        <option value={i}>{i}</option>
                      ))
                    }
                    {/* <option value="حديدنا">حديدنا</option>
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
                    <option value="الكومي">الكومي</option> */}
                  </select>
                </div>
              </div>
            </div>}
            <div className="w-full flex md:flex-row flex-col gap-5 pb-6">
              <div className="md:w-[50%] w-full flex justify-center">
                <div className="flex flex-col gap-2 ">
                  <label htmlFor="weight">  الوزنه </label>
                  <input
                    name="weight"
                    type="text"
                    value={tickets[index].weightAfter}
                    readOnly
                  />
                </div>
              </div>
              <div className="md:w-[50%] w-full flex justify-center">
                <div className="flex flex-col gap-2 ">
                  <label htmlFor="weight"> صافي الوزن </label>
                  <input
                    name="weight"
                    type="text"
                    value={tickets[index].netWeight}
                    readOnly
                  />
                </div>
              </div>
             <div className="md:w-[50%] w-full flex justify-center">
                <div className="flex flex-col gap-2 justify-end">
                  <button
                    onClick={(e) =>{
                            if(!isLoading ){
                                handleGetWeight(e, index, tickets[index].weightAfter)
                            }
                        }
                    }
                    className="iron-btn"
                  >
                    {isLoading ? <CircularProgress /> : " تحميل الوزن"}{" "}
                  </button>
                </div>
              </div>
            </div>
            { user.user.msg.name !== "Hassan" && <div className="w-full flex md:flex-row flex-col gap-5 py-6">
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
            </div>}
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
              { ironName: "", radius: "", neededWeight: 0, price: "", netWeight, weightAfter:0 },
            ]);
            order.ticket.push({ ironName: "", radius: "", neededWeight: 0, price: "", netWeight: 0 ,weightAfter:0}) 
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

export default DownOrderModal;

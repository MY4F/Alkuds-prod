import { useWalletContext } from "../hooks/useWalletContext";
import { useClientContext } from "../hooks/useClientContext";
import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import swal from 'sweetalert';
import { useAwaitForPaymentTicketsContext } from "../hooks/useAwaitForPaymentTicketsContext";
import { useSocketContext } from "../hooks/useSocket";
import { useUnfinishedTicketsContext } from "../hooks/useUnfinishedTicketsContext";
import { useFinishedTicketsContext } from "../hooks/useFinishedTicketsContext";
import { useUserContext } from "../hooks/useUserContext";
const CashInput = (props) => {
  const { isKudsPersonnel, isCheque } = props
  const [selectedClient, setSelectedClient] = useState("اختر عميل");
  const [selectedType, setSelectedType] = useState("نوع العمليه");
  const [notes, setNotes] = useState(" ");
  const [amount, setAmount] = useState("");
  const { socket } = useSocketContext()
  const [selectedBank, setSelectedBank] = useState();
  const [selectedCheque, setSelectedCheque] = useState("");
  const [selectedChequeName, setSelectedChequeName] = useState();
  const { client, dispatch: clientUpdate } = useClientContext();
  const { wallet, dispatch: walletUpdate } = useWalletContext();
  const {user} = useUserContext()
  const { awaitForPaymentTickets, dispatch: awaitForPaymentTicketsUpdate} = useAwaitForPaymentTicketsContext();
  const { unfinishedTickets, dispatch: unfinishedTicketsUpdate } = useUnfinishedTicketsContext()
  const { finishedTickets , dispatch: finishedTicketsUpdate } = useFinishedTicketsContext()
  const [isLoading,setIsLoading] = useState(false)
  const [cheques, setCheques] = useState([])
  
  useEffect(()=>{
    if(wallet){
      let unDisbursedCheques = wallet["شيكات"].transactions.filter(tx => tx.isDisbursed === false);
      setCheques(unDisbursedCheques)
    }
  },[wallet, awaitForPaymentTickets,client,clientUpdate,walletUpdate,awaitForPaymentTicketsUpdate, selectedChequeName])
  
  if(client == null || wallet == null){
    return <div> Loading....</div>
  }

  const socketTransactionNotification = async(transaction) =>{
    await socket.emit("send_transaction", {
      message: "Transaction Proccessed successfully",
      room: "123",
      transaction_details: transaction,
    });
  }

  const handleKudsPersonnel = async(e) =>{
    e.preventDefault()
    setIsLoading(true)
    let newTransaction = {
      amount, notes, "bankName":selectedBank , clientId: selectedClient, type : selectedType
    }
    const addCompanyExpenseTransactionFetch = await fetch('/wallet/addCompanyExpenses',
      {
        method:"POST",
        body: JSON.stringify(newTransaction),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        }
      }
    )

    let addCompanyExpenseTransaction = await addCompanyExpenseTransactionFetch.json()
    setIsLoading(false)
    if(addCompanyExpenseTransactionFetch.ok){
        swal ( "تم اضافعه العمليه بنجاح." ,  "تم تحديث البانات الماليه" ,  "success" )
        console.log(addCompanyExpenseTransaction)
        setSelectedBank("اختر البنك")
        setSelectedClient("اختر عميل")
        setSelectedType("نوع العمليه")
        setAmount("")
        setNotes("")
        clientUpdate({ type: "UPDATE_CLIENT", payload: addCompanyExpenseTransaction.client })
        if(addCompanyExpenseTransaction.bank !== null)
          walletUpdate({ type: "UPDATE_WALLET", payload: addCompanyExpenseTransaction.bank })
    }
    else{
        swal ( "حدث عطل، الرجاء التآكد من الاتصال بالنت." , "حاول مجددا بعد قليل." ,  "error" )
    }
  }

  const handleSubmit = async (e, isCheque) => {
    e.preventDefault()
    setIsLoading(true)
    let newTransaction = {
        amount, notes,"orderId":" ","type" : selectedType, "clientId":selectedClient, "bankName":selectedBank
      }
      if (isCheque)
        newTransaction["chequeId"]= selectedCheque
      const addTransactionFetch = await fetch(!isCheque?'/wallet/addTransaction':'/wallet/addChequeTransaction' ,
        {
          method:"POST",
          body: JSON.stringify(newTransaction),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          }
        }
      )
  
      let addTransaction = await addTransactionFetch.json()
      setIsLoading(false)
      if(addTransactionFetch.ok){
          swal ( "تم اضافعه العمليه بنجاح." ,  "تم تحديث البانات الماليه" ,  "success" )
          console.log(addTransaction)
          setSelectedBank("اختر البنك")
          setSelectedClient("اختر عميل")
          setSelectedType("نوع العمليه")
          setAmount("")
          setNotes("")
          let awaitingOrders = [], unfinishedOrders = [], finishedOrders = []
          for(let i of addTransaction.orders){
            if(i.state === 'جاري انتظار التحميل'){
              unfinishedOrders.push(i)
            }
            else if(i.state === 'جاري انتظار الدفع'){
              awaitingOrders.push(i)
            }
            else if (i.state === 'منتهي'){
              finishedOrders.push(i)
            }
          }

          if(unfinishedOrders.length>0){
            console.log("unfinishedOrders")
            unfinishedTicketsUpdate({ type: "UPDATE_TICKET", payload: addTransaction.orders })
          }
          if(awaitForPaymentTickets.length> 0){
            console.log("awaitForPaymentTickets")

            unfinishedTicketsUpdate({ type: "DELETE_TICKET", payload: addTransaction.orders })
            awaitForPaymentTicketsUpdate({ type: "UPDATE_TICKET", payload: addTransaction.orders })
          }
          if(finishedOrders.length>0){
            console.log("finishedOrders")

            unfinishedTicketsUpdate({ type: "DELETE_TICKET", payload: addTransaction.orders })
            awaitForPaymentTicketsUpdate({ type: "DELETE_TICKET", payload: addTransaction.orders })
            finishedTicketsUpdate({type:"UPDATE_TICKET", payload: addTransaction.orders})
          }
          if (addTransaction.client !==null)
            clientUpdate({ type: "UPDATE_CLIENT", payload: addTransaction.client })

          if (addTransaction.bank !==null)
          walletUpdate({ type: "UPDATE_WALLET", payload: addTransaction.bank })

          socketTransactionNotification(addTransaction.bank)
      }
      else{
          swal ( "حدث عطل، الرجاء التآكد من الاتصال بالنت." , "حااول مجددا بعد قليل." ,  "error" )
      }
    
  }

  return (
    <form className="w-full px-4 pt-6 flex-nowrap" onSubmit={e => {
      if(isKudsPersonnel){
        handleKudsPersonnel(e)
      }
      else{
        handleSubmit(e,isCheque)
      }
    }}>
      {!isLoading ? <div
        style={{ direction: "rtl" }}
        className="w-full flex md:flex-row flex-col gap-5 pb-6 cash-holder overflow-y-auto"
      >
        <div className="md:w-[50%] w-full flex justify-center">
          <div className="flex flex-col gap-2 w-full max-w-[300px]">
            <label className="text-center">نوع العمليه</label>
            <select
              required
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
              }}
            >
              <option value="">نوع العمليه</option>
              <option value="استلام من">استلام من</option>
              <option value="تحويل الي">تحويل الي</option>
              { isCheque && <option value="صرف شيك">صرف شيك</option>}
              { !isKudsPersonnel && !isCheque &&<option value="اكراميه">اكراميه</option>}
              {!isKudsPersonnel && !isCheque &&<option value="خصم">خصم</option>}
            </select>
          </div>
        </div>
       { ((isCheque && selectedType !== 'صرف شيك') || !isCheque) && <div className="md:w-[50%] w-full flex justify-center">
          <div className="flex flex-col gap-2 w-full max-w-[300px]">
            <label className="text-center">أسم العميل</label>
              
                <input 
                  name="clientsList"
                  list="clients"
                  placeholder="ابحث ..."
                  className="w-full md:w-[300px]"
                  onChange={(e) => {
                    let selectedName = e.target.value
                    const selectedClient = Object.values(client).find(c => c.name === selectedName);
                    if(selectedClient){
                      setSelectedClient(selectedClient["clientId"]);
                    }
                  }}
                  type=""
                  required
                />
                <datalist id="clients">
                    {client &&
                      [...Object.keys(client)].map((i, idx) => 
                        
                      { 
                        if(isKudsPersonnel && client[i].isKudsPersonnel){
                          return <option value={client[i].name}> {client[i].clientId} </option>
                        }
                        else if(!isKudsPersonnel && !client[i].isKudsPersonnel){
                          return <option value={client[i].name}> {client[i].clientId} </option>
                        }
                      })}
                </datalist>
          </div>
        </div>}

       {(isCheque && (selectedType === 'تحويل الي' || selectedType === 'صرف شيك'))? 
       <div className="md:w-[50%] w-full flex justify-center">
        <div className="flex flex-col gap-2 w-full max-w-[300px]">
          <label className="text-center">الشيكات</label>
          <select
                value={selectedChequeName}
                onChange={(e) => {
                  let selectedId = e.target.value.split('-|-')[0]
                  let selectedAmount = e.target.value.split('-|-')[1]
                  let selectedName = e.target.value.split('-|-')[2]
                  console.log(selectedId,selectedAmount,selectedName)
                  setSelectedChequeName(e.target.value)
                  setSelectedCheque(selectedId);
                  setAmount(parseInt(selectedAmount))
                }}
              >
                <option value="اختر الشيك">اختر من الشيكات</option>
                {cheques &&
                cheques.map((i, idx) => (
                    <option value={i._id.toString()+'-|-'+i.amount.toString()+"-|-"+ client[i.clientId].name}> {client[i.clientId].name} {i.amount} </option>
                  ))}
              </select>
        </div> 
       </div>
       :
       <div className="md:w-[50%] w-full flex justify-center">
          <div className="flex flex-col gap-2 w-full max-w-[300px]">
            <label className="text-center">المبلغ</label>
            <input
              required
              type="number"
              placeholder="ادخل المبلغ"
              value={amount.toString()}
              onChange={(e) => {
                setAmount(parseInt(e.target.value));
              }}
            />
          </div>
        </div>}
        { ((isCheque && selectedType !== 'تحويل الي' && selectedType !== 'استلام من' ) || !isCheque) && <div className="md:w-[50%] w-full flex justify-center">
          <div className="flex flex-col gap-2 w-full max-w-[300px]">
            <label className="text-center">البنك</label>
            <select
              required
              value={selectedBank}
              onChange={(e) => {
                setSelectedBank(e.target.value);
              }}
            >
              <option disabled>أسم البنك</option>
              {wallet &&
                [...Object.keys(wallet)].map((i, idx) => (
                  <option value={wallet[i].bankName}> {wallet[i].bankName} </option>
                ))}
            </select>
          </div>
        </div>}
        <div className="md:w-[50%] w-full flex justify-center">
          <div className="flex flex-col gap-2 w-full max-w-[300px]">
            <label className="text-center">ملاحظات</label>
            <textarea
              placeholder="ادخل ملاحظات عن العمليه"
              value={notes}
              style={{ background: "#D3D3D3", borderRadius: "5px" }}
              onChange={(e) => {
                setNotes(e.target.value);
              }}
            />
          </div>
        </div>
      </div> : <CircularProgress/>}
      <button type="submit" className="iron-btn max-w-[300px] bg-[greenyellow]">
        اضف العمليه
      </button>
    </form>
  );
};

export default CashInput;

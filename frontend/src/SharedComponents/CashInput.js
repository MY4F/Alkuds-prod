import { useWalletContext } from "../hooks/useWalletContext";
import { useClientContext } from "../hooks/useClientContext";
import { useState } from "react";

const CashInput = () => {
  const [selectedClient, setSelectedClient] = useState("اختر عميل");
  const [selectedType, setSelectedType] = useState("نوع العمليه");
  const [notes, setNotes] = useState();
  const [amount, setAmount] = useState("");
  const [selectedBank, setSelectedBank] = useState("اختر البنك");
  const { client } = useClientContext();
  const { wallet } = useWalletContext();
  const handleSubmit = async () => {};
    console.log(wallet,client)
  if(client == null || wallet == null){
    return <div> Loading....</div>
  }

  return (
    <form className="w-full px-4 pt-6 flex-nowrap" onSubmit={handleSubmit}>
      <div
        style={{ direction: "rtl" }}
        className="w-full flex md:flex-row flex-col gap-5 pb-6 cash-holder overflow-y-auto"
      >
        <div className="md:w-[50%] w-full flex justify-center">
          <div className="flex flex-col gap-2 w-full max-w-[300px]">
            <label className="text-center">أسم العميل</label>
            <select
              required
              value={selectedClient}
              onChange={(e) => {
                setSelectedClient(e.target.value);
              }}
            >
              <option value="">أسم العميل</option>
              {client &&
                [...Object.keys(client)].map((i, idx) => (
                  <option value={client[i].clientId}> {client[i].name} </option>
                ))}
            </select>
          </div>
        </div>
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
              <option value="in">مدين</option>
              <option value="out">دائن</option>
            </select>
          </div>
        </div>
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
        </div>
        <div className="md:w-[50%] w-full flex justify-center">
          <div className="flex flex-col gap-2 w-full max-w-[300px]">
            <label className="text-center">البنك</label>
            <select
              required
              value={selectedBank}
              onChange={(e) => {
                setSelectedBank(e.target.value);
              }}
            >
              <option value="">أسم البنك</option>
              {wallet &&
                [...Object.keys(wallet)].map((i, idx) => (
                  <option value={wallet[i].bankName}> {wallet[i].bankName} </option>
                ))}
            </select>
          </div>
        </div>
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
      </div>
      <button type="submit" className="iron-btn max-w-[300px] bg-[greenyellow]">
        اضف العمليه
      </button>
    </form>
  );
};

export default CashInput;

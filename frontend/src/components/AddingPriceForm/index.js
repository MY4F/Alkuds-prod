// import LoadingButton from "../SharedComponents/LoadingButton";
import LoadingButton from "../../SharedComponents/LoadingButton";
import { useWalletContext } from "../../hooks/useWalletContext";

import React from "react";
import { useState } from "react";
import swal from "sweetalert";

function AddingPriceForm({ alignment, order }) {
  const [orderPaidAmount, setOrderPaidAmount] = useState();
  const [selectedBank, setSelectedBank] = useState("اختر البنك");
  const { wallet } = useWalletContext();
  const [adding, setAdding] = useState(false);

  const handleAddingMoney = async (e) => {
    e.preventDefault();
    setAdding(true);
    const data = {
      orderId: order._id,
      bankName: selectedBank,
      amount: orderPaidAmount,
      type: alignment,
    };
    try {
      const response = await fetch("/order/addOrderStatement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to add order");

      const result = await response.json();

      swal({ text: "تم الاضافة بنجاح", icon: "success" }).then(
        setAdding(false)
      );
    } catch (error) {
      swal({
        text: "حدث خطأ ما برجاء المحاولة مرة اخرى",
        icon: "error",
        buttons: "حاول مرة اخرى",
      }).then(setAdding(false));
    }
  };
  return (
    <form
      className="w-full flex flex-col items-center gap-5 justify-center"
      dir="rtl"
      onSubmit={handleAddingMoney}
    >
      <div className="flex flex-col gap-2 text-center">
        <label>المبلغ</label>
        <input
          value={orderPaidAmount}
          onChange={(e) => setOrderPaidAmount(e.target.value)}
          required
          type="text"
          placeholder="المبلغ"
        />
      </div>
      <div className="flex flex-col gap-2 text-center">
        <label>البنك</label>
        <select
          className="w-[300px]"
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
      <LoadingButton
        loading={adding}
        defaultText="اضافة مبلغ"
        loadingText="يتم الأضافة ..."
        className="custom-class"
      />
    </form>
  );
}

export default AddingPriceForm;

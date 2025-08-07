import { useUserContext } from "../hooks/useUserContext";
import Seperator from "../components/Seperator";
import React, { useEffect, useState } from "react";
import swal from "sweetalert";
import { useClientContext } from "../hooks/useClientContext";
const Settings = () => {
  const [driverName, setDriverName] = useState("");
  const [driverNumber, setDriverNumber] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [clientType, setClientType] = useState("");
  const {user} = useUserContext()
  const { dispatch } = useClientContext()

  useEffect(()=>{},[dispatch])

  const handleClientAdd = async (e) => {
    e.preventDefault();
    let obj = {
      name: clientName,
      address: clientAddress,
      isFactory: clientType,
    };
    const response = await fetch("/client/addClient", {
      method: "POST",
      body: JSON.stringify(obj),
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${user.token}`
      },
    });
    const json = await response.json();
    dispatch({ type: "UPDATE_CLIENT", payload: json })
    if (response.ok) swal("تم اضافعه عميل جديد بنجاح.", "", "success");
  };

  const handleDriverAdd = async (e) => {
    e.preventDefault();
    let obj = {
      name: driverName,
      mobile: driverNumber,
    };
    const response = await fetch("/driver/addDriver", {
      method: "POST",
      body: JSON.stringify(obj),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await response.json();
    console.log(json);
    if (json["msg"] === "success")
      swal("تم اضافعه العمليه بنجاح.", "تم تحديث البانات الماليه", "success");
  };

  return (
    <div className="setting-holder">
      <Seperator text="اضافة سائق جديد" />

      <form
        dir="rtl"
        className="setting-holder-form w-full"
        onSubmit={(e) => handleDriverAdd(e)}
      >
        <div className="flex flex-col lg:flex-row gap-5 w-full items-center justify-center">
          <div className="text-center flex flex-col gap-2 w-fit">
            <label htmlFor="name"> اسم السائق </label>
            <input
              name="name"
              type="text"
              value={driverName}
              onChange={(e) => setDriverName(e.target.value)}
              className="lg:w-[300px] w-full"
            />
          </div>
          <div dir="rtl" className="text-center flex flex-col gap-2 w-fit">
            <label htmlFor="number"> رقم السائق </label>
            <input
              name="number"
              type="text"
              value={driverNumber}
              onChange={(e) => setDriverNumber(e.target.value)}
              required
              className="lg:w-[300px] w-full"
            />
          </div>
        </div>
        <button type="submit" className="iron-btn max-w-[300px]">
          {" "}
          اضافه سائق جديد
        </button>
      </form>
      <Seperator text="اضافة عميل جديد" />
      <form
        className="setting-holder-form "
        onSubmit={(e) => handleClientAdd(e)}
      >
        <div
          dir="rtl"
          className="lg:items-end flex flex-col lg:flex-row gap-5 items-center justify-center"
        >
          <div dir="rtl" className="flex flex-col gap-2 w-fit text-center">
            <label htmlFor="name"> اسم العميل </label>
            <input
              name="name"
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              required
              className="lg:w-[300px] w-full"
            />
          </div>
          <div dir="rtl" className="flex flex-col gap-2 text-center">
            <label htmlFor="address"> عنوان العميل </label>
            <input
              name="address"
              type="text"
              value={clientAddress}
              onChange={(e) => setClientAddress(e.target.value)}
              required
              className="lg:w-[300px] w-full"
            />
          </div>
          <select
            className="h-fit"
            required
            onChange={(e) => {
              setClientType(e.target.value);
            }}
          >
            <option disabled selected>
              {" "}
              اختر نوع{" "}
            </option>
            <option value="مورد"> مورد </option>
            <option value="عميل"> عميل </option>
            <option value="عميل و مورد"> عميل و مورد </option>
          </select>
        </div>
        <button type="submit" className=" max-w-[300px] iron-btn">
          {" "}
          اضافه عميل جديد
        </button>
      </form>
    </div>
  );
};

export default Settings;

import React, { useEffect, useState } from "react";
import { ReactComponent as NewIcon } from "../assets/icons/new.svg";
import { ReactComponent as LoadIcon } from "../assets/icons/load.svg";
import { ReactComponent as PayIcon } from "../assets/icons/pay.svg";
import { ReactComponent as DoneIcon } from "../assets/icons/done.svg";
import Seperator from "../components/Seperator";
import { useNavigate } from "react-router-dom";
import CreateOrders from "../components/CreateOrders";
const ModeratorMainPage = () => {
  const navigate = useNavigate();
  return (
    <section className="p-8 size-full flex flex-col gap-4">
      <CreateOrders />
      <Seperator text="الطلبات" />

      <div className="w-full flex md:flex-row flex-col py-6  gap-8" dir="rtl">
        <button
          onClick={() => navigate(`orders/new`)}
          className="cursor-pointer hover:border-[greenyellow] p-5 flex border-[2px] flex-col items-center justify-center gap-4 rounded  md:flex-1 min-h-60"
        >
          <NewIcon className="size-14" />
          <h1 className="text-4xl">جديد</h1>
        </button>
        <button
          onClick={() => navigate(`orders/progress-load`)}
          className="cursor-pointer p-5  hover:border-[greenyellow] flex border-[2px] flex-col items-center justify-center gap-4 rounded  md:flex-1  min-h-60"
        >
          <LoadIcon className="size-14" />
          <h1 className="text-4xl">جاري التحميل</h1>
        </button>
        <button
          onClick={() => navigate(`orders/progress-pricing`)}
          className="cursor-pointer p-5  hover:border-[greenyellow] flex border-[2px] flex-col items-center justify-center gap-4 rounded  md:flex-1  min-h-60"
        >
          <PayIcon className="size-14" />
          <h1 className="text-4xl">جاري التسعيير</h1>
        </button>
        <button
          onClick={() => navigate(`orders/done`)}
          className="cursor-pointer p-5  hover:border-[greenyellow] flex border-[2px] flex-col items-center justify-center gap-4 rounded  md:flex-1 min-h-60"
        >
          <DoneIcon className="size-14" />
          <h1 className="text-4xl">تم</h1>
        </button>
      </div>
    </section>
  );
};

export default ModeratorMainPage;

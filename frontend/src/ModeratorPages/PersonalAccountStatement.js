import { useClientContext } from "../hooks/useClientContext";
import React, { useState } from "react";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Table from "@mui/material/Table";
import { TableContainer } from "@mui/material";
import Paper from "@mui/material/Paper";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Box from "@mui/material/Box";

const Row = ({ row, key, transactionMonth }) => {
  const [purchasingNotesTable, setPurchasingNotesTable] = useState(false);
 let filteredRows = [...row.purchasingNotes];
 console.log(row)
  if (transactionMonth !== null) {
    filteredRows = row.purchasingNotes.filter((el) => {
      const parsedDate = new Date(el.date);
      const year = parsedDate.getFullYear();
      const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
      const formatted = `${year}-${month}`;
      return formatted === transactionMonth;
    });
  }
  let totalTransfers = 0;
  let totalReceived = 0;
  filteredRows.forEach((el) => {
    if (el.type === "تحويل الى") {
      totalTransfers += el.amount;
    } else {
      totalReceived += el.amount;
    }
  });
  return (
    <>
      <TableRow>
        <TableCell className="!text-right border-[0.8px] border-black">
          {" "}
          <div className="flex gap-4 items-center ">
            <p className="text-xl ">ملاحظات الشراء</p>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setPurchasingNotesTable(!purchasingNotesTable)}
            >
              {purchasingNotesTable ? (
                <KeyboardArrowUpIcon />
              ) : (
                <KeyboardArrowDownIcon />
              )}
            </IconButton>
          </div>
        </TableCell>
        <TableCell className="!text-right border-[0.8px] border-black">
          {row.name}
        </TableCell>
        <TableCell className="!text-right border-[0.8px] border-black">
          {totalTransfers.toLocaleString()}
        </TableCell>
        <TableCell className="!text-right border-[0.8px] border-black">
          {totalReceived.toLocaleString()}
        </TableCell>
      </TableRow>
      <TableRow style={{ verticalAlign: "baseline" }}>
        <TableCell
          className="border-[0.8px] border-black"
          style={{ paddingBottom: 0, paddingTop: 0 }}
          colSpan={6}
        >
          <Collapse in={purchasingNotesTable} timeout="auto" unmountOnExit>
            <Box>
              {filteredRows.length > 0 ? (
                <Table className="my-6 ">
                  <TableHead>
                    <TableRow>
                      <TableCell className="!text-right border-[0.8px] border-black">
                        المبلغ
                      </TableCell>
                      <TableCell className="!text-right border-[0.8px] border-black">
                        التاريخ
                      </TableCell>
                      <TableCell className="!text-right border-[0.8px] border-black">
                        الملاحظات
                      </TableCell>
                      <TableCell className="!text-right border-[0.8px] border-black">
                        نوع الشراء
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredRows.length > 0 &&
                      filteredRows.map((el, index) => (
                        <TableRow key={index}>
                          <TableCell className="!text-right border-[0.8px] border-black">
                            {el.amount.toLocaleString()}
                          </TableCell>
                          <TableCell className="!text-right border-[0.8px] border-black">
                            {el.date}
                          </TableCell>
                          <TableCell className="!text-right border-[0.8px] border-black">
                            {el.notes ? el.notes : "لا يوجد ملاحظات"}
                          </TableCell>
                          <TableCell className="!text-right border-[0.8px] border-black">
                            {el.type}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-xl text-center py-5">
                  لا توجد ملاحظات شراء متاحة.
                </p>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const PersonalAccountStatement = () => {
  const { client, dispatch: clientUpdate } = useClientContext();
  const [transactionMonth, setTransactionMonth] = useState();
  const [isSearching, setIsSearching] = useState(false);
  if (client == null) {
    return <div> Loading....</div>;
  }
  const clientArray = Object.values(client);
  const filteredClients = clientArray.filter((c) => c.isKudsPersonnel);
  const handleMonthSubmit = (e) => {
    e.preventDefault();
    console.log(transactionMonth)
  };
  return (
    <div className="flex items-center gap-8 flex-col" dir="rtl">
      <form
        onSubmit={handleMonthSubmit}
        dir="rtl"
        className="w-full flex-col justify-center py-6 flex items-center gap-2"
      >
        <div>
          <label> عمليات شهر : </label>
          <input
            required
            type="month"
            value={transactionMonth}
            onChange={(e) => setTransactionMonth(e.target.value)}
          />
        </div>
        <div className="space-y-4 w-full flex flex-col items-center">
          <button type="submit" className="iron-btn search-btn w-auto">
            {" "}
            بحث{" "}
          </button>
          {isSearching && (
            <button
              className="iron-btn remove w-auto"
              onClick={(e) => {
                e.preventDefault();
                setTransactionMonth("");
                setIsSearching(false)
              }}
            >
              الغاء البحث
            </button>
          )}
        </div>
      </form>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell className="!text-start border-[0.8px] border-black">
                ملاحظات الشراء
              </TableCell>
              <TableCell className="!text-start border-[0.8px] border-black">
                الأسم
              </TableCell>
              <TableCell className="!text-start border-[0.8px] border-black">
                إجمالي التحويلات إلى الشركة
              </TableCell>
              <TableCell className="!text-start border-[0.8px] border-black">
                إجمالي الاستلام من الشركة
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredClients.map((el) => {
              return (
                <Row
                transactionMonth={transactionMonth}
                row={el}
                key={el.id}
                />
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default PersonalAccountStatement;

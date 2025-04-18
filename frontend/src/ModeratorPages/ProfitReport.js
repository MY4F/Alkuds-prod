import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Seperator from "../components/Seperator/index";
import { useState } from "react";
const ProfitReport = () => {
  const [date, setDate] = useState();
  const rows = [createData("Frozen yoghurt", 159, 6.0, 24, 4.0)];

  function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
  }

  return (
    <div>
      <div className="w-full flex md:flex-row flex-col gap-5 pb-6">
        <div className=" w-full flex justify-center">
          <div className="flex flex-col gap-2 w-full max-w-[300px]">
            <label className="text-center">اختر تاريخ التقرير</label>
            <input
              required
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
              }}
              type="date"
              className="w-full md:w-[300px]"
            />
            <button
              className="iron-btn add-btn"
              onClick={(e) => {
                e.preventDefault();
              }}
            >تحديث التقرير</button>
          </div>
        </div>
      </div>
      <Seperator text="التقرير" />
      <TableContainer component={Paper} style={{ direction: "rtl" }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="right">اجمالي عجز و زياده البضاعه</TableCell>
              <TableCell align="right">اجمالي البيع</TableCell>
              <TableCell align="right">اجمالي الشراء</TableCell>
              <TableCell align="right">بضاعه اول الشهر</TableCell>
              <TableCell align="right">بضاعه اخر الشهر</TableCell>
              <TableCell align="right">الربح بدون مصاريف</TableCell>
              <TableCell align="right">اجمالي الربح</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow component="th" key={row.name}>
                <TableCell align="right" component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right" component="th">
                  {row.calories}
                </TableCell>
                <TableCell align="right" component="th">
                  {row.fat}
                </TableCell>
                <TableCell align="right" component="th">
                  {row.carbs}
                </TableCell>
                <TableCell align="right" component="th">
                  {row.protein}
                </TableCell>
                <TableCell align="right" component="th">
                  {row.protein}
                </TableCell>
                <TableCell align="right" component="th">
                  {row.protein}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ProfitReport;

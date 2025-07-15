import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Seperator from "../components/Seperator/index";
import { useEffect, useState } from "react";
import { useUserContext } from "../hooks/useUserContext";

const ProfitReport = () => {
  const {user} = useUserContext()
  const [date, setDate] = useState();
  const [rows, setRows] = useState([createData(0,0,0,0,0,0,0)]);

  function createData(x, y, z, w, a,b,c) {
    return { x, y, z, w, a,b,c };
  }
  
  useEffect(()=>{
  },[rows,date])

  const getProfit = async()=>{
    console.log(user.token)
    const response = await fetch('/admin/getProfitReportDataBasedOnDate',{
      'method':"POST",
      "body":JSON.stringify({"monthAndYear":date}),
      'headers': {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      }
    })

    const value = await response.json()
    if(response.ok){
      console.log(value)
      setRows([createData(
          value["totalDeficitAndSurplusOfIron"],
          value["soldProfit"],
          value["purchasedPrice"],
          value["beginningOfMonthIronPrice"],
          value["endingOfMonthIronPrice"],
          value["totalProfitWithoutExpenses"],
          value["overAllTotalProfit"]
        )
      ]
      )
    }
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
                getProfit()
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
                <TableCell style={{"direction":"ltr"}} align="right" component="th" scope="row">
                  {row.x.toLocaleString()}
                </TableCell>
                <TableCell style={{"direction":"ltr"}} align="right" component="th">
                  {row.y.toLocaleString()}
                </TableCell>
                <TableCell style={{"direction":"ltr"}} align="right" component="th">
                  {row.z.toLocaleString()}
                </TableCell>
                <TableCell style={{"direction":"ltr"}} align="right" component="th">
                  {row.w.toLocaleString()}
                </TableCell>
                <TableCell style={{"direction":"ltr"}} align="right" component="th">
                  {row.a.toLocaleString()}
                </TableCell>
                <TableCell style={{"direction":"ltr"}} align="right" component="th">
                  {row.b.toLocaleString()}
                </TableCell>
                <TableCell style={{"direction":"ltr"}} align="right" component="th">
                  {row.c.toLocaleString()}
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

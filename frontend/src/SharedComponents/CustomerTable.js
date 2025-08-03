import { useState } from "react";
import Seperator from "../../src/components/Seperator";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
const CustomerTable = ({clients, clientType}) =>{


    const [currentPage, setCurrentPage] = useState(1);
    const [clientsPerPage, setclientsPerPage] = useState(20);
    const [searchedText, setSearchedText] = useState();

    const indexOfLastClient = currentPage * clientsPerPage;
    const indexOfFirstClient = indexOfLastClient - clientsPerPage;
    const currentClients = clients.slice(indexOfFirstClient, indexOfLastClient);
    const filteredClients = searchedText
      ? clients.filter((c) =>
          c.name.toLowerCase().includes(searchedText.toLowerCase())
        )
      : currentClients;

    return(
        <>
        <Seperator text={clientType} />
      <div className="space-y-5" dir="rtl">
        <div className="w-full max-w-2xl mx-auto flex justify-center">
          <input
            value={searchedText}
            onChange={(e) => {
              setSearchedText(e.target.value);
            }}
            type="text"
            placeholder="أسم العميل"
          />
        </div>
        <div className="w-full flex justify-center items-center p-2">
          <Table
            dir="rtl"
            size="small"
            aria-label="purchases"
            className="max-w-2xl"
          >
            <TableHead>
              <TableRow className="!border-b-black">
                <TableCell
                  className="!border-b-black "
                  sx={{ width: "50%" , fontWeight:"bolder" , fontSize:"20px"}}
                  align="center"
                >
                  {clientType ==='العملاء'? 'اسم العميل':'اسم المورد'}
                </TableCell>
                <TableCell
                  className="!border-b-black font-bold"
                  sx={{ width: "50%" , fontWeight:"bold" , fontSize:"20px" }}
                  align="center"
                >
                  الرصيد
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredClients &&
                filteredClients.map((client, idx) => {
                  return (
                    <TableRow
                      key={client.id}
                      sx={{ border: "1px solid black" }}
                    >
                      <TableCell
                        align="center"
                        sx={{ width: "50%", border: "1px solid black" }}
                      >
                        <div dir="rtl" className="flex gap-3">
                          <div className="flex gap-2">
                            <div>
                              {(currentPage != 1
                                ? currentPage * clientsPerPage
                                : 0) +
                                (idx + 1)}
                            </div>
                            <div className="text-gray-500">-</div>
                          </div>
                          <div>{client.name}</div>
                        </div>
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ width: "50%", border: "1px solid black" }}
                        style={{'direction':"ltr"}}
                      >
                        {client.balance.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </div>
        {!searchedText && (
          <div className="max-w-2xl mx-auto mt-4 flex justify-center">
            <div className="flex items-center gap-4 text-lg">
              <span
                onClick={() => {
                  if (currentPage > 1) {
                    setCurrentPage(currentPage - 1);
                  }
                }}
                className={`px-3 py-1 rounded-full border border-gray-400 transition
      ${
        currentPage === 1
          ? "opacity-50 cursor-not-allowed"
          : "cursor-pointer hover:bg-gray-200"
      }`}
              >
                {"<"}
              </span>

              {/* Next button */}
              <span
                onClick={() => {
                  const totalPages = Math.ceil(
                    Object.keys(clients).length / clientsPerPage
                  );
                  if (currentPage < totalPages) {
                    setCurrentPage(currentPage + 1);
                  }
                }}
                className={`px-3 py-1 rounded-full border border-gray-400 transition
      ${
        currentPage >= Math.ceil(Object.keys(clients).length / clientsPerPage)
          ? "opacity-50 cursor-not-allowed"
          : "cursor-pointer hover:bg-gray-200"
      }`}
              >
                {">"}
              </span>
            </div>
          </div>
        )}
      </div>
        </>
    )
}

export default CustomerTable;
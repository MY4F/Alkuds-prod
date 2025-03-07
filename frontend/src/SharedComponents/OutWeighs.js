import { useEffect, useRef, useState } from "react";
import { useLoaderData, useLocation } from 'react-router-dom'
import { useParams } from "react-router-dom";
import truck from '../assets/images/truck.png';
// import Swal from 'sweetalert2'
import kuds from '../assets/images/kuds.png';
import kudsPrint from '../assets/images/kuds-print.png'
import qr from '../assets/images/qr.png'
import { useUnfinishedTicketsContext } from "../hooks/useUnfinishedTicketsContext";
const Receipt = ({ ironArr, ironRadiusArr, ironTypeArr, ironWeightArr }) => {
    let j = 1;
    let arr = [], totalWeight = ironWeightArr[ironWeightArr.length - 1] - ironWeightArr[0];
    for (let idx = 0; idx < ironArr.length - 1; idx++) {

        arr.push(
            <div className="generated-iron-block">
                <div className="client-print-data">
                    <p>
                        <span>
                            قطر:
                        </span>
                        &nbsp;
                        <span>
                            {ironRadiusArr[j]}
                        </span>
                    </p>
                </div>
                <div className="client-print-data">
                    <div>
                        <p>
                            <span>وزنه {idx + 2} :</span>
                            <span> {ironWeightArr[idx + 1]} </span>
                        </p>
                    </div>
                    <div>
                        <p>
                            <span>  وزنه {idx + 1} :</span>
                            &nbsp;
                            <span> {ironWeightArr[idx]} </span>
                        </p>
                    </div>
                </div>
                <p className="total-weight client-print-data">
                صافي الوزنه:{ironWeightArr[idx + 1] - ironWeightArr[idx]}
                    
                </p>
            </div>
        )
        j++;
    }

    return (
        arr.map((i, idx) => (
            <>
                {i}
                <div className="horizontal-line"></div>
                {idx === arr.length - 1 &&
                    <p style={{ 'width': '66%', 'textAlign': 'left', 'fontSize': '15px' }}>
                        <span>الوزن الصافي:</span>
                        <span> {totalWeight} </span>
                    </p>
                }
            </>
        ))
    )
}

const OutWeighs = ({ type, oldTicketId, userId }) => {
    // date code:
    //new Date().toLocaleString('en-EG', {timeZone: 'Africa/Cairo'})
    const { unfinishedTickets, dispatch } = useUnfinishedTicketsContext();
    // let unfinishedTickets = useLoaderData()
    let dummIronLoopArr = [], dummIronNameArr = [], dummIronWeightArr = [], dummIronRadiusArr = [], dummTimeArr = [], dummDateArr = [];
    if (oldTicketId != null && type === "old") {
        for (let i = 0; i < unfinishedTickets[oldTicketId].reciept.length; i++) {
            dummDateArr.push(unfinishedTickets[oldTicketId].reciept[i].date)
            dummIronNameArr.push(unfinishedTickets[oldTicketId].reciept[i].ironName)
            dummIronRadiusArr.push(unfinishedTickets[oldTicketId].reciept[i].radius)
            dummIronWeightArr.push(unfinishedTickets[oldTicketId].reciept[i].weightAfter)
            dummTimeArr.push(unfinishedTickets[oldTicketId].reciept[i].time)
            dummIronLoopArr.push(1);
        }
    }
    console.log(type, unfinishedTickets[oldTicketId], dummIronNameArr, dummIronRadiusArr, dummIronWeightArr, oldTicketId)
    const [id, setId] = useState(oldTicketId != null ? userId : null);
    const [ironArr, setIronArr] = useState(oldTicketId != null ? dummIronLoopArr : []);
    const [ironWeightArr, setIronWeightArr] = useState(oldTicketId != null ? [...dummIronWeightArr] : [])
    const [ironTime, setIronTime] = useState(oldTicketId != null ? dummTimeArr : [])
    const [ironDate, setIronDate] = useState(oldTicketId != null ? dummDateArr : [])
    const [ironTypeArr, setIronTypeArr] = useState(oldTicketId != null ? dummIronNameArr : [])
    const [ironRadiusArr, setIronRadiusArr] = useState(oldTicketId != null ? dummIronRadiusArr : [])
    console.log(ironTime, ironDate, ironRadiusArr, ironWeightArr)
    const [selectedClientName, setSelectedClientName] = useState(oldTicketId != null ? unfinishedTickets[oldTicketId].clientName : null)
    const [selectedClientAddress, setSelectedClientAddress] = useState(oldTicketId != null ? unfinishedTickets[oldTicketId].clientAddress : null)
    const [selectedDriverName, setSelectedDriverName] = useState(oldTicketId != null ? unfinishedTickets[oldTicketId].driverName : null)
    const [selectedDriverMobile, setSelectedDriverMobile] = useState(oldTicketId != null ? unfinishedTickets[oldTicketId].driverNo : null)
    const [selectedCarNumber, setSelectedCarNumber] = useState(oldTicketId != null ? unfinishedTickets[oldTicketId].carNumber : null)
    const [selectedLorryNumber, setSelectedLorryNumber] = useState(oldTicketId != null ? unfinishedTickets[oldTicketId].lorryNumber : null)
    const [selectedIron, setSelectedIron] = useState(oldTicketId != null ? dummIronNameArr[0] : null)
    const [selectedRadius, setSelectedRadius] = useState(oldTicketId != null ? dummIronRadiusArr[0] : null)
    const [carInfo, setCarInfo] = useState([])
    const [clientsInfo, setClientsInfo] = useState([])
    const [ironInfo, setIronInfo] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const [driverInfo, setDriverInfo] = useState([])
    const [driverName, setDriverName] = useState();
    const [driverNo, setDriverNo] = useState("")
    const [tickets, setTickets] = useState()
    const [dateArr, setDateArr] = useState(oldTicketId != null ? dummDateArr : [])
    const [timeArr, setTimeArr] = useState(oldTicketId != null ? dummTimeArr : [])
    const isFirstRender = useRef(true);
    const [modal, setModal] = useState(false)


    const handleView = (idx) => {
        if (modal == true)
            window.location.reload();
        setModal(!modal);
        if (type === 'new') {
            setId(null);
            setIronArr([]);
            setIronWeightArr([])
            setIronTime([])
            setIronDate([])
            setIronTypeArr([])
            setIronRadiusArr([])
            setSelectedClientName(null)
            setSelectedClientAddress(null)
            setSelectedDriverName(null)
            setSelectedDriverMobile(null)
            setSelectedCarNumber(null)
            setSelectedLorryNumber(null)
            setSelectedIron(null)
            setSelectedRadius(null)
            setDateArr([])
            setTimeArr([])
        }
    }


    useEffect(() => {
        const getCarInfo = async () => {
            const response = await fetch('http://localhost:8000/car/getCarInfo',
                {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }


            )
            const json = await response.json()
            setCarInfo(json)
        }
        const getDriverInfo = async () => {
            const response = await fetch('http://localhost:8000/driver/getDriversInfo',
                {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }


            )
            const json = await response.json()
            setDriverInfo(json)
        }
        const getClientsInfo = async () => {
            const response = await fetch('http://localhost:8000/clients/getClientsInfo',
                {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }


            )
            const json = await response.json()
            setClientsInfo(json);
        }
        const getIronStorage = async () => {
            const response = await fetch('http://localhost:8000/irons/getIronStorage',
                {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }


            )
            const json = await response.json()
            setIronInfo(json);
        }



        getCarInfo()
        getDriverInfo()
        getClientsInfo()
        getIronStorage()

        // window.addEventListener('keydown', (e) => {
        //     if (e.keyCode == 80 && (e.ctrlKey || e.metaKey) && !e.altKey && !e.shiftKey) {
        //         e.preventDefault()
        //         if (e.stopImmediatePropagation)
        //             e.stopImmediatePropagation()
        //         else
        //             e.stopPropagation()
        //     }
        // }, true)


    }, [unfinishedTickets, dispatch, id, ironRadiusArr, ironTypeArr, ironWeightArr, ironArr, selectedCarNumber, selectedClientAddress, selectedClientName, selectedDriverMobile, selectedDriverName, selectedIron, selectedLorryNumber, selectedRadius])


    const handleAddress = (name) => {
        console.log(clientsInfo)
        setSelectedClientName(name);
        for (const i of clientsInfo) {
            console.log(i)
            if (i.name == name) {
                setSelectedClientAddress(i.address);
                break;
            }
        }
    }

    const handleDriverNumber = (name) => {
        setSelectedDriverName(name);
        for (const i of driverInfo) {
            if (i.name == name) {
                setSelectedDriverMobile(i.mobile);
                setDriverName(i.name);
                break;
            }
        }
    }

    const handleLorry = (number) => {
        setSelectedCarNumber(number)
        for (const i of carInfo) {
            if (i.number == number) {
                setSelectedLorryNumber(i.lorryNumber);
                break;
            }
        }
    }

    const handleScaleWeight = async (idx, x, y) => {
        console.log(x, y)
        if (idx !== 0 && (x === null || x === "" || y === null || y === "" || x === 0 || y === 0)) {
            window.alert("ارجو اختيار نوع الحديد و القطر قبل تحميل الوزن")
            return
        }
        setIsLoading(true);
        const response = await fetch('http://localhost:8000/irons/getScaleWeight',
            {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
        const json = await response.json()
        let dummyArr = ironWeightArr
        if (response.ok) {
            console.log(json.weight, idx)
            let dummyArr = ironWeightArr
            dummyArr[idx] = json.weight
            setIronWeightArr(dummyArr);



            let d = new Date().toLocaleString('en-EG', { timeZone: 'Africa/Cairo' })
            let dateArr = d.split(',');
            let dateDummyArr = ironDate, timeDummyArr = ironTime
            dateDummyArr[idx] = dateArr[0]
            timeDummyArr[idx] = dateArr[1]
            setIronDate(dateDummyArr)
            setIronTime(timeDummyArr)
            setIsLoading(false)
        }

        let type = "out"
        let clientName = selectedClientName;
        let clientAddress = selectedClientAddress;
        let driverName = selectedDriverName;
        let driverNo = selectedDriverMobile
        let carNumber = selectedCarNumber;
        let lorryNumber = selectedLorryNumber;
        let d = new Date().toLocaleString('en-EG', { timeZone: 'Africa/Cairo' })
        let dateArr = d.split(',');
        let date = dateArr[0];
        let time = dateArr[1];
        let weightBefore = dummyArr[0];
        let reciept = [];
        console.log(ironWeightArr);
        for (let i = 0; i < ironArr.length; i++) {
            console.log("looooping");
            let ironName = ironTypeArr[i];
            let radius = ironRadiusArr[i];
            let weightAfter = dummyArr[i];
            let weight = weightAfter;

            // for (let j = i - 1; j >= 0; j--) {
            //     weight -= ironWeightArr[j];
            // }
            if (i == 0)
                weight = dummyArr[i];
            else
                weight = dummyArr[i] - dummyArr[i - 1];

            let singleReciept = { ironName, radius, weightAfter, weight, date, time };
            reciept.push(singleReciept);

        }
        let ticket = {
            "id": id,
            "state": "progress",
            type,
            clientName,
            clientAddress,
            driverName,
            driverNo,
            carNumber,
            lorryNumber,
            date,
            weightBefore,
            reciept

        }
        console.log(ticket)
        console.log(id)
        const autoTicketSave = await fetch("http://localhost:8000/ticket/addTicket/" + id,
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ticket })
            }
        )
        const autoSaveResponse = await autoTicketSave.json();
        setId(autoSaveResponse.id)
        console.log(autoSaveResponse);
        dispatch({ type: 'SET_TICKETS', payload: autoSaveResponse.db })
    }

    const handleIronAdd = () => {
        setIronArr([...ironArr, 1])
        setIronWeightArr([...ironWeightArr, 0]);
        setIronRadiusArr([...ironRadiusArr, 0])
        setIronTypeArr([...ironTypeArr, 0])
        setTimeArr([...timeArr, 0])
        setDateArr([...dateArr, 0])
    }

    const handleRaduisChange = (idx, radius) => {
        setSelectedRadius(radius)
        let dummyArr = ironRadiusArr
        dummyArr[idx] = radius
        setIronRadiusArr(dummyArr);
    }
    const handleIronTypeChange = (idx, type) => {
        setSelectedIron(type)
        let dummyArr = ironTypeArr
        dummyArr[idx] = type
        setIronTypeArr(dummyArr);
    }
    const handleRemoveAdditionalWeigh = () => {
        console.log(ironWeightArr.length, ironWeightArr)
        let tempIronArr = ironArr;
        tempIronArr.pop()
        setIronArr([...tempIronArr])
        let tempIronRadiusArr = ironRadiusArr;
        tempIronRadiusArr.pop()
        setIronRadiusArr([...tempIronRadiusArr])
        let tempIronTypeArr = ironTypeArr;
        tempIronTypeArr.pop()
        setIronTypeArr([...tempIronTypeArr])
        let tempIronWeightArr = ironWeightArr;
        tempIronWeightArr.pop()
        setIronWeightArr([...tempIronWeightArr])
    }
    const handlePrint = async () => {

        if (selectedCarNumber == null || selectedClientAddress == null || selectedClientName == null
            || selectedDriverMobile == null || selectedDriverName == null || selectedIron == null || selectedLorryNumber == null
            || selectedRadius == null
        ) {
            console.log(selectedCarNumber, selectedClientAddress, selectedClientName, selectedDriverMobile, selectedDriverName, selectedIron, selectedLorryNumber, selectedRadius)
            window.alert("برجاء ادخال البيانات كامله")
            console.log("heeree")
            return
        }
        for (let i = 0; i < ironWeightArr.length; i++) {
            console.log(i)
            if (i > 0 && ironWeightArr[i] === 0) {
                window.alert("برجاء ادخال البيانات كامله")
                console.log("heeree 1")
                return
            }
        }
        for (let i = 0; i < ironRadiusArr.length; i++) {
            if (i > 0 && (ironRadiusArr[i] === 0 || ironTypeArr[i] === 0)) {
                window.alert("برجاء ادخال البيانات كامله")
                console.log("heeree 3")
                return
            }
        }
        if (window.confirm("هل تريد طباعه التيكيت") === true) {
            let ans = await handleTicketStateEnd();
            window.print()
            window.onafterprint = () => {
                setModal(!modal);
                setId(null);
                setIronArr([]);
                setIronWeightArr([])
                setIronTime([])
                setIronDate([])
                setIronTypeArr([])
                setIronRadiusArr([])
                setSelectedClientName(null)
                setSelectedClientAddress(null)
                setSelectedDriverName(null)
                setSelectedDriverMobile(null)
                setSelectedCarNumber(null)
                setSelectedLorryNumber(null)
                setSelectedIron(null)
                setSelectedRadius(null)
                setDateArr([])
                setTimeArr([])
                dispatch({ type: 'SET_TICKETS', payload: ans })
                document.location.reload()
            }

        }
    }

    const handleTicketStateEnd = async () => {

        const response = await fetch("http://localhost:8000/ticket/ticketFinishState/" + id, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        const resp = await response.json()

        if (response.ok) {
            return resp.msg
        }
    }

    const handleDelete = async () => {

        const response = await fetch("http://localhost:8000/ticket/ticketDelete/" + id, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        const resp = await response.json()

        if (response.ok) {
            document.location.reload()
        }


    }


    //48 منطقه كمائن الجير خلف طريق العين السخنه

    return (
        < >

            <div className="outWeightHolder">
                <button style={{ "fontSize": "25px" }} className="displayHidden add-btn iron-btn" onClick={handleView}>
                    {type === 'old' ? "افتح التذكره" : "انشاء تذكره خروج"}
                </button>
                {modal &&
                    <div className="modal">
                        <span className="displayHidden" onClick={handleView} style={{ "fontSize": "30px", "cursor": "pointer" }}>
                            &times;
                        </span>
                        {type === "old" && <button onClick={handleDelete} className="iron-btn"> ازاله</button>}

                        <div style={{
                            'backgroundImage': `url(${require("../assets/images/kuds-watermark.png")})`
                        }} className="print-content">
                            <div className="print-header">
                                <div className="header-img-holder" >
                                    <img style={{ 'width': '70%' }} src={kudsPrint} />
                                    <span>01002112431</span>
                                    <p style={{ 'display': 'flex', 'flexDirection': 'row', "justifyContent": 'flex-start' }}>
                                        <span>  منطقه كمائن الجير خلف طريق العين السخنه </span>
                                        <span> 48 </span>
                                    </p>

                                </div>
                                <div className="type-date-holder">
                                    <h1> اذن استلام بضاعه </h1>
                                    <span> خارج </span>
                                    <span> {new Date().toLocaleString()} </span>
                                </div>
                                <div>
                                    <img style={{ 'width': "30%" }} src={qr} />
                                </div>
                            </div>
                            <div style={{
                                'display': 'flex',
                                'flexDirection': 'column',
                                'alignItems': 'flex-end',
                                'justifyContent': 'flex-end',
                                'textAlign': 'left',
                                'width': '100%',
                                'margin': '10px 0'
                            }} className="static-info">
                                <div className="static-data-holder client-print-data">


                                    <p>
                                        <span>
                                            {selectedClientAddress}
                                        </span>
                                        &nbsp;
                                        <span>
                                            : عنوان العميل
                                        </span>
                                    </p>
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    <p>
                                        <span> {selectedClientName} </span>
                                        &nbsp;
                                        <span>: اسم العميل</span>
                                    </p>
                                </div>
                                <div className="static-data-holder">
                                    <p>
                                        <span> {selectedCarNumber} </span>
                                        &nbsp;
                                        <span>: رقم العربيه</span>
                                    </p>
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    <p>
                                        <span> {selectedLorryNumber} </span>
                                        &nbsp;
                                        <span>: رقم المقطوره</span>
                                    </p>
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    <p>
                                        <span> {selectedDriverMobile} </span>
                                        &nbsp;
                                        <span>: رقم السائق</span>
                                    </p>
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                                    <p>
                                        <span>
                                            {selectedDriverName}
                                        </span>
                                        &nbsp;
                                        <span>
                                            : اسم السائق
                                        </span>
                                    </p>
                                </div>
                                <div className="static-data-holder">
                                    <p>
                                        __________________/ت.المستلم
                                    </p>
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                                    <p>
                                        __________________/المستلم
                                    </p>
                                </div>
                            </div>
                            <Receipt ironArr={ironArr} ironTypeArr={ironTypeArr} ironRadiusArr={ironRadiusArr} ironWeightArr={ironWeightArr} />
                            <p>
                                انا الموقع ادناه استلمت البضاعه المبينه بعاليه بحاله جيده بصفه امانه لحين توريد ثمنها بإصال مستقل.
                            </p>
                            <p>
                                اقرار استلام عميل
                            </p>
                            <p style={{ 'width': '100%' }}>
                                ______________________/الاسم
                            </p>
                            <p style={{ 'width': '100%' }}>
                                _____________________/التوقع
                            </p>

                        </div>
                        <div className="client-details">
                            <div className="operate-type">

                                <h1 >خارج</h1>
                            </div>
                            <div className="client-data">
                                <h2 style={{ textAlign: "center" }}>
                                    بيانات العميل
                                </h2>
                                <div className="client-holder">
                                    <div className="data-input">
                                        <label htmlFor="address"> العنوان </label>
                                        <input name="address" type="text" onChange={e => setSelectedClientAddress(e.target.value)} value={selectedClientAddress}  />
                                    </div>
                                    <div className="data-input">
                                        <label htmlFor="clientname"> اسم العميل </label>
                                        <input onChange={e => setSelectedClientName(e.target.value)} value={selectedClientName} name="orderType" className="form-control  list2 list-enter" list="datalistOptions2" id="exampleDataList2" placeholder="ابحث ..." required />
                                        
                                        {/* <select onChange={e => handleAddress(e.target.value)}>
                                    
                                </select> */}
                                    </div>
                                </div>
                            </div>
                            <div className="driver-data">
                                <h2>
                                    بيانات السائق و العربيه
                                </h2>
                                <div className="driver-holder">
                                    <div className="driver-data-holder">
                                        <div className="data-input">
                                            <input name="driverNum" type="text" value={selectedDriverMobile} readOnly />
                                            <label htmlFor="driverNum"> رقم تليفون السائق </label>
                                        </div>
                                        <div className="data-input">
                                            <select value={selectedDriverName} onChange={e => handleDriverNumber(e.target.value)}>
                                                <option> اختر سائق</option>
                                                {
                                                    driverInfo.map((i, idx) => (
                                                        <option key={idx}> {i.name} </option>
                                                    ))
                                                }
                                            </select>
                                            <label htmlFor="driverName"> اسم السائق </label>
                                        </div>
                                    </div>
                                    <div className="car-data-holder">
                                        <div className="data-input">
                                            <input name="carNum" type="text" value={selectedLorryNumber} readOnly />
                                            <label htmlFor="carNum"> رقم العربيه </label>
                                        </div>
                                        <div className="data-input">
                                            <select value={selectedCarNumber} onChange={e => handleLorry(e.target.value)}>
                                                <option> اختر عربه</option>
                                                {
                                                    carInfo.map((i, idx) => (
                                                        <option key={idx}> {i.number} </option>
                                                    ))
                                                }
                                            </select>
                                            <label htmlFor="lorryNum"> رقم المقطوره </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button className="iron-btn add-btn" onClick={handleIronAdd}> اضافه وزنه </button>
                        <div className="iron-input">
                            {
                                ironArr && ironArr.map((i, key) => (
                                    <div key={key} className="section-content">
                                        {key !== 0 && <div className="weigh-data-holder" style={{ "width": "100%" }}>
                                            <div className="weigh-data-input">
                                                <select value={ironRadiusArr[key]} onChange={e => handleRaduisChange(key, e.target.value)} >
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
                                                <label htmlFor="clientname"> القطر</label>
                                            </div>

                                            <div className="weigh-data-input">
                                                <select value={ironTypeArr[key]} onChange={e => handleIronTypeChange(key, e.target.value)} >
                                                    <option> اختر نوع</option>
                                                    {
                                                        ironInfo.map((i, idx) => (
                                                            <option key={idx}> {i.name} </option>
                                                        ))
                                                    }
                                                </select>
                                                <label htmlFor="clientname"> نوع الحديد </label>
                                            </div>
                                        </div>
                                        }
                                        <div className="first-weigh">
                                            <div className="weigh-data-input">
                                                <input name="weight" type="text" value={ironWeightArr[key]} readOnly />

                                                <label htmlFor="weight"> وزنه رقم &nbsp;{key + 1} </label>
                                            </div>
                                            <div className="weigh-data-input">
                                                <input name="date" type="text" value={ironDate[key]} readOnly />
                                                <label htmlFor="date"> التاريخ </label>
                                            </div>
                                            <div className="weigh-data-input">
                                                <input name="time" type="text" value={ironTime[key]} readOnly />
                                                <label htmlFor="time"> التوقت </label>
                                            </div>
                                            {
                                                key !== 0 &&
                                                <div className="weigh-data-input">
                                                    <input name="weight" type="text" value={ironWeightArr[key] - ironWeightArr[key - 1] > 0 ? ironWeightArr[key] - ironWeightArr[key - 1] : "قم باضافه الوزنه التاليه"} readOnly />
                                                    <label htmlFor="weight"> صافي الوزن </label>
                                                </div>
                                            }
                                            <button onClick={e => { handleScaleWeight(key, ironRadiusArr[key], ironTypeArr[key]) }} className="iron-btn"> تحميل الوزن </button>
                                        </div>

                                        {key !== 0 && <div style={{ 'width': '100%' }}>
                                            <button onClick={handleRemoveAdditionalWeigh} className="iron-btn remove"> ازاله </button>
                                        </div>}
                                    </div>
                                ))
                            }
                            <button onClick={handlePrint} className="iron-btn"> طباعه</button>
                        </div>

                    </div>}
            </div>
        </>
    )
}

export default OutWeighs;


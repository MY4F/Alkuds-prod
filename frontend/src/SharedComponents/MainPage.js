import { useEffect, useState } from "react";
import { useUnfinishedTicketsContext } from "../hooks/useUnfinishedTicketsContext";
import { useNavigate, useParams } from "react-router-dom";
import OutWeighs from './OutWeighs';
import InWeights from './InWeights';
const MainPage = () => {
    const { unfinishedTickets, dispatch } = useUnfinishedTicketsContext();
    let ClientName;
    let ClientAddress;
    let DriverName;
    let DriverMobile;
    let CarNumber;
    let LorryNumber;
    let Iron;
    let Radius;
    let ironArr;
    let ironWeightArr;
    let ironTime;
    let ironDate;
    let ironTypeArr;
    let ironRadiusArr;
    let [oldTicketsArr, setOldTicketsArr] = useState([])
    useEffect(() => {
        console.log(unfinishedTickets)
        const handleOldTicket = () => {
            let arr = [];
            for (let j = 0; j < unfinishedTickets.length; j++) {
                ClientName=unfinishedTickets[j].clientName
                ClientAddress=unfinishedTickets[j].clientAddress
                DriverName=unfinishedTickets[j].driverName
                DriverMobile=unfinishedTickets[j].driverNo
                CarNumber=unfinishedTickets[j].carNumber
                LorryNumber=unfinishedTickets[j].lorryNumber
                let dummIronLoopArr = [], dummIronNameArr = [], dummIronWeightArr = [], dummIronRadiusArr = [], dummTimeArr = [], dummDateArr = [];
                for (let i = 0; i < unfinishedTickets[j].reciept.length; i++) {
                    dummDateArr.push(unfinishedTickets[j].reciept[i].date)
                    dummIronNameArr.push(unfinishedTickets[j].reciept[i].ironName)
                    dummIronRadiusArr.push(unfinishedTickets[j].reciept[i].radius)
                    dummIronWeightArr.push(unfinishedTickets[j].reciept[i].weight)
                    dummTimeArr.push(unfinishedTickets[j].reciept[i].time)
                    dummIronLoopArr.push(1);
                }
                ironRadiusArr= [...dummIronRadiusArr]
                ironTypeArr=[...dummIronNameArr]
                ironWeightArr=[...dummIronWeightArr]
                ironDate=[...dummDateArr]
                ironTime=[...dummTimeArr]
                ironArr=[...dummIronLoopArr]
                Iron=dummIronNameArr[0]
                Radius=dummIronRadiusArr[0]
                arr.push(
                    {
                        ClientName,
                        ClientAddress,
                        DriverName,
                        DriverMobile,
                        CarNumber,
                        LorryNumber,
                        Iron,
                        Radius,
                        ironArr,
                        ironWeightArr,
                        ironTime,
                        ironDate,
                        ironTypeArr,
                        ironRadiusArr,
                    }
                )
                console.log(arr)
                setOldTicketsArr(arr);
            }
            if(unfinishedTickets.length>0)
                handleOldTicket()
        }
    }, [oldTicketsArr,dispatch, unfinishedTickets])

    return (
        <div>
            <div className="displayHidden" style={{ "margin": "0 auto", "width": "80%", "display": "flex", "flexDirection": "row", "justifyContent": "center", "alignItems": "center" }}>
                <OutWeighs type={"new"} oldTicketId={null} userId={null} />
                <InWeights type={'new'} oldTicketId={null} userId={null} />
            </div>
            <h4 className="displayHidden" style={{ "margin": "15px auto", "fontSize": "20px" }}> التذاكر الحاليه </h4>
            <div style={{ "display": "flex", "flexDirection": "row", "flexWrap": "wrap", "justifyContent": "flex-end", "gap": "20px" }}>
                {
                    unfinishedTickets && unfinishedTickets.length<1 && 
                    <h1 style={{"textAlign":"center","margin":"0 auto"}}>
                        لا يوجد تذاكر في المخزن
                    </h1>
                }
                {
                    unfinishedTickets && unfinishedTickets.map((i, index) => (
                        <div className="ticketHolder" key={index} >
                            <span className="displayHidden"> {i.clientName} </span>
                            <br />
                            <span className="displayHidden"> {i.clientAddress} </span>
                            <br />
                            <span className="displayHidden"> {i.state} </span>
                            <div>
                                {
                                    i.type === 'out' ? <OutWeighs type={"old"} oldTicketId={index} userId={i.id}/> : <InWeights type={'old'} oldTicketId={index} userId={i.id} />
                                }
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}

export default MainPage;
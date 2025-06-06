const Wallet = require('../models/wallet')
const Order = require('../models/order')
const Client = require('../models/client')
const Iron = require('../models/iron')
const requireAuth = require('../config/auth')

const { isDateBetween } = require('../controllers/irons')
const subtractOneMonth = (dateStr) => {
    let date = new Date(dateStr);

    let year = date.getFullYear();
    let month = date.getMonth(); 

    if (month === 0) {
        year -= 1;
        month = 11; 
    } else {
        month -= 1;
    }

    date.setFullYear(year);
    date.setMonth(month);

    let formattedDate = formatDate(date);
    return formattedDate;
}

const formatDate = (date) => {
    let month = date.getMonth() + 1; 
    let day = date.getDate();
    let year = date.getFullYear();
    
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    
    let ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; 

    
    return `${month}/${day}/${year}, ${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${ampm}`;
}

const isBeforeByMonthYearOrEqual = (date1, date2) => {
    let d1 = new Date(date1);
    let d2 = new Date(date2);

    let year1 = d1.getFullYear();
    let month1 = d1.getMonth() + 1; 

    let year2 = d2.getFullYear();
    let month2 = d2.getMonth() + 1;

    if ((year2 <= year1 && month2 <= month1)) {
        return true;  
    }
    return false;
}

const isSameMonth = (date1Str, date2Str) => {
    const date1 = new Date(date1Str);
    const date2 = new Date(date2Str);
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() 
    );
}

const getBeginningOfMonthIronPrice = async(startDate) => {
    console.log(startDate)
    let ironList, ironMap = {};
    try {
        ironList = await Iron.find()
        for(let i of ironList){
            if(!(i.name in ironMap)){
                ironMap[i.name] = {}
            }
            for(let j of i["costPerWeight"]){
                if(i["radius"] in ironMap[i.name]){
                    let obj = {}
                    obj= {"weight":j["weight"],"unitCost":j["unitCostPerTon"],"id": j["_id"]}
                    ironMap[i.name][`${i["radius"]}`].push(obj)
                    
                } 
                else{
                    let obj = {"weight":j["weight"],"unitCost":j["unitCostPerTon"],"id": j["_id"]}
                    ironMap[i.name][`${i["radius"]}`] =[obj]
                }
            }
        }
        const orders = await Order.find({
            state: { $in: ["جاري انتظار الدفع", "منتهي"] }
        });
        // res.json({ironStorage:ironMap , total:1})
        const wantedDate = new Date(startDate);
        for(let order of orders){
            let orderDate = new Date(order.date)
            console.log("orderDate", orderDate, "wantedDate",wantedDate)
            if(isDateBetween(orderDate,wantedDate)){
                for(let ticket of order.ticket){
                    for(let consumedUnitPerWeight of ticket.usedUnitCostPerWeight){
                        let hasTheConsumedIron = false
                        for(let k = 0 ; k<ironMap[ticket.ironName][ticket.radius].length ; k++){
                            // console.log("ironId here: ",ironMap[ticket.ironName][ticket.radius][k] , "  order Id: ",order._id)
                            // console.log("OrderIronId: ",consumedUnitPerWeight, "  iron Id: ",ironMap[ticket.ironName][ticket.radius][k].id.toString())
                            if( consumedUnitPerWeight.ironId === ironMap[ticket.ironName][ticket.radius][k].id.toString()){
                                hasTheConsumedIron = true    
                                if(order.type === "out"){
                                    console.log("out before: ",ironMap[ticket.ironName][ticket.radius][k], "  ironName:  ", ticket.ironName,  "  radius:  ", ticket.radius)
                                    ironMap[ticket.ironName][ticket.radius][k].weight += consumedUnitPerWeight.weight
                                    console.log("out after: ",ironMap[ticket.ironName][ticket.radius][k])
                                }
                                else{
                                    console.log("in before: ",ironMap[ticket.ironName][ticket.radius][k], "  ironName:  ", ticket.ironName,  "  radius:  ", ticket.radius)
                                    ironMap[ticket.ironName][ticket.radius][k].weight -= consumedUnitPerWeight.weight
                                    console.log("in after: ",ironMap[ticket.ironName][ticket.radius][k])
                                }
                            }                            
                        }
                        // if(!hasTheConsumedIron){
                        //     ironMap[ticket.ironName][ticket.radius].push({"weight":consumedUnitPerWeight.weight,"unitCostPerTon":consumedUnitPerWeight.cost})
                        // }
                    }
                }
            }
        }
        let total = 0
        for (const ironName in ironMap) {
            const radii = ironMap[ironName];
            for (const radius in radii) {
              const items = radii[radius];
              for (const item of items) {
                if(item.weight>=0)
                    total+= parseFloat(item.weight/1000) * item.unitCost 
              }
            }
        }
        console.log(total)
        return total
    }
    catch(err){
        console.log(err)
    }
}

function getFirstDayOfCurrentMonth() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-indexed
  
    const firstDay = new Date(year, month, 1);
  
    const yyyy = firstDay.getFullYear();
    const mm = String(firstDay.getMonth() + 1).padStart(2, '0');
    const dd = String(firstDay.getDate()).padStart(2, '0');
  
    return `${yyyy}-${mm}-${dd}`;
}

const getProfitReportDataBasedOnDate = async(req,res)=>{
    let { monthAndYear } = req.body
    console.log("heree")
    console.log(monthAndYear)
    let soldOrders, iron,soldProfit = 0, purchasedPrice = 0, beginningOfMonthIronPrice = 0, endingOfMonthIronPrice = 0, totalProfitWithoutExpenses = 0, overAllTotalProfit = 0, deliveryFees = 0;
    let retObj, clients, totalDiscounts = 0;
    try{

        clients = await Client.find()

        for(let client of clients){
            for(let transaction of client["transactionsHistory"]){
                if(transaction.type === "خصم" && isSameMonth(transaction.date,monthAndYear)){
                    totalDiscounts += transaction.amount
                }
            }
        }

        iron = await Iron.find()
        soldOrders = await Order.find(
            {
                $or: [
                    { "state": "جاري انتظار الدفع" },
                    { "state": "منتهي" }
                ]
            }
        ) 
        // console.log(soldOrders.length)

        for(let order of soldOrders){
            console.log(order.date, monthAndYear)
            if(isSameMonth(order.date ,monthAndYear )){
                if(order.type === "out"){
                    soldProfit += order.realTotalPrice
                    deliveryFees += order.deliveryFees
                }
                if(order.type === "in"){
                    purchasedPrice+= order.realTotalPrice
                }
            }
        }

        let formattedSentMonthAndYear = monthAndYear
        // let monthBefore = subtractOneMonth(formattedSentMonthAndYear)
        for(let i of iron){
            for(let j of i.costPerWeight){
                if(isBeforeByMonthYearOrEqual(monthAndYear, j.date)){
                    console.log("inside")
                    endingOfMonthIronPrice += (parseFloat((j.weight / 1000)) * j.unitCostPerTon)
                }
            }
        }
        let formattedDay = getFirstDayOfCurrentMonth(formattedSentMonthAndYear)
        // console.log("formattedDay: ",formattedDay)
        beginningOfMonthIronPrice = await getBeginningOfMonthIronPrice(formattedDay)

        let companyExpensesDoc = await Client.findOne({"clientId":"4"})
        let companyExpenses = 0
        for(let i of companyExpensesDoc["purchasingNotes"]){
            if(isSameMonth(i.date,monthAndYear)){
                companyExpenses+=i.amount
            }
        }
       
        totalProfitWithoutExpenses = ((soldProfit + endingOfMonthIronPrice) - (purchasedPrice + beginningOfMonthIronPrice)) 
        overAllTotalProfit = (totalProfitWithoutExpenses - companyExpenses) - totalDiscounts
        console.log("totalDiscounts",totalDiscounts)
        let totalDeficitAndSurplusOfGoods = 0
        retObj = {
            totalDeficitAndSurplusOfGoods,soldProfit,purchasedPrice,beginningOfMonthIronPrice,endingOfMonthIronPrice,totalProfitWithoutExpenses,overAllTotalProfit
        }

    }
    catch(err){
        console.log(err)
    }
    res.json(retObj)

}

module.exports = {
    getProfitReportDataBasedOnDate
}
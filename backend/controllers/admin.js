const Wallet = require('../models/wallet')
const Order = require('../models/order')
const Client = require('../models/client')
const Iron = require('../models/iron')

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

const isBeforeByMonthYear = (date1, date2) => {
    let d1 = new Date(date1);
    let d2 = new Date(date2);

    let year1 = d1.getFullYear();
    let month1 = d1.getMonth() + 1; 

    let year2 = d2.getFullYear();
    let month2 = d2.getMonth() + 1;

    if (year2 < year1 || (year2 === year1 && month2 < month1)) {
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

const getProfitReportDataBasedOnDate = async(req,res)=>{
    let { monthAndYear } = req.body
    console.log(monthAndYear)
    let soldOrders, iron,soldProfit = 0, purchasedPrice = 0, beginningOfMonthIronPrice = 0, endingOfMonthIronPrice = 0, totalProfitWithoutExpenses = 0, overAllTotalProfit = 0;
    let retObj;
    try{
        iron = await Iron.find()
        soldOrders = await Order.find(
            {
                $or: [
                    { "state": "جاري انتظار الدفع" },
                    { "state": "منتهي" }
                ]
            }
        ) 
        console.log(soldOrders.length)

        for(let order of soldOrders){
            if(order.date === monthAndYear ){
                if(order.type === "out"){
                    soldProfit += order.totalProfit
                }
                if(order.type === "in"){
                    purchasedPrice+= order.realTotalPrice
                }
            }
        }

        let formattedSentMonthAndYear = monthAndYear
        console.log(formattedSentMonthAndYear)
        for(let i of iron){
            for(let j of i.costPerWeight){
                let monthBefore = subtractOneMonth(formattedSentMonthAndYear)
                if(isBeforeByMonthYear(formattedSentMonthAndYear, j.date)){
                    endingOfMonthIronPrice += (parseFloat((j.weight / 1000)) * j.unitCostPerTon)
                }
                if(isBeforeByMonthYear(monthBefore, j.date)){
                    beginningOfMonthIronPrice += (parseFloat((j.weight / 1000)) * j.unitCostPerTon)
                }
            }
        }

        let companyExpensesDoc = await Client.findOne({"clientId":"4"})
        console.log(companyExpensesDoc["purchasingNotes"])
        let companyExpenses = 0
        for(let i of companyExpensesDoc["purchasingNotes"]){
            if(isSameMonth(i.date,monthAndYear)){
                companyExpenses+=i.amount
            }
        }

        totalProfitWithoutExpenses = (soldProfit + endingOfMonthIronPrice) - (purchasedPrice + beginningOfMonthIronPrice) 
        overAllTotalProfit = totalProfitWithoutExpenses - companyExpenses

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
const {
  getDatabaseByName,
  updateDatabaseByName,
} = require("./databaseController");
const Order = require("../models/order");
const Client = require("../models/client");
const Iron = require("../models/iron");
const Wallet = require("../models/wallet");
const { ObjectId } = require('mongodb');
const mongoose = require("mongoose");
const getTicketsInfo = (req, res) => {
  let dataTickets = getDatabaseByName("Tickets");
  let inProgressTickets = [];
  for (let i of dataTickets) {
    if (i.state === "finished") {
      inProgressTickets.push(i);
    }
  }
  res.json(inProgressTickets);
};

function isSameDay(date1Str, date2Str) {
  const date1 = new Date(date1Str);
  const date2 = new Date(date2Str);
  console.log(date1, date2);
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

const getTicketsForDay = async (req, res) => {
  let orders,
    todayTickets = [];
  let { startDate } = req.body;
  try {
    orders = await Order.find();
    for (let i of orders) {
      // console.log(i.date, startDate)
      if (
        (i.state === "منتهي" || i.state === "جاري انتظار الدفع") &&
        isSameDay(i.date, startDate)
      ) {
        todayTickets.push(i);
      }
    }
  } catch (err) {
    console.log(err);
  }
  res.json(todayTickets);
};

const getUnfinishedOrdersInfoGroupedByClientId = async (req, res) => {
  let orders;
  let ordersSorted = {};
  try {
    orders = await Order.find({ state: "جاري انتظار التحميل" });
    for (let x of orders) {
      if (x.clientId in ordersSorted) {
        let newArr = ordersSorted[`${x.clientId}`];
        newArr.push(x);
        ordersSorted[`${x.clientId}`] = newArr;
      } else {
        ordersSorted[`${x.clientId}`] = [x];
      }
    }
  } catch (err) {
    console.log(err);
  }
  res.json(ordersSorted);
};

const getUnfinishedOrdersInfoGroupedByType = async (req, res) => {
  let orders;
  let inOrders = [],
    outOrders = [];
  try {
    orders = await Order.find({ state: "جاري انتظار التحميل" });
    for (let x of orders) {
      if (x.type === "in") {
        inOrders.push(x);
      } else {
        outOrders.push(x);
      }
    }
  } catch (err) {
    console.log(err);
  }
  res.json({ inOrders, outOrders });
};

const getNewOrdersInfoGroupedByType = async (req, res) => {
  let orders;
  let inOrders = [],
    outOrders = [];
  try {
    orders = await Order.find({ state: "جديد" });
    console.log(orders)
    for (let x of orders) {
      if (x.type === "in") {
        inOrders.push(x);
      } else {
        outOrders.push(x);
      }
    }
  } catch (err) {
    console.log(err);
  }
  res.json({ inOrders, outOrders });
};

const getAwaitForPaymentOrdersGroupedByType = async (req, res) => {
  let orders;
  let inOrders = [],
    outOrders = [];
  try {
    orders = await Order.find({ state: "جاري انتظار الدفع" });
    for (let x of orders) {
      if (x.type === "in") {
        inOrders.push(x);
      } else {
        outOrders.push(x);
      }
    }
  } catch (err) {
    console.log(err);
  }
  res.json({ inOrders, outOrders });
};

const getFinishedOrdersInfoGroupedByType = async (req, res) => {
  let orders;
  let inOrders = [],
    outOrders = [];
  try {
    orders = await Order.find({
      state: "منتهي",
    });
    for (let x of orders) {
      if (x.type === "in") {
        inOrders.push(x);
      } else {
        outOrders.push(x);
      }
    }
  } catch (err) {
    console.log(err);
  }
  res.json({ inOrders, outOrders });
};

const getSpecificTicket = async (req, res) => {
  let { id } = req.params;
  console.log(id);
  let order;
  try {
    order = await Order.findById(id);
  } catch (err) {
    console.log(err);
  }
  res.json(order);
};

const EditOrderTicket = async (req, res) => {
  const { orderId, ticket, ticketId } = req.body;
  console.log(ticket, ticketId);
  const orderTickets = await Order.findById(orderId);
  if(orderTickets.type === 'out'){
    let ironData = await Iron.findOne({
      $and: [
        { name: orderTickets.ticket[ticketId].ironName },
        { radius: orderTickets.ticket[ticketId].radius },
      ],
    });
    let ironFullExistWeight = 0;
    ironData?.costPerWeight?.map((el) => {
      ironFullExistWeight += el.weight;
    });
    if (ironFullExistWeight < ticket[ticketId].neededWeight) {
      console.log("here in 400")
      return res.status(400).json({
        error: "Not enough data of that iron available",
        availableWeight: ironFullExistWeight,
      });
    }
  }
  let newOrder;
  try {
    newOrder = await Order.findById(orderId);
    newOrder.ticket = ticket;
    let orderUpdate = await Order.updateOne({ _id: orderId }, newOrder);
    let inOrders = [],
      outOrders = [];
    let orders;
    orders = await Order.find({ state: "جاري التحميل" });
    for (let x of orders) {
      if (x.type === "in") {
        inOrders.push(x);
      } else {
        outOrders.push(x);
      }
    }

    res.json({ orderUpdate, outOrders, inOrders });
  } catch (err) {
    console.log(err);
  }
};

const EditOrderFirstWeight = async (req, res) => {
  const { firstWeight, orderId } = req.body;
  let newOrder;
  console.log(firstWeight, orderId);
  try {
    newOrder = await Order.findById(orderId);
    let d = new Date().toLocaleString("en-EG", { timeZone: "Africa/Cairo" });
    let dateArr = d.split(",");
    let firstWeightObject = {
      weight: firstWeight,
      date: dateArr[0] + "," + dateArr[1],
    };
    let orderUpdate = await Order.updateOne(
      { _id: orderId },
      { firstWeight: firstWeightObject }
    );
    let inOrders = [],
      outOrders = [];
    let orders;
    orders = await Order.find({ state: "جاري انتظار التحميل" });
    for (let x of orders) {
      if (x.type === "in") {
        inOrders.push(x);
      } else {
        outOrders.push(x);
      }
    }

    res.json({ orderUpdate, outOrders, inOrders });
  } catch (err) {
    console.log(err);
  }
};

function isSameDay(date1Str, date2Str) {
  const date1 = new Date(date1Str);
  const date2 = new Date(date2Str);

  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

const addOrder = async (req, res) => {
  const {
    ticket,
    type,
    clientId,
    driverId,
    carId,
    totalPrice,
    deliveryFees,
    date,
    clientName,
    password
  } = req.body;
  console.log("clientId",clientId,"clientName",clientName)
  let newOrder = null;
  try {
    if(type === "out"){
      let exceededIronArr = []
      for (let i = 0; i < ticket.length; i++) {
        console.log(ticket[i])
        let storage = await Iron.findOne(
          {
            $and: [
              { name: ticket[i].ironName },
              { radius: ticket[i].radius },
            ],
          }
        )
        let sum = 0
        console.log(storage)
        if(storage != null)
          for(let j = 0 ; j<storage.costPerWeight.length;j++){
            sum+= storage.costPerWeight[j].weight
          }
        if(sum<ticket[i].neededWeight){
          let errStr = "لا يوجد حديد كافي من نوع " + ticket[i].ironName + "، قطر " + ticket[i].radius;
          exceededIronArr.push(errStr)
        }
      }

      if(exceededIronArr.length>0){
        res.json({newOrder,exceededIronArr});
        return
      }
    }
    newOrder = new Order({
      clientName,
      state: isSameDay(date, new Date()) ? "جاري انتظار التحميل" : "جديد",
      type,
      clientId,
      driverId,
      carId,
      ticket,
      totalPrice,
      deliveryFees,
      date,
    });
    if(password === "alkudsprod123"){
      newOrder.state = 'منتهي'
      for (let i = 0; i < newOrder.ticket.length; i++) {
        newOrder.ticket[i].date = date
        await Iron.findOneAndUpdate(
          {
            $and: [
              { name: newOrder.ticket[i].ironName },
              { radius: newOrder.ticket[i].radius },
            ],
          },
          {
            $push: {
              costPerWeight: {
                unitCostPerTon: newOrder.ticket[i].unitPrice,
                weight: newOrder.ticket[i].neededWeight,
              },
            },
          },
          { upsert: true, returnDocument: "after" }
        )
      }
    
    }
    newOrder.save().then(async (data) => {
      await Client.updateOne(
        { clientId },
        {
          $push: {
            ticketsIds: data._id.toString(),
          },
        }
      );
    });
    
  } catch (err) {
    console.log(err);
  }

  res.json(newOrder);
};

function isDateBefore(firstDateStr, secondDateStr) {
  const firstDate = new Date(firstDateStr);
  const secondDate = new Date(secondDateStr);

  return firstDate <= secondDate;
}

function createData(
  type,
  state,
  totalPrice,
  paidAmount,
  date,
  tickets,
  statements
) {
  return {
    type,
    state,
    totalPrice,
    paidAmount,
    date,
    tickets,
    statements,
  };
}

const getClientOrders = async (req, res) => {
  const { id, date } = req.body;
  let orders,
    orderByDate = [],
    ordersParsedAndCleaned = [],
    price = 0,
    paid = 0,
    profit = 0;
  try {
    orders = await Order.find({ clientId: id });
    for (let order of orders) {
      let orderDate = new Date(order.date);
      if (isDateBefore(orderDate, date)) {
        orderByDate.push(order);
      }
    }
    console.log(orderByDate.length);
    for (let i = 0; i < orderByDate.length; i++) {
      price += orderByDate[i].realTotalPrice;
      paid += orderByDate[i].totalPaid;
      profit += orderByDate[i].totalProfit + orderByDate[i].deliveryFees;
      let tickets = [],
        statements = [];
      for (let j = 0; j < orderByDate[i]["ticket"].length; j++) {
        tickets.push({
          ironName: orderByDate[i]["ticket"][j].ironName,
          radius: orderByDate[i]["ticket"][j].radius,
          netWeight: orderByDate[i]["ticket"][j].netWeight,
          price: orderByDate[i]["ticket"][j].unitPrice,
        });
      }
      for (let j = 0; j < orderByDate[i]["statement"].length; j++) {
        statements.push({
          walletId: orderByDate[i]["statement"][j].walletTransactionId,
          bankName: orderByDate[i]["statement"][j].bankName,
          paidAmount: orderByDate[i]["statement"][j].paidAmount,
          date: orderByDate[i]["statement"][j].date,
        });
      }

      ordersParsedAndCleaned.push(
        createData(
          orderByDate[i].type,
          orderByDate[i].state,
          orderByDate[i].realTotalPrice,
          orderByDate[i].totalPaid,
          orderByDate[i].date,
          tickets,
          statements
        )
      );
    }
  } catch (err) {
    console.log(err);
  }
  res.json({ orders: ordersParsedAndCleaned, paid, price, profit });
};

const OrderFinishState = async (req, res) => { 
    const { orderId } = req.body;
    let updatedOrder,client, newUpdatedOrder, balanceUpdate
    try {
        updatedOrder = await Order.findById({ _id: orderId })
        client = await Client.findOne({"clientId":updatedOrder.clientId})
    }
    catch (err) {
        console.log(err)
    }
    try{
    let totalProfitForOrder = 0, totalPrice = 0, addedPaidPrice = 0;
    const orderTickets = updatedOrder.ticket
    if(updatedOrder.type === "out"){
        for (let i = 0; i < orderTickets.length; i++) {
            let totalTicketPrice = parseFloat((orderTickets[i].netWeight / 1000)) * orderTickets[i].unitPrice 
            orderTickets[i].realTotalPrice = totalTicketPrice
            totalPrice += totalTicketPrice
            let ironData = await Iron.findOne({
                $and: [
                    { "name": orderTickets[i].ironName },
                    { "radius": orderTickets[i].radius }
                ]
            });
            let profit = 0, totalCostForTicket = 0;
            for (let j = 0; j < ironData.costPerWeight.length; j++) {
                let totalInventoryWeight = ironData.costPerWeight[j].weight;
                let totalNeededWeight = orderTickets[i].netWeightForProcessing;
                let differenceBetweenNeededAndInventory = totalInventoryWeight - totalNeededWeight;
                if (totalInventoryWeight > 0) {
                    if (differenceBetweenNeededAndInventory >= 0) {
                        ironData.costPerWeight[j].weight = differenceBetweenNeededAndInventory

                        totalCostForTicket = ironData.costPerWeight[j].unitCostPerTon * parseFloat((totalNeededWeight / 1000))
                        profit = (orderTickets[i].unitPrice * parseFloat((totalNeededWeight / 1000))) - totalCostForTicket
                        orderTickets[i].profit += profit
                        orderTickets[i].netWeightForProcessing = 0;
                        orderTickets[i].totalCost += totalCostForTicket
                        orderTickets[i].usedUnitCostPerWeight.push({
                            weight: totalNeededWeight,
                            cost: ironData.costPerWeight[j].unitCostPerTon,
                            ironId: ironData.costPerWeight[j]._id
                        })
                        break;
                    }
                    else {
                        ironData.costPerWeight[j].weight = 0
                        totalCostForTicket = (ironData.costPerWeight[j].unitCostPerTon * parseFloat((totalInventoryWeight / 1000)))
                        profit = (orderTickets[i].unitPrice * parseFloat((totalInventoryWeight / 1000))) - totalCostForTicket
                        orderTickets[i].totalCost += totalCostForTicket
                        orderTickets[i].profit += profit
                        orderTickets[i].netWeightForProcessing = orderTickets[i].netWeightForProcessing - totalInventoryWeight
                        orderTickets[i].usedUnitCostPerWeight.push({
                            weight: totalInventoryWeight,
                            cost: ironData.costPerWeight[j].unitCostPerTon,
                            ironId: ironData.costPerWeight[j]._id
                        })
                    }
                }
            }

      totalProfitForOrder += orderTickets[i].profit;
      await Iron.updateOne(
        {
          $and: [
            { name: orderTickets[i].ironName },
            { radius: orderTickets[i].radius },
          ],
        },
        {
          costPerWeight: ironData.costPerWeight,
        }
      );
    }
    if (client.balance < 0) {
      let inClientOrders = await Order.find({
        $and: [
          { clientId: updatedOrder.clientId },
          { type : "in" },
          { state: "جاري انتظار الدفع" },
        ],
      }).sort({ date: 1 });
      let remainingTotalPrice = totalPrice;
      let isOutOrders = false;
      for (let i of inClientOrders) {
        isOutOrders = true;
        console.log(
          "remainingTotalPrice",
          remainingTotalPrice,
          "(i.realTotalPrice-i.paidAmount)",
          i.realTotalPrice - i.totalPaid
        );
        let deltaTotalPriceAndInOrderPrice =
          remainingTotalPrice - (i.realTotalPrice - i.totalPaid);
        if (deltaTotalPriceAndInOrderPrice >= 0) {
          // totalPrice -= (i.realTotalPrice - i.totalPaid)
          console.log("total price: ", totalPrice);
          console.log("deltaTotalPriceAndInOrderPrice", deltaTotalPriceAndInOrderPrice);
          client.balance += deltaTotalPriceAndInOrderPrice;
          console.log("client.balance after", client.balance);
          console.log("here befire save new state")
          updatedOrder.state = 'منتهي'
          updatedOrder.affectedOrders.push({
            orderId:i._id,
            paidAmount : i.realTotalPrice - i.totalPaid,
            previousState : i.state
          })
          i.state = "منتهي";
          i.statement.push({
            paidAmount: i.realTotalPrice - i.totalPaid,
            clientId: i.clientId,
            bankName: "تم سحبه تلقائي من رصيد العميل",
            date: new Date().toLocaleString("en-EG", {
              timeZone: "Africa/Cairo",
            }),
            walletTransactionId: "لا يوجد",
          });
          i.totalPaid = i.realTotalPrice;
          remainingTotalPrice = deltaTotalPriceAndInOrderPrice;
          await i.save();
          await updatedOrder.save()
        } else {
          // totalPrice = (i.realTotalPrice - i.totalPaid)
          i.totalPaid += remainingTotalPrice + updatedOrder.deliveryFees;
          updatedOrder.state = 'منتهي'
          updatedOrder.affectedOrders.push({
            orderId:i._id,
            paidAmount : i.realTotalPrice - i.totalPaid,
            previousState : i.state
          })
          i.statement.push({
            paidAmount: remainingTotalPrice,
            clientId: i.clientId,
            bankName: "تم سحبه تلقائي من رصيد العميل",
            date: new Date().toLocaleString("en-EG", {
              timeZone: "Africa/Cairo",
            }),
            walletTransactionId: "لا يوجد",
          });
          remainingTotalPrice = 0;
          await updatedOrder.save()
          await i.save();
          break;
        }
      }
      // remaining total current order price = 241,000
      //                      client balance = -150,000
      if (isOutOrders && inClientOrders.length>0) {  
        console.log("here first if")
        newUpdatedOrder = await Order.findOneAndUpdate(
          { _id: orderId },
          {
            ticket: orderTickets,
            totalProfit: totalProfitForOrder,
            realTotalPrice: totalPrice + updatedOrder.deliveryFees,
            state:remainingTotalPrice>0? "جاري انتظار الدفع" : "منتهي",
            totalPaid: remainingTotalPrice>=0 ? totalPrice - remainingTotalPrice :0 ,
            $push: {
              statement: {
                paidAmount: remainingTotalPrice>=0 ? totalPrice - remainingTotalPrice :0,
                clientId: updatedOrder.clientId,
                bankName: "تم سحبه تلقائي من رصيد العميل",
                date: new Date().toLocaleString("en-EG", {
                  timeZone: "Africa/Cairo",
                }),
                walletTransactionId: "لا يوجد",
              },
            },
          },
          { returnDocument: "after" }
        );
      } else if (!isOutOrders) {
        console.log("here SECOND if")
        if (client.balance + (totalPrice + updatedOrder.deliveryFees) <= 0) {
          newUpdatedOrder = await Order.findOneAndUpdate(
            { _id: orderId },
            {
              ticket: orderTickets,
              totalProfit: totalProfitForOrder,
              realTotalPrice: totalPrice + updatedOrder.deliveryFees,
              state: "منتهي",
              totalPaid: totalPrice + updatedOrder.deliveryFees,
              $push: {
                statement: {
                  paidAmount: totalPrice + updatedOrder.deliveryFees,
                  clientId: updatedOrder.clientId,
                  bankName: "تم سحبه تلقائي من رصيد العميل",
                  date: new Date().toLocaleString("en-EG", {
                    timeZone: "Africa/Cairo",
                  }),
                  walletTransactionId: "لا يوجد",
                },
              },
            },
            { returnDocument: "after" }
          );
        } else if (
          client.balance + (totalPrice + updatedOrder.deliveryFees) >
          0
        ) {
          console.log("client balance", client.balance);
          console.log("remainingTotalPrice", remainingTotalPrice);
          console.log("addedPaidPrice", addedPaidPrice);
          newUpdatedOrder = await Order.findOneAndUpdate(
            { _id: orderId },
            {
              ticket: orderTickets,
              totalProfit: totalProfitForOrder,
              realTotalPrice: totalPrice + updatedOrder.deliveryFees,
              state: "جاري انتظار الدفع",
              totalPaid: Math.abs(client.balance),
              statement: {
                paidAmount: Math.abs(client.balance) + addedPaidPrice,
                clientId: updatedOrder.clientId,
                bankName: "تم سحبه تلقائي من رصيد العميل",
                date: new Date().toLocaleString("en-EG", {
                  timeZone: "Africa/Cairo",
                }),
                walletTransactionId: "لا يوجد",
              },
            },
            { returnDocument: "after" }
          );
        }
      }
    } 
    else if (client.balance >= 0) {
      newUpdatedOrder = await Order.findOneAndUpdate(
        { _id: orderId },
        {
          ticket: orderTickets,
          totalProfit: totalProfitForOrder,
          realTotalPrice: totalPrice + updatedOrder.deliveryFees,
          state: "جاري انتظار الدفع",
        },
        { returnDocument: "after" }
      );
    }

    balanceUpdate = await Client.findOneAndUpdate(
      { clientId: updatedOrder.clientId },
      {
        $inc: { balance: totalPrice + updatedOrder.deliveryFees },
        $push: {
          transactionsHistory: {
            amount: totalPrice + updatedOrder.deliveryFees,
            type: "out",
          },
        },
      },
      { returnDocument: "after" }
    );
  } 
  else {
    let realTotalPrice = 0,
      ironId = "";
    for (let i = 0; i < orderTickets.length; i++) {
      await Iron.findOneAndUpdate(
        {
          $and: [
            { name: orderTickets[i].ironName },
            { radius: orderTickets[i].radius },
          ],
        },
        {
          $push: {
            costPerWeight: {
              unitCostPerTon: orderTickets[i].unitPrice,
              weight: orderTickets[i].netWeight,
            },
          },
        },
        { upsert: true, returnDocument: "after" }
      ).then((res) => {
        ironId =
          res["costPerWeight"][res["costPerWeight"].length - 1]._id.toString();
      });
      orderTickets[i].usedUnitCostPerWeight.push({
        weight: orderTickets[i].netWeight,
        cost: orderTickets[i].unitPrice,
        ironId,
      });
      orderTickets[i].realTotalPrice =
        orderTickets[i].unitPrice *
        parseFloat(orderTickets[i].netWeight / 1000);
      realTotalPrice += orderTickets[i].realTotalPrice;
    }

    if(client.balance>0){
      // 411,000
      //690,000
      let outClientOrders = await Order.find({
        $and: [
          { clientId: updatedOrder.clientId },
          { state: "جاري انتظار الدفع" },
        ],
      }).sort({ date: 1 });
      let remainingTotalPrice = realTotalPrice;
      //690,000
      let isInOrders = false;
      for (let i of outClientOrders) {
        isInOrders = true;
        console.log(
          "remainingTotalPrice",
          remainingTotalPrice,
          "(i.realTotalPrice-i.paidAmount)",
          i.realTotalPrice - i.totalPaid
        );
        let deltaTotalPriceAndInOrderPrice =
          remainingTotalPrice - (i.realTotalPrice - i.totalPaid);
          //279,000
        if (deltaTotalPriceAndInOrderPrice >= 0) {
          client.balance -= (i.realTotalPrice - i.totalPaid);
          console.log("client.balance after", client.balance);
          updatedOrder.affectedOrders.push({
            orderId:i._id,
            paidAmount : i.realTotalPrice - i.totalPaid,
            previousState : i.state
          })
          i.state = "منتهي";
          i.statement.push({
            paidAmount: i.realTotalPrice - i.totalPaid,
            clientId: i.clientId,
            bankName: "تم سحبه تلقائي من رصيد العميل",
            date: new Date().toLocaleString("en-EG", {
              timeZone: "Africa/Cairo",
            }),
            walletTransactionId: "لا يوجد",
          });
          i.totalPaid = i.realTotalPrice;
          remainingTotalPrice = deltaTotalPriceAndInOrderPrice;
          await i.save();
          await updatedOrder.save()
        } else {
          i.totalPaid += remainingTotalPrice + updatedOrder.deliveryFees;
          updatedOrder.affectedOrders.push({
            orderId:i._id,
            paidAmount : i.realTotalPrice - i.totalPaid,
            previousState : i.state
          })
          i.statement.push({
            paidAmount: remainingTotalPrice,
            clientId: i.clientId,
            bankName: "تم سحبه تلقائي من رصيد العميل",
            date: new Date().toLocaleString("en-EG", {
              timeZone: "Africa/Cairo",
            }),
            walletTransactionId: "لا يوجد",
          });
          remainingTotalPrice = 0;
          await updatedOrder.save()
          await i.save();
          break;
        }
      }

      if (isInOrders && outClientOrders.length>0) {  
        newUpdatedOrder = await Order.findOneAndUpdate(
          { _id: orderId },
          {
            ticket: orderTickets,
            realTotalPrice: realTotalPrice + updatedOrder.deliveryFees,
            state: "جاري انتظار الدفع",
            totalPaid: remainingTotalPrice>=0 ? totalPrice - remainingTotalPrice :0 ,
            $push: {
              statement: {
                paidAmount: remainingTotalPrice>=0 ?totalPrice - remainingTotalPrice : 0,
                clientId: updatedOrder.clientId,
                bankName: "تم سحبه تلقائي من رصيد العميل",
                date: new Date().toLocaleString("en-EG", {
                  timeZone: "Africa/Cairo",
                }),
                walletTransactionId: "لا يوجد",
              },
            },
          },
          { returnDocument: "after" }
        );
      } else if (!isInOrders) {
        if (client.balance + (-realTotalPrice) <0) {
          newUpdatedOrder = await Order.findOneAndUpdate({ _id: orderId }, { ticket: orderTickets, realTotalPrice, state : "جاري انتظار الدفع" , totalPaid : client.balance, 
            $push:{ statement: {
                "paidAmount":client.balance,
                "clientId": updatedOrder.clientId,
                "bankName" : "تم سحبه تلقائي من رصيد العميل عند الشركه",
                "date": new Date().toLocaleString('en-EG', { timeZone: 'Africa/Cairo' }),
                "walletTransactionId" : "لا يوجد"
            }
          }}, { returnDocument: 'after' })

        } else if (
          client.balance + (-realTotalPrice) >=0
        ) {
          console.log("client balance", client.balance);
          console.log("remainingTotalPrice", remainingTotalPrice);
          console.log("addedPaidPrice", addedPaidPrice);
          newUpdatedOrder = await Order.findOneAndUpdate({ _id: orderId }, { ticket: orderTickets, realTotalPrice, state : "منتهي" , totalPaid : realTotalPrice, $push:{ statement: {
              "paidAmount":realTotalPrice,
              "clientId": updatedOrder.clientId,
              "bankName" : "تم سحبه تلقائي من رصيد العميل عند الشركه",
              "date": new Date().toLocaleString('en-EG', { timeZone: 'Africa/Cairo' }),
              "walletTransactionId" : "لا يوجد"
            }
          }}, { returnDocument: 'after' })
         
        
        }
      }

    }
    else{
      newUpdatedOrder = await Order.findOneAndUpdate({ _id: orderId }, { ticket: orderTickets, realTotalPrice, state : "جاري انتظار الدفع"}, { returnDocument: 'after' })

    }   
    balanceUpdate = await Client.findOneAndUpdate( 
        {clientId:updatedOrder.clientId},
        {
            $inc: { balance: -realTotalPrice },
            $push: {
                'transactionsHistory': { amount:realTotalPrice, type : "in"}
            },
            
        },
        {
            returnDocument: 'after'
        }
    )
    console.log(balanceUpdate)
    }
    }
    catch(err){
        console.log(err)
    }
    console.log("here new order updated: ",newUpdatedOrder)
    res.json({newUpdatedOrder, balanceUpdate});

}

const ticketUpdateTransaction = async (req, res) => {
  const { paidAmount, bankName, clientId, orderId } = req.body;
  let newOrder, newTransaction;
  try {
    let newStatement = {
      paidAmount,
      bankName,
      clientId,
    };
    newOrder = await Order.findOneAndUpdate(
      { _id: orderId },
      { $push: { statement: newStatement }, $inc: { totalPaid: paidAmount } },
      { returnDocument: "after" }
    );
    newTransaction = await Wallet.findOneAndUpdate(
      {
        bankName,
      },
      {
        $psuh: {
          transactions: { amount: paidAmount, clientId, type, orderId },
        },
      }
    );
  } catch (err) {
    console.log(err);
  }

  res.json(newOrder);
};

const TicketDelete = (req, res) => {
  let { id } = req.params;
  let db = getDatabaseByName("Tickets");
  for (let i = 0; i < db.length; i++) {
    if (db[i].id === id) {
      db[i].state = "deleted";
    }
  }
  updateDatabaseByName("Tickets", JSON.stringify(db));

  res.json({ msg: "success" });
};

const addOrderStatement = async (req, res) => {
  const { orderId, bankName, amount, type } = req.body;
  console.log(orderId, bankName, amount, type);
  let statement, order, walletTransaction, walletId;
  try {
    let order = await Order.findById(orderId);
    walletTransaction = await Wallet.findOneAndUpdate(
      {
        bankName,
      },
      {
        $push: {
          transactions: {
            amount: parseFloat(amount),
            clientId: order.clientId,
            type,
            orderId,
          },
        },
      },
      {
        returnDocument: "after",
      }
    );
    console.log(walletTransaction);
    order.statement.push({
      paidAmount: amount,
      clientId: order.clientId,
      bankName: bankName,
      date: new Date().toLocaleString("en-EG", { timeZone: "Africa/Cairo" }),
      walletTransactionId:
        walletTransaction.transactions[
          walletTransaction.transactions.length - 1
        ].orderId,
    });

    if (order.realTotalPrice <= amount + order.totalPaid) {
      statement = await Order.findOneAndUpdate(
        { _id: order._id },
        {
          statement: order.statement,
          state: "منتهي",
          totalPaid: order.realTotalPrice,
        },
        { returnDocument: "after" }
      );
    } else if (order.realTotalPrice > amount + order.totalPaid) {
      statement = await Order.findOneAndUpdate(
        { _id: order._id },
        { statement: order.statement, $inc: { totalPaid: amount } },
        { returnDocument: "after" }
      );
    }
    let client = await Client.findOneAndUpdate(
      { clientId: order.clientId },
      { $inc: { balance: -amount } }
    );
  } catch (err) {
    console.log(err);
  }

  res.json(statement);
};

const OrderIronPriceUpdate = async (req, res) => {
  const { order } = req.body;
  let newPriceUpdate;
  try {
    newPriceUpdate = await Order.findByIdAndUpdate(
      { _id: order._id },
      { order },
      { returnDocument: "after" }
    );
  } catch (err) {
    console.log(err);
  }
  res.json(newPriceUpdate);
};

const orderChangeState = async (req, res) => {
  const { _id } = req.body;
  let newUpdate;
  try {
    newUpdate = await Order.findByIdAndUpdate(
      { _id },
      { state: "جاري انتظار التحميل" }
    );
  } catch (err) {
    console.log(err);
  }
  res.json(newUpdate);
};

const deleteOrders =  async(req,res)=>{
  let del
  try{
      del = await Order.deleteMany({})
      return del
  }
  catch(err){
      console.log(err)
  }
  return del
}

const revertOrder = async(req,res) =>{
  let { order } = req.body
  try{
    for(let i of order.affectedOrders){
      let newOrder = await Order.findOne({"_id":i.orderId})
      newOrder.state = i.previousState
      newOrder.totalPaid -= i.paidAmount 
      if(newOrder.statement.length > 0)
      newOrder.statement.pop()
      await newOrder.save()
    }

    for(let tick of order.ticket){
      for(let iron of tick.usedUnitCostPerWeight){
        let ironToRevert = await Iron.findOneAndUpdate(
          {
            "costPerWeight._id": iron.ironId
          },
          {
            $inc:{  "costPerWeight.$.weight": iron.weight }
          }
        )
        console.log(ironToRevert)
      }
    }

    let clientUpdate = await Client.findOne({ 'clientId': order.clientId })

    let lastTransaction = clientUpdate.transactionsHistory[clientUpdate.transactionsHistory.length-1]
    if(lastTransaction.type === "out"){
      clientUpdate.balance -= lastTransaction.amount
    }
    else{
      clientUpdate.balance += lastTransaction.amount
    }

    clientUpdate.transactionsHistory.pop()
    clientUpdate.ticketsIds.pop()

    await clientUpdate.save()

    await Order.findOneAndDelete({'_id':order._id})

    let clients = await Client.find(),clientsMap = {};
    for(x of clients){
        clientsMap[x.clientId] = x
    }

    let inOrders  = [],outOrders = [];
    let awaitOrders = await Order.find({ state: "جاري انتظار الدفع" });
    for (let x of awaitOrders) {
      if (x.type === "in") {
        inOrders.push(x);
      } else {
        outOrders.push(x);
      }
    }

    let inOrdersFinished = [], outOrdersFinished = []
    let finishedOrders = await Order.find({
      state: "منتهي",
    });
    for (let x of finishedOrders) {
      if (x.type === "in") {
        inOrdersFinished.push(x);
      } else {
        outOrdersFinished.push(x);
      }
    }

    res.json({"message":"success", "clients":clientsMap, "finishedOrders":{"inOrders":inOrdersFinished,"outOrders": outOrdersFinished}, "awaitOrders":{"inOrders":inOrders,"outOrders":outOrders}})

  }
  catch(err){
    console.log(err)
    res.json({"message":"fail"})
  }
}

module.exports = {
  getUnfinishedOrdersInfoGroupedByClientId,
  getUnfinishedOrdersInfoGroupedByType,
  getNewOrdersInfoGroupedByType,
  getTicketsInfo,
  addOrder,
  OrderFinishState,
  getSpecificTicket,
  getTicketsForDay,
  TicketDelete,
  EditOrderTicket,
  ticketUpdateTransaction,
  EditOrderFirstWeight,
  getFinishedOrdersInfoGroupedByType,
  getAwaitForPaymentOrdersGroupedByType,
  getClientOrders,
  addOrderStatement,
  OrderIronPriceUpdate,
  orderChangeState,
  deleteOrders,
  revertOrder
};

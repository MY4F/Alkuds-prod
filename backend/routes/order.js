const express = require('express');
const router = express.Router();
const Order = require('../models/order')
const {orderChangeState, getNewOrdersInfoGroupedByType, OrderIronPriceUpdate, addOrderStatement, getClientOrders, getAwaitForPaymentOrdersGroupedByType, getFinishedOrdersInfoGroupedByType, EditOrderFirstWeight, ticketUpdateTransaction, addOrder , EditOrderTicket, getSpecificClientOrders, getTicketsInfo,getUnfinishedOrdersInfoGroupedByClientId,getUnfinishedOrdersInfoGroupedByType, OrderFinishState, getSpecificTicket, getTicketsForDay, TicketDelete} = require('../controllers/order'); 

router.get("/getUnfinishedOrdersInfoGroupedByClientId", getUnfinishedOrdersInfoGroupedByClientId)
router.get("/getUnfinishedOrdersInfoGroupedByType", getUnfinishedOrdersInfoGroupedByType)
router.get("/getFinishedOrdersInfoGroupedByType", getFinishedOrdersInfoGroupedByType)
router.get("/getNewOrdersInfoGroupedByType", getNewOrdersInfoGroupedByType)
router.get("/getAwaitForPaymentOrdersGroupedByType", getAwaitForPaymentOrdersGroupedByType)
router.post("/getTicketsForDay", getTicketsForDay)
router.get("/getClientOrders/:id", getClientOrders)
router.get("/getSpecificTicket/:id", getSpecificTicket)
router.post("/addOrder", addOrder)
router.post("/EditOrderTicket", EditOrderTicket)
router.post("/ticketAddSatetment", ticketUpdateTransaction)
router.post("/EditOrderFirstWeight", EditOrderFirstWeight)
router.post("/addOrderStatement", addOrderStatement)
router.post("/orderFinishState", OrderFinishState)
router.post("/orderIronPriceUpdate", OrderIronPriceUpdate)
router.post("/orderChangeState", orderChangeState)
router.get('/deleteOrders',async(req,res)=>{
    try{
        const del = await Order.deleteMany({})
        res.json(del)
    }
    catch(err){
        console.log(err)
    }
})





module.exports = router;
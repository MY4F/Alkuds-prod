const express = require('express');
const router = express.Router();
const Order = require('../models/order')
const requireAuth = require('../config/auth')
const {orderChangeState, getNewOrdersInfoGroupedByType, OrderIronPriceUpdate, addOrderStatement, getClientOrders, getAwaitForPaymentOrdersGroupedByType, getFinishedOrdersInfoGroupedByType, EditOrderFirstWeight, ticketUpdateTransaction, addOrder , EditOrderTicket, getSpecificClientOrders, getTicketsInfo,getUnfinishedOrdersInfoGroupedByClientId,getUnfinishedOrdersInfoGroupedByType, OrderFinishState, getSpecificTicket, getTicketsForDay, TicketDelete} = require('../controllers/order'); 

router.get("/getUnfinishedOrdersInfoGroupedByClientId",requireAuth, getUnfinishedOrdersInfoGroupedByClientId)
router.get("/getUnfinishedOrdersInfoGroupedByType", requireAuth,getUnfinishedOrdersInfoGroupedByType)
router.get("/getFinishedOrdersInfoGroupedByType",requireAuth, getFinishedOrdersInfoGroupedByType)
router.get("/getNewOrdersInfoGroupedByType",requireAuth, getNewOrdersInfoGroupedByType)
router.get("/getAwaitForPaymentOrdersGroupedByType", requireAuth,getAwaitForPaymentOrdersGroupedByType)
router.post("/getTicketsForDay",requireAuth, getTicketsForDay)
router.post("/getClientOrders/",requireAuth, getClientOrders)
router.get("/getSpecificTicket/:id", getSpecificTicket)
router.post("/addOrder",requireAuth, addOrder)
router.post("/EditOrderTicket",requireAuth, EditOrderTicket)
router.post("/ticketAddSatetment",requireAuth, ticketUpdateTransaction)
router.post("/EditOrderFirstWeight",requireAuth, EditOrderFirstWeight)
router.post("/addOrderStatement",requireAuth, addOrderStatement)
router.post("/orderFinishState",requireAuth, OrderFinishState)
router.post("/orderIronPriceUpdate",requireAuth, OrderIronPriceUpdate)
router.post("/orderChangeState",requireAuth, orderChangeState)
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
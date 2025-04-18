const express = require('express');
const router = express.Router();
const {OrderIronPriceUpdate, addOrderStatement, getClientOrders, getAwaitForPaymentOrdersGroupedByType, getFinishedOrdersInfoGroupedByType, EditOrderFirstWeight, ticketUpdateTransaction, addOrder , EditOrderTicket, getSpecificClientOrders, getTicketsInfo,getUnfinishedOrdersInfoGroupedByClientId,getUnfinishedOrdersInfoGroupedByType, OrderFinishState, getSpecificTicket, getTicketsForDay, TicketDelete} = require('../controllers/order'); 

router.get("/getUnfinishedOrdersInfoGroupedByClientId", getUnfinishedOrdersInfoGroupedByClientId)
router.get("/getUnfinishedOrdersInfoGroupedByType", getUnfinishedOrdersInfoGroupedByType)
router.get("/getFinishedOrdersInfoGroupedByType", getFinishedOrdersInfoGroupedByType)
router.get("/getAwaitForPaymentOrdersGroupedByType", getAwaitForPaymentOrdersGroupedByType)
router.get("/getTicketsForDay", getTicketsForDay)
router.get("/getClientOrders/:id", getClientOrders)
router.get("/getSpecificTicket/:id", getSpecificTicket)
router.post("/addOrder", addOrder)
router.post("/EditOrderTicket", EditOrderTicket)
router.post("/ticketAddSatetment", ticketUpdateTransaction)
router.post("/EditOrderFirstWeight", EditOrderFirstWeight)
router.post("/addOrderStatement", addOrderStatement)
router.post("/orderFinishState", OrderFinishState)
router.post("/orderIronPriceUpdate", OrderIronPriceUpdate)






module.exports = router;
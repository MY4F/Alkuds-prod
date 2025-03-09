const express = require('express');
const router = express.Router();
const {getFinishedOrdersInfoGroupedByType, EditOrderFirstWeight, ticketUpdateTransaction, addOrder , EditOrderTicket, getSpecificClientOrders, getTicketsInfo,getUnfinishedOrdersInfoGroupedByClientId,getUnfinishedOrdersInfoGroupedByType, OrderFinishState, getSpecificTicket, getTicketsForDay, TicketDelete} = require('../controllers/order'); 

router.get("/getUnfinishedOrdersInfoGroupedByClientId", getUnfinishedOrdersInfoGroupedByClientId)
router.get("/getUnfinishedOrdersInfoGroupedByType", getUnfinishedOrdersInfoGroupedByType)
router.get("/getFinishedOrdersInfoGroupedByType", getFinishedOrdersInfoGroupedByType)
router.get("/getTicketsForDay", getTicketsForDay)
router.get("/getSpecificTicket/:id", getSpecificTicket)
router.post("/addOrder", addOrder)
router.post("/EditOrderTicket", EditOrderTicket)
router.post("/getClientOrders", getSpecificClientOrders)
router.post("/orderFinishState", OrderFinishState)
router.post("/ticketAddSatetment", ticketUpdateTransaction)
router.post("/EditOrderFirstWeight", EditOrderFirstWeight)






module.exports = router;
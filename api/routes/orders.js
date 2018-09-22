const express = require('express')
const router = express.Router()
const checkAuth = require('../middleware/check-auth')

const OrdersController = require('../controllers/orders')

router.get('/', checkAuth, OrdersController.ordersGetAll)

router.post('/', checkAuth, OrdersController.orderCreate)

router.get('/:orderId', checkAuth, OrdersController.orderGetDetails)

router.delete('/:orderId', checkAuth, OrdersController.orderDelete)

module.exports = router

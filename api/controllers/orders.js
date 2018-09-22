const mongoose = require('mongoose')
const Order = require('../models/order')
const Product = require('../models/product')

exports.ordersGetAll = (req, res, next) => {
  Order
    .find()
    .select('product quantity _id')
    .populate('product', 'name')
    .exec()
    .then(docs => {
      res.status(200).json({
        count: docs.length,
        orders: docs.map(doc => {
          return {
            _id: doc._id,
            product: doc.product,
            quantity: doc.quantity,
            request: {
              type: 'GET',
              url: 'http://localhost:3000/orders/' + doc._id
            }
          }
        })
      })
    })
    .catch(err => {
      res.status(500).json({
        errorType: 'cannot GET orders',
        error: err
      })
    })
}

exports.orderCreate = (req, res, next) => {
  // need to make sure productId exists
  // so we can't create an order for non-existent product
  Product
    .findById(req.body.productId)
    .exec()
    .then(product => {
      if (!product) {
        return res.status(404).json({
          message: 'record not found for product (null)'
        })
      }
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId
      })
      return order.save()
    })
    .then(result => {
      res.status(201)
        .json({
          message: 'Order created',
          tedOrder: {
            _id: result._id,
            product: result.product,
            quantity: result.quantity
          },
          request: {
            type: 'GET',
            url: 'http://localhost:3000/orders/' + result._id
          }
        })
    })
    .catch(err => {
      res.status(500).json({
        error: err,
        message: 'GET productId failed'
      })
    })
}

exports.orderGetDetails = (req, res, next) => {
  Order
    .findById(req.params.orderId)
    .populate('product')
    .exec()
    .then(order => {
      if (!order) {
        return res.status(404).json({
          message: 'No order with id: ' + req.params.orderId + ' exists'
        })
      }
      res.status(200).json({
        order: order,
        request: {
          type: 'GET',
          url: 'http://localhost:3000/orders'
        }
      })
    })
    .catch(err => {
      res.status(500).json({
        error: err,
        message: 'error fetching single order'
      })
    })
}

exports.orderDelete = (req, res, next) => {
  Order
    .remove({ _id: req.params.orderId })
    .exec()
    .then(result => {
      res
        .status(200)
        .json({
          message: 'Order deleted',
          request: {
            type: 'POST',
            body: { productId: 'ID', quantity: 'Number' }
          }
        })
    })
    .catch(err => {
      res.status(500).json({
        error: err,
        message: 'Cannot find provided id for deletion'
      })
    })
}

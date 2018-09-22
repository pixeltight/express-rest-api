const mongoose = require('mongoose')
const Product = require('../models/product')

exports.getAllProducts = (req, res, next) => {
  Product
    .find()
    .select('name price _id productImage')
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        products: docs.map(doc => {
          return {
            name: doc.name,
            price: doc.price,
            productImage: doc.productImage,
            id: doc._id,
            request: {
              type: 'GET',
              url: 'http://localhost:3000/products/' + doc._id
            }
          }
        })
      }
      if (docs.length > 0) {
        res.status(200).json(response)
      } else {
        res.status(404).json({
          message: 'No product entries available'
        })
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: err
      })
    })
}

exports.createNewProduct = (req, res, next) => {
  console.log(req.file)
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path
  })
  product
    .save()
    .then(result => {
      res.status(201).json({
        message: 'Product successfully created',
        createdProduct: {
          name: result.name,
          price: result.price,
          productImage: result.productImage,
          id: result._id,
          request: {
            type: 'GET',
            url: 'http://localhost:3000/products/' + result._id
          }
        }
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: err
      })
    })
}

exports.getProductDetails = (req, res, next) => {
  const id = req.params.productId
  Product
    .findById(id)
    .select('name price _id productImage')
    .exec()
    .then(doc => {
      console.log('from db: ', doc)
      if (doc) {
        res.status(200).json({
          product: {
            name: doc.name,
            price: doc.price,
            id: doc._id
          },
          request: {
            type: 'GET',
            description: 'Get all products',
            url: 'http://localhost:3000/products/'
          }
        })
      } else {
        res.status(404).json({
          message: 'No valid entry found for provided Id'
        })
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ error: err })
    })
}

exports.editProduct = (req, res, next) => {
  const id = req.params.productId
  const updateOps = {}

  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value
  }

  Product
    .update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Product Updated',
        request: {
          type: 'GET',
          url: 'http://localhost:3000/products/' + id
        }
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: err
      })
    })
}

exports.deleteProduct = (req, res, next) => {
  const id = req.params.productId
  Product
    .remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Product with ID: ' + id + ' deleted',
        request: {
          type: 'POST',
          url: 'http://localhost:3000/products',
          postBody: { name: 'String', price: 'Number' }
        }
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500, {
        error: err
      })
    })
}

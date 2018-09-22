const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/user')

exports.getAllUsers = (req, res, next) => {
  User
    .find()
    .select('_id email password request')
    .exec()
    .then(docs => {
      res.status(200).json({
        count: docs.length,
        orders: docs.map(doc => {
          return {
            _id: doc._id,
            email: doc.email,
            password: doc.password,
            request: {
              type: 'GET',
              url: 'http://localhost:3000/users/' + doc._id
            }
          }
        })
      })
    })
    .catch(err => {
      res.status(500).json({
        error: err,
        message: 'Error retrieving users'
      })
    })
}

exports.signUpUser = (req, res, next) => {
  User
    .find()
    .select('_id email password request')
    .exec()
    .then(docs => {
      res.status(200).json({
        count: docs.length,
        orders: docs.map(doc => {
          return {
            _id: doc._id,
            email: doc.email,
            password: doc.password,
            request: {
              type: 'GET',
              url: 'http://localhost:3000/users/' + doc._id
            }
          }
        })
      })
    })
    .catch(err => {
      res.status(500).json({
        error: err,
        message: 'Error retrieving users'
      })
    })
}

exports.logInUser = (req, res, next) => {
  User
    .find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: 'Auth failed'
        })
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: 'Auth failed'
          })
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id
            },
            process.env.JWT_KEY,
            {
              expiresIn: '1hr'
            }
          )
          return res.status(200).json({
            message: 'Auth successful',
            token: token
          })
        }
        res.status(401).json({
          message: 'Auth failed'
        })
      })
    })
    .catch(err => {
      res.status(500).json({
        error: err,
        message: 'Login error'
      })
    })
}

exports.deleteUser = (req, res, next) => {
  User
    .remove({ _id: req.params.userId })
    .then(result => {
      res.status(200).json({
        message: 'User ' + req.body.userId + ' deleted'
      })
    })
    .catch(err => {
      res.status(500).json({
        error: err,
        message: 'Error deleting user'
      })
    })
}

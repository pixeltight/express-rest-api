const express = require('express')
const router = express.Router()

const userControls = require('../controllers/users')
const checkAuth = require('../middleware/check-auth')

router.get('/', userControls.getAllUsers)

router.post('/signup', userControls.signUpUser)

router.post('/login', userControls.logInUser)

router.delete('/:userId', checkAuth, userControls.deleteUser)

module.exports = router

const {makePayment, verifyPayment} = require('../controllers/payment.controller')
const router = require('express').Router()

router.post('/checkout', makePayment)


module.exports = router
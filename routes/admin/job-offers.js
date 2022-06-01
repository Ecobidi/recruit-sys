const router = require('express').Router()
const JobOfferController = require('../../controllers/job-offer')

router.get('/', JobOfferController.getAllJobOffersPage)

router.post('/new', JobOfferController.createJob)

router.get('/new', JobOfferController.createJobOfferPage)

router.get('/remove/:serial_number', JobOfferController.removeJob)

module.exports = router
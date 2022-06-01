const router = require('express').Router()
const JobApplicationController = require('../../controllers/job-application')

router.get('/', JobApplicationController.getAllJobApplicationsPage)

router.get('/approve/:serial_number', JobApplicationController.approveJobApplication)

router.get('/remove/:serial_number', JobApplicationController.removeApplication)

module.exports = router
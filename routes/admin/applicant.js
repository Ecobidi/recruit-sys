const router = require('express').Router()
const ApplicantController = require('../../controllers/applicant')

router.get('/', ApplicantController.getAllJobApplicantsPage)

router.get('/view-profile/:serial_number', ApplicantController.getApplicantProfile)

router.get('/remove/:serial_number', ApplicantController.removeJobApplicant)

module.exports = router
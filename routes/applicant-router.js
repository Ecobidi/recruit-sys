const multer = require('multer')
const router = require('express').Router()

const ApplicantClientController = require('../controllers/applicant-controller')

const upload = multer({})

router.get('/login', ApplicantClientController.getLoginPage)

router.post('/login', ApplicantClientController.handleLogin)

router.get('/register', ApplicantClientController.getRegisterPage)

router.post('/register', upload.single('photo'), ApplicantClientController.handleRegister)

router.use((req, res, next) => {
  if (req.session.applicant && req.session.loggedIn) next()
  else res.redirect('/client/login')
  // next()
})

router.get('/', ApplicantClientController.getHomePage)

router.get('/available-jobs', ApplicantClientController.getAvailableJobs)

// router.get('/apply-job/:job_id', ApplicantClientController.getApplyJobPage)

router.get('/apply-job/:job_offer_serial_number', ApplicantClientController.handleApplyJob)

router.get('/applied-jobs', ApplicantClientController.getAllApplicantAppliedJobs)

router.get('/profile', ApplicantClientController.getProfilePage)

router.post('/upload-cv', ApplicantClientController.uploadCV)

router.get('/logout', ApplicantClientController.handleLogout)

module.exports = router
const adminRouter = require('express').Router()

const CompanyRouter = require('./admin/company')
const ApplicantRouter = require('./admin/applicant')
const JobRouter = require('./admin/job-offers')
const LoginRouter = require('./admin/login')
const JobApplicationRouter = require('./admin/job-application')
const UserRouter = require('./admin/user')

const CompanyModel = require('../models/company')
const JobApplicantModel = require('../models/applicant')
const JobApplicationModel = require('../models/job-application')
const JobOfferModel = require('../models/job-offer')
const UserModel = require('../models/user')

const authorization_middleware = (req, res, next) => {
  if (req.session?.user) next()
  else res.redirect('/admin/login')
  // next()
}

let getDashboard = async (req, res) => {
  try {
    let companies_count = await CompanyModel.count()
    let job_applicants_count = await JobApplicantModel.count()
    let job_applications_count = await JobApplicationModel.count()
    let job_offers_count = await JobOfferModel.count()
    let users_count = await UserModel.count()
    res.render('admin/dashboard', {companies_count, job_applications_count, job_offers_count, job_applicants_count, users_count})
  } catch (err) {
    console.log(err)
    res.render('admin/dashboard', {
      job_applications_count: 0, job_applicants_count: 0,
      companies_count: 0, job_offers_count: 0, users_count: 0,
    })
  }
}

const logout = (req, res) => {
  req.session.user = null
  req.session.loggedIn = false
  res.redirect('/admin/login')
}

adminRouter.use('/login', LoginRouter)

// adminRouter.use(authorization_middleware)

adminRouter.get('/', getDashboard)

adminRouter.get('/dashboard', getDashboard)

adminRouter.use('/companies', CompanyRouter)

adminRouter.use('/applicants', ApplicantRouter)

adminRouter.use('/offers', JobRouter)

adminRouter.use('/applications', JobApplicationRouter)

adminRouter.use('/users', UserRouter)

adminRouter.get('/logout', logout)

module.exports = adminRouter
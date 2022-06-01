const bcryptjs = require('bcryptjs')
const sharp = require('sharp')
const ApplicantService = require('../services/applicant')
const JobOfferService = require('../services/job-offer')
const JobApplicationService = require('../services/job-application')

const { removeUploadedFile, streamUpload } = require('../config/cloudinary')

class ApplicantClientController {
  static async getLoginPage(req, res) {
    res.render('client/login')
  }

  static async getRegisterPage(req, res) {
    res.render('client/register')
  }

  static async handleLogin(req, res) {
    let dao = req.body
    try {
      let applicant = await ApplicantService.findByEmail(dao.email)
      if (!applicant) {
        req.flash('error_msg', 'Bad sign in credentials')
        return res.redirect('/client/login')
      }
      let passwordMatch = await bcryptjs.compare(dao.password, applicant.password)
      if (passwordMatch == false) {
        req.flash('error_msg', 'Bad sign in credentials')
        return res.redirect('/client/login')
      }
      req.session.loggedIn = true
      req.session.applicant = applicant
      res.redirect('/client')
    } catch (error) {
      console.log(error)
      req.flash('error_msg', 'An Error Occurred!')
      res.redirect('/client/login')
    }    
  }

  static async handleRegister(req, res) {
    let dao = req.body
    if (!dao.password || dao.password != dao.retype_password) {
      req.flash('error_msg', 'Matching Non-Empty Passwords Required')
      return res.redirect('/client/register')
    }
    try {
      let exitingApplicant = await ApplicantService.findByEmail(dao.email)
      if (exitingApplicant) {
        req.flash('error_msg', 'Email Already Exists!')
        return res.redirect('/client/register')
      }
      if (req.file) {
        console.log('hello')
        let editedImage = await sharp(req.file.buffer).resize(320, 280).toBuffer()
        const imageInfo = await streamUpload(editedImage, process.env.PROJECT_CLOUDINARY_IMAGE_FOLDER + '/applicants')
        dao.photo = imageInfo.url
        dao.photo_public_id = imageInfo.public_id
      }
      console.log(dao)
      dao.password = await bcryptjs.hash(dao.password, 10)
      await ApplicantService.create(dao)
      req.flash('success_msg', 'Registration success')
      res.redirect('/client/login')
    } catch (error) {
      console.log(error)
      req.flash('error_msg', 'An Error Occurred')
      res.redirect('/client/register')
    }
  } 

  static async handleLogout(req, res) {
    req.session.loggedIn = false
    req.session.applicant = null
    res.redirect('/client/login')
  }

  static async getHomePage(req, res) {
    res.render('client/home')
  }

  static async getProfilePage(req, res) {
    res.render('client/profile', { applicant: req.session.applicant })
  }

  static async getAvailableJobs(req, res) {
    // let jobs = await JobOfferService.findAll({})
    // res.render('client/available-jobs', {jobs})

    let pageNumber = Number.parseInt(req.query.page ? req.query.page : 1)
    let limit_size = Number.parseInt(req.query.limit || JobOfferService.QUERY_LIMIT_SIZE)
    let offset = pageNumber * limit_size - limit_size
    let search = req.query.search
    let job_offers, totalDocuments
    if (search) {
      job_offers = await JobOfferService.searchBy(search, {limit: limit_size, offset}) 
      totalDocuments = await JobOfferService.countMatchingDocuments(search)
    } else {
      job_offers = await JobOfferService.findAll({limit: limit_size, offset})
      totalDocuments = await JobOfferService.countMatchingDocuments()
    }
    let totalNumberOfPages = Math.ceil(await totalDocuments / limit_size)

    res.render('client/available-jobs', {job_offers, currentPage: pageNumber, totalNumberOfPages, totalDocuments, limit_size, offset })

  }

  static async uploadCV(req, res) {
    let dao = {}
    // if (req.file) {
    //   console.log('hello')
    //   const uploadInfo = await streamUpload(req.file.buffer, process.env.PROJECT_CLOUDINARY_IMAGE_FOLDER + '/applicant-cv')
    //   dao.cv = uploadInfo.url
    //   dao.cv_public_id = uploadInfo.public_id
    // }
    req.flash('success_msg', 'CV Successfully uploaded')
    res.redirect('/client/profile')
  }

  static async getApplyJobPage(req, res) {
    try {
      let job = await JobOfferService.findById(req.params.job_id)
      res.render('client/apply-job', { job })
    } catch (error) {
      console.log(error)
      res.redirect('/client/available-jobs')
    }
  } 

  static async handleApplyJob(req, res) {
    let dao = req.body
    let jobOffer = await JobOfferService.findBySerialNumber(req.params.job_offer_serial_number)
    dao.job_offer = jobOffer.serial_number
    dao.company_name = jobOffer.company_name
    dao.job_position = jobOffer.position
    dao.applicant_name = req.session.applicant.surname + " " + req.session.applicant.other_names
    dao.applicant = req.session.applicant.serial_number
    try {
      await JobApplicationService.create(dao)
      req.flash('success_msg', 'Job Application Successful')
      res.redirect('/client/applied-jobs')
    } catch (error) {
      console.log(error)
      res.redirect('/client/available-jobs')
    }
  }

  static async getAllApplicantAppliedJobs(req, res) {
    let applicant_serial_number = req.session.applicant.serial_number
    try {
      let job_applications = await JobApplicationService.findByApplicant(applicant_serial_number)
      res.render('client/applied-jobs', {job_applications})
    } catch (error) {
      console.log(error)
      res.redirect('/client')
    }
  }

}

module.exports = ApplicantClientController
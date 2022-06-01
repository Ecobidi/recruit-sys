const JobApplicantService = require('../services/applicant')
// const { streamUpload } = require('../config/cloudinary')

class ApplicantController {

  static async getApplicantProfile(req, res) {
    let applicant = await JobApplicantService.findBySerialNumber(req.params.serial_number)
    try {
      if (applicant) {
        res.render('admin/applicant-profile', { applicant })
      } else {
        throw new Error()
      }
    } catch (error) {
      req.flash('error_msg', 'Error fetching Applicant details')
      res.redirect('/admin/applicants')
    }
  }

  static async getAllJobApplicantsPage(req, res) {
    let pageNumber = Number.parseInt(req.query.page ? req.query.page : 1)
    let limit_size = Number.parseInt(req.query.limit || JobApplicantService.QUERY_LIMIT_SIZE)
    let offset = pageNumber * limit_size - limit_size
    let search = req.query.search
    let applicants, totalDocuments
    if (search) {
      applicants = await JobApplicantService.searchBy(search, {limit: limit_size, offset}) 
      totalDocuments = await JobApplicantService.countMatchingDocuments(search)
    } else {
      applicants = await JobApplicantService.findAll({limit: limit_size, offset})
      totalDocuments = await JobApplicantService.countMatchingDocuments()
    }
    let totalNumberOfPages = Math.ceil(await totalDocuments / limit_size)

    res.render('admin/applicants', {applicants, currentPage: pageNumber, totalNumberOfPages, totalDocuments, limit_size, offset })

  }

  static async removeJobApplicant(req, res) {
    try {
      let doc = await JobApplicantService.removeOne(req.params.serial_number)
      // remove photo
      if (doc.photo_public_id) {
        let result = await removeUploadedFile(doc.photo_public_id)  
      }
      // await fs.unlink(process.cwd() + '/uploads/images/users/' + doc.photo)
      req.flash('success_msg', 'User removed successfully')
      res.redirect('/admin/applicants')
    } catch (err) {
      console.log(err)
      req.flash('error_msg', 'Last Operation Failed')
      res.redirect('/admin/applicants')
    }
  }

  // static async getAllApplicants(req, res) {
  //   if (req.query.search && req.query.search.length > 1) {
  //     let applicants = await ApplicantService.findByName(req.query.search) 
  //     return res.render('applicants', {applicants}) 
  //   }
  //   let applicants = await ApplicantService.findAll()
  //   res.render('admin/applicants', {applicants})
  // }



  // static async removeApplicant(req, res) {
  //   try {
  //     await ApplicantService.removeOne(req.params.applicant_id)
  //     res.redirect('/a/applicants')
  //   } catch (err) {
  //     console.log(err)
  //     req.flash('error_msg', 'Last Operation Failed')
  //     res.redirect('/a/applicants')
  //   }
  // }

}

module.exports = ApplicantController
const JobApplicationService = require('../services/job-application')

class JobApplicationController {

  static async getAllJobApplicationsPage(req, res) {
    let pageNumber = Number.parseInt(req.query.page ? req.query.page : 1)
    let limit_size = Number.parseInt(req.query.limit || JobApplicationService.QUERY_LIMIT_SIZE)
    let offset = pageNumber * limit_size - limit_size
    let search = req.query.search
    let applications, totalDocuments
    if (search) {
      applications = await JobApplicationService.searchBy(search, {limit: limit_size, offset}) 
      totalDocuments = await JobApplicationService.countMatchingDocuments(search)
    // } else if (req.query.job_offer) {
    //   applications = await JobApplicationService.findByJobOffer(job_offer)
    } else {
      applications = await JobApplicationService.findAll({limit: limit_size, offset})
      totalDocuments = await JobApplicationService.countMatchingDocuments()
    }
    let totalNumberOfPages = Math.ceil(await totalDocuments / limit_size)

    res.render('admin/job-applications', {applications, currentPage: pageNumber, totalNumberOfPages, totalDocuments, limit_size, offset })

  }

  // static async getAllJobApplications(req, res) {
  //   let job_applications
  //   if (req.query.job_id) {
  //     job_applications = await JobApplicationService.findByJob(req.query.job_id)
  //   } else {
  //     job_applications = await JobApplicationService.findAll()
  //   }

  //   res.render('admin/job-applications', {job_applications})
  // }

  static async approveJobApplication(req, res) {
    try {
      await JobApplicationService.updateApprovalStatus(req.params.serial_number, true)
      res.redirect('/admin/applications')
    } catch (error) {
      console.log(err)
      req.flash('error_msg', 'Last Operation Failed')
      res.redirect('/admin/applications')
    }
  }

  static async removeApplication(req, res) {
    try {
      await JobApplicationService.removeOne(req.params.serial_number)
      res.redirect('/admin/applications')
    } catch (err) {
      console.log(err)
      req.flash('error_msg', 'Last Operation Failed')
      res.redirect('/admin/applications')
    }
  }

}

module.exports = JobApplicationController
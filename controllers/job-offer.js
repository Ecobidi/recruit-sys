const JobOfferService = require('../services/job-offer')
const CompanyService = require('../services/company')

class JobController {

  static async getAllJobOffersPage(req, res) {
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

    res.render('admin/job-offers', {job_offers, currentPage: pageNumber, totalNumberOfPages, totalDocuments, limit_size, offset })

  }

  static async createJobOfferPage(req, res) {
    let companies = await CompanyService.findAll({limit: 1000 })
    res.render('admin/job-offers-new', { companies })
  }

  static async createJob(req, res) {
    let dao = req.body
    let company = await CompanyService.findById(dao.company)
    dao.company_name = company.name
    try {
      await JobOfferService.create(dao)
      req.flash("success_msg", "Job Offer Created")
      res.redirect('/admin/offers')
    } catch (err) {
      console.log(err)
      res.redirect('/admin/offers')
    }
  }

  static async removeJob(req, res) {
    try {
      await JobOfferService.removeOne(req.params.serial_number)
      req.flash('error_msg', "Job Offer Removed")
      res.redirect('/admin/offers')
    } catch (err) {
      console.log(err)
      req.flash('error_msg', 'Last Operation Failed')
      res.redirect('/admin/offers')
    }
  }
}

module.exports = JobController
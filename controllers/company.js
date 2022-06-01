const CompanyService = require('../services/company')

class CompanyController {

  static async getAllCompaniesPage(req, res) {
    let pageNumber = Number.parseInt(req.query.page ? req.query.page : 1)
    let limit_size = Number.parseInt(req.query.limit || CompanyService.QUERY_LIMIT_SIZE)
    let offset = pageNumber * limit_size - limit_size
    let search = req.query.search
    let companies, totalDocuments
    if (search) {
      companies = await CompanyService.searchBy(search, {limit: limit_size, offset}) 
      totalDocuments = await CompanyService.countMatchingDocuments(search)
    } else {
      companies = await CompanyService.findAll({limit: limit_size, offset})
      totalDocuments = await CompanyService.countMatchingDocuments()
    }
    let totalNumberOfPages = Math.ceil(await totalDocuments / limit_size)

    res.render('admin/companies', {companies, currentPage: pageNumber, totalNumberOfPages, totalDocuments, limit_size, offset })

  }

  static async createCompanyPage(req, res) {
    res.render('admin/companies-new')
  }

  static async createCompany(req, res) {
    let dao = req.body
    try {
      await CompanyService.create(dao)
      res.redirect('/admin/companies')
    } catch (err) {
      console.log(err)
      res.redirect('/admin/companies')
    }
  }

  static async removeCompany(req, res) {
    try {
      await CompanyService.removeOne(req.params.serial_number)
      res.redirect('/admin/companies')
    } catch (err) {
      console.log(err)
      req.flash('error_msg', 'Last Operation Failed')
      res.redirect('/admin/companies')
    }
  }

}

module.exports = CompanyController
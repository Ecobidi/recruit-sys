const router = require('express').Router()
const CompanyController = require('../../controllers/company')

router.get('/', CompanyController.getAllCompaniesPage)

router.get('/new', CompanyController.createCompanyPage)

router.post('/new', CompanyController.createCompany)

router.get('/remove/:serial_number', CompanyController.removeCompany)

module.exports = router
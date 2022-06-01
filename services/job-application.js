const JobApplicationModel = require('../models/job-application')

class JobApplicationService {

  static QUERY_LIMIT_SIZE = 10;

  static async findById(id) {
    return JobApplicationModel.findById(id)
  }

  static async findBySerialNumber(serial_number) {
    return JobApplicationModel.findOne({serial_number})
  }

  static async findByJobOffer(job_offer_serial_number) {
    return JobApplicationModel.find({job_offer: job_offer_serial_number})
  }

  static async findByApplicant(applicant_serial_number) {
    return JobApplicationModel.find({applicant: applicant_serial_number})
  }

  static async searchBy(search = '', { offset = 0, limit = this.QUERY_LIMIT_SIZE}) {
    let pattern = new RegExp(search, 'ig')
    let docs = await JobApplicationModel.find({ $or: [{job_position: pattern}, {company_name:pattern}, {applicant_name: pattern}]}).skip(offset).limit(limit)
    
    return docs
  }
  
  static async findAll({ offset = 0, limit = this.QUERY_LIMIT_SIZE}) {
    return JobApplicationModel.find().skip(offset).limit(limit)
  }

  static async countMatchingDocuments(search) {
    let numberOfDocs
    let pattern = new RegExp(search, 'ig')
    if (search) {
      numberOfDocs = await JobApplicationModel.count({ $or: [{job_position: pattern}, {company_name:pattern}, {applicant_name: pattern}]})
    } else {
      numberOfDocs = await JobApplicationModel.count()
    }
    return numberOfDocs
  }

  static async create(dao) {
    return JobApplicationModel.create(dao)
  }

  // static async updateOne(update) {
  //   return JobApplicationModel.findByIdAndUpdate(update._id, {$set: update})
  // }

  static async updateJobStatus(serial_number, status) {
    return JobApplicationModel.findOneAndUpdate({serial_number}, {$set: {status}})
  }

  static async removeOne(serial_number) {
    return JobApplicationModel.findOneAndDelete({serial_number})
  }

    // static async findById(id) {
  //   return JobApplicationModel.findById(id).populate('applicant job').exec()
  // }

  // static async findByCompany(company_id) {
  //   return JobApplicationModel.find({company: company_id}).populate('applicant job').exec()
  // }

  // static async findByJob(job_id) {
  //   return JobApplicationModel.find({job: job_id}).populate('applicant job').exec()
  // }

  // static async findByApplicant(applicant_id) {
  //   return JobApplicationModel.find({applicant: applicant_id}).populate('applicant job').exec()
  // }
  
  // static async findAll() {
  //   return JobApplicationModel.find({}).populate('applicant job').exec()
  // }

  // static async save(dao) {
  //   return JobApplicationModel.create(dao)
  // }

  // static async updateApprovalStatus(id, approval_status) {
  //   return JobApplicationModel.findByIdAndUpdate(id, {$set: {approved: approval_status}})
  // }

  // static async removeOne(id) {
  //   return JobApplicationModel.findByIdAndRemove(id)
  // }


}

module.exports = JobApplicationService
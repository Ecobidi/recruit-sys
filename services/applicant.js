const JobApplicantModel = require('../models/applicant')

class JobApplicantService {

  static QUERY_LIMIT_SIZE = 10;

  static async findById(id) {
    return JobApplicantModel.findById(id)
  }

  static async findByEmail(email) {
    return JobApplicantModel.findOne({email: email})
  }

  static async findBySerialNumber(serial_number) {
    return JobApplicantModel.findOne({serial_number})
  }

  static async searchBy(search = '', { offset = 0, limit = this.QUERY_LIMIT_SIZE}) {
    let pattern = new RegExp(search, 'ig')
    let members = await JobApplicantModel.find({ $or: [{other_names: pattern}, {surname: pattern}]}).skip(offset).limit(limit)
    
    return members
  }
  
  static async findAll({ offset = 0, limit = this.QUERY_LIMIT_SIZE}) {
    return JobApplicantModel.find().skip(offset).limit(limit)
  }

  static async countMatchingDocuments(search) {
    let numberOfDocs
    let pattern = new RegExp(search, 'ig')
    if (search) {
      numberOfDocs = await JobApplicantModel.count({ $or: [{other_names: pattern}, {surname: pattern}]})
    } else {
      numberOfDocs = await JobApplicantModel.count()
    }
    return numberOfDocs
  }

  static async create(dao) {
    return JobApplicantModel.create(dao)
  }

  // static async updateOne(update) {
  //   return JobApplicantModel.findByIdAndUpdate(update._id, {$set: update})
  // }

  static async removeOne(serial_number) {
    return JobApplicantModel.findOneAndDelete({serial_number})
  }
  
  // static async findByName(name) {
  //   let pattern = new RegExp(name, 'ig')
  //   return ApplicantModel.find({$or: [{last_name: pattern}, {first_name: pattern}]})
  // }

  // static async findByEmail(email) {
  //   return ApplicantModel.findOne({email: email})
  // }

  // static async findById(id) {
  //   return ApplicantModel.findById(id)
  // }
  
  // static async findAll() {
  //   return ApplicantModel.find()
  // }

  // static async save(dao) {
  //   return ApplicantModel.create(dao)
  // }

  // static async removeOne(id) {
  //   return ApplicantModel.findByIdAndRemove(id)
  // }

}

module.exports = JobApplicantService
const JobOfferModel = require('../models/job-offer')

class JobOfferService {

  static QUERY_LIMIT_SIZE = 10;

  static async findById(id) {
    return JobOfferModel.findById(id)
  }

  static async findBySerialNumber(serial_number) {
    return JobOfferModel.findOne({serial_number})
  }

  static async searchBy(search = '', { offset = 0, limit = this.QUERY_LIMIT_SIZE}) {
    let pattern = new RegExp(search, 'ig')
    let members = await JobOfferModel.find({ $or: [{position: pattern}, {company_name:pattern}]}).skip(offset).limit(limit)
    
    return members
  }
  
  static async findAll({ offset = 0, limit = this.QUERY_LIMIT_SIZE}) {
    return JobOfferModel.find().skip(offset).limit(limit)
  }

  static async countMatchingDocuments(search) {
    let numberOfDocs
    let pattern = new RegExp(search, 'ig')
    if (search) {
      numberOfDocs = await JobOfferModel.count({ $or: [{position: pattern}, {company_name:pattern}]})
    } else {
      numberOfDocs = await JobOfferModel.count()
    }
    return numberOfDocs
  }

  static async create(dao) {
    return JobOfferModel.create(dao)
  }

  // static async updateOne(update) {
  //   return JobOfferModel.findByIdAndUpdate(update._id, {$set: update})
  // }

  static async updateJobOffer(serial_number, status) {
    return JobOfferModel.findOneAndUpdate({serial_number}, {$set: {status}})
  }

  static async removeOne(serial_number) {
    return JobOfferModel.findOneAndDelete({serial_number})
  }

  
  // static async findById(id) {
  //   return JobModel.findById(id).populate('company').exec()
  // }

  // static async findByTitle(title) {
  //   return JobModel.find({title: new RegExp(title, 'ig')}).populate('company').exec()
  // }
  
  // static async findAll() {
  //   return JobModel.find({}).populate('company').exec()
  // }

  // static async save(dao) {
  //   return JobModel.create(dao)
  // }

  // static async removeOne(id) {
  //   return JobModel.findByIdAndRemove(id)
  // }

}

module.exports = JobOfferService
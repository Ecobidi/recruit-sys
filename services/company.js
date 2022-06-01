const CompanyModel = require('../models/company')

class CompanyService {

  static QUERY_LIMIT_SIZE = 10;

  static async findById(id) {
    return CompanyModel.findById(id)
  }

  static async findBySerialNumber(serial_number) {
    return CompanyModel.findOne({serial_number})
  }

  static async searchBy(search = '', { offset = 0, limit = this.QUERY_LIMIT_SIZE}) {
    let pattern = new RegExp(search, 'ig')
    let docs = await CompanyModel.find({ $or: [{name: pattern}]}).skip(offset).limit(limit)
    
    return docs
  }
  
  static async findAll({ offset = 0, limit = this.QUERY_LIMIT_SIZE}) {
    return CompanyModel.find().skip(offset).limit(limit)
  }

  static async countMatchingDocuments(search) {
    let numberOfDocs
    let pattern = new RegExp(search, 'ig')
    if (search) {
      numberOfDocs = await CompanyModel.count({ $or: [{name: pattern}]})
    } else {
      numberOfDocs = await CompanyModel.count()
    }
    return numberOfDocs
  }

  static async create(dao) {
    return CompanyModel.create(dao)
  }

  // static async updateOne(update) {
  //   return CompanyModel.findByIdAndUpdate(update._id, {$set: update})
  // }

  static async removeOne(serial_number) {
    return CompanyModel.findOneAndDelete({serial_number})
  }

  // static async findById(id) {
  //   return CompanyModel.findById(id)
  // }
  
  // static async findAll() {
  //   return CompanyModel.find({})
  // }

  // static async findByTitle(title) {
  //   return CompanyModel.find({name: new RegExp(title, 'ig')})
  // }

  // static async save(dao) {
  //   return CompanyModel.create(dao)
  // }

  // static async removeOne(id) {
  //   return CompanyModel.findByIdAndRemove(id)
  // }

}

module.exports = CompanyService
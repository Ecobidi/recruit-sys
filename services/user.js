const UserModel = require('../models/user')

class UserService {

  
  static QUERY_LIMIT_SIZE = 10;
  
  static async findById(id) {
    return UserModel.findById(id)
  }
  
  static async findByUsername(username) {
    return UserModel.findOne({username})
  }
  
  static async findByEmail(email) {
    return UserModel.findOne({email: email})
  }

  static async findBySerialNumber(serial_number) {
    return UserModel.findOne({serial_number})
  }

  static async searchBy(search = '', { offset = 0, limit = this.QUERY_LIMIT_SIZE}) {
    let pattern = new RegExp(search, 'ig')
    let members = await UserModel.find({ $or: [{other_names: pattern}, {surname: pattern}]}).skip(offset).limit(limit)
    
    return members
  }
  
  static async findAll({ offset = 0, limit = this.QUERY_LIMIT_SIZE}) {
    return UserModel.find().skip(offset).limit(limit)
  }

  static async countMatchingDocuments(search) {
    let numberOfDocs
    let pattern = new RegExp(search, 'ig')
    if (search) {
      numberOfDocs = await UserModel.count({ $or: [{other_names: pattern}, {surname: pattern}]})
    } else {
      numberOfDocs = await UserModel.count()
    }
    return numberOfDocs
  }

  static async create(dao) {
    return UserModel.create(dao)
  }

  // static async updateOne(update) {
  //   return UserModel.findByIdAndUpdate(update._id, {$set: update})
  // }

  static async removeOne(serial_number) {
    return UserModel.findOneAndDelete({serial_number})
  }

}

module.exports = UserService
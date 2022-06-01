const mongoose = require('mongoose')
const DBCounterModel = require('./db_counter')

const CompanySchema = new mongoose.Schema({
  serial_number: {
    type: Number,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
  },
  town_state: String,
  phone: String,
  email: String,
  description: String,
})

async function getNextSequenceValue(sequenceName) {
  var sequenceDocument = await DBCounterModel.findOneAndUpdate({ key: sequenceName }, { $inc: { sequence_value: 1}})
  return sequenceDocument.sequence_value
}

CompanySchema.pre("save", async function(next){
  // console.log("serial_number ", this.serial_number)
  if (this.serial_number == undefined) {
    this.serial_number = await getNextSequenceValue('companies_id')
  }
  next()
})

module.exports = mongoose.model('company', CompanySchema)
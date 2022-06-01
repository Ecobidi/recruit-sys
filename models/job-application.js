const mongoose = require('mongoose')
const DBCounterModel = require('./db_counter')

const JobApplicationSchema = new mongoose.Schema({
  serial_number: {
    type: Number,
    unique: true,
  }, 
  job_offer: {
    type: Number,
  },
  job_position: String,
  company_name: String,
  applicant: {
    type: Number,
  },
  applicant_name: String,
  status: {
    type: String,
    enum: ['approved', 'rejected', 'awaiting'],
    default: 'awaiting'
  }
}, {timestamps: true})

async function getNextSequenceValue(sequenceName) {
  var sequenceDocument = await DBCounterModel.findOneAndUpdate({ key: sequenceName }, { $inc: { sequence_value: 1}})
  return sequenceDocument.sequence_value
}

JobApplicationSchema.pre("save", async function(next){
  // console.log("serial_number ", this.serial_number)
  if (this.serial_number == undefined) {
    this.serial_number = await getNextSequenceValue('job_applications_id')
  }
  next()
})

module.exports = mongoose.model('job_application', JobApplicationSchema)
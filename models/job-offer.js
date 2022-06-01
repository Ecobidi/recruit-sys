const mongoose = require('mongoose')
const DBCounterModel = require('./db_counter')

const JobSchema = new mongoose.Schema({
  serial_number: {
    type: Number,
    unique: true,
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'company'
  },
  company_name: String,
  position: {
    type: String,
    required: true,
  },
  vacancies: Number, 
  years_of_experience: Number,
  qualification_level: String,
  salary_range: String,
  job_location: String,
  status: {
    type: String,
    enum: ['filled', 'available', 'cancelled'],
    default: 'available'
  },
  start_date: Date,
  end_date: Date,
}, {timestamp: true})

async function getNextSequenceValue(sequenceName) {
  var sequenceDocument = await DBCounterModel.findOneAndUpdate({ key: sequenceName }, { $inc: { sequence_value: 1}})
  return sequenceDocument.sequence_value
}

JobSchema.pre("save", async function(next){
  // console.log("serial_number ", this.serial_number)
  if (this.serial_number == undefined) {
    this.serial_number = await getNextSequenceValue('job_offers_id')
  }
  next()
})

module.exports = mongoose.model('job_offer', JobSchema)
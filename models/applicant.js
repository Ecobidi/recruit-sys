const mongoose = require('mongoose')
const DBCounterModel = require('./db_counter')

const ApplicantSchema = new mongoose.Schema({
  serial_number: {
    type: Number,
    unique: true,
  },
  email: {
    unique: true,
    type: String,
  },
  other_names: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  address: String,
  phone: String,
  town: String,
  state_of_origin: String,
  religion: String,
  languages: String,
  academic_qualification: String,
  role: {
    type: String,
    default: 'applicant',
  },
  photo: String,
  photo_public_id: String,
  cv_image: String,
  cv_image_public_id: String,
  cv: String,
  cv_public_id: String,
})

async function getNextSequenceValue(sequenceName) {
  var sequenceDocument = await DBCounterModel.findOneAndUpdate({ key: sequenceName }, { $inc: { sequence_value: 1}})
  return sequenceDocument.sequence_value
}

ApplicantSchema.pre("save", async function(next){
  // console.log("serial_number ", this.serial_number)
  if (this.serial_number == undefined) {
    this.serial_number = await getNextSequenceValue('job_applicants_id')
  }
  next()
})

module.exports = mongoose.model('applicant', ApplicantSchema)
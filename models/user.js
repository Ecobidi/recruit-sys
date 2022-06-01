const mongoose = require('mongoose')
const DBCounterModel = require('./db_counter')

let UserSchema = new mongoose.Schema({
  serial_number: {
    type: Number,
    unique: true,
  },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
  },
  phone: String,
  other_names: {
    type: String,
  },
  surname: {
    type: String
  },
  role: {
    type: String,
    default: 'admin',
  },
  photo: {
    type: String,
  },
  photo_public_id: String,
  image: String,
})

async function getNextSequenceValue(sequenceName) {
  var sequenceDocument = await DBCounterModel.findOneAndUpdate({ key: sequenceName }, { $inc: { sequence_value: 1}})
  return sequenceDocument.sequence_value
}

UserSchema.pre("save", async function(next){
  // console.log("serial_number ", this.serial_number)
  if (this.serial_number == undefined) {
    this.serial_number = await getNextSequenceValue('users_id')
  }
  next()
})

module.exports = mongoose.model('user', UserSchema)
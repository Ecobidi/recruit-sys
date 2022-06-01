let mongoose = require("mongoose")

let CounterSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
  }, 
  sequence_value: {
    type: Number,
    default: 1,
  }
})

module.exports = CounterModel = mongoose.model("counter", CounterSchema)


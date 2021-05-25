const { Schema, model, Types } = require('mongoose')

const schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  price: { type: Number, default: 0 },
  category: { type: String, default: 'None' },
  subcategory: { type: String, default: 'None' },
  //field1: {type: String, default: ''},
  //field2: {type: String, default: ''},
  //field3: {type: String, default: ''},
  date: { type: Date, default: Date.now },
  //classifiedImage: { type: String },
  MultipleImages: [{ type: String }],
  owner: { type: Types.ObjectId, ref: 'User', required: true },
})

module.exports = model('Classified', schema)

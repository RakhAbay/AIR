const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  //name: {type: String, required: true},
  //surname: {type: String, required: true},
  //phone: {type: String, required: true},
  classifieds: [{ type: Types.ObjectId, ref: 'Classified' }]
})

module.exports = model('User', schema)
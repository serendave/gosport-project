const mongoose = require('mongoose');

const schema = new mongoose.Schema({ 
  userName: 'string',
  realName: 'string',
  password: 'string',
  betsDOne: 'number',
  isPremium: 'bool',
  dateOfBirthday: 'string',
  country: 'string',
  city: 'string',
  dateOfRegistration: 'string',
  email: 'string',
  balance: 'number',
  phoneNumber: 'string',
  tokens: ['string']
});
const User = mongoose.model('User', schema);

module.exports = User;
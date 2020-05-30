const mongoose = require('mongoose');

const schema = new mongoose.Schema({ 
  bet: 'string',
  time: 'string',
  state: 'string',
  coefficient: 'string',
});
const Bet = mongoose.model('Bet', schema);

module.exports = Bet;
const mongoose = require('mongoose');
const ObjectIdSchema = mongoose.SchemaTypes.ObjectId;

const schema = new mongoose.Schema({ 
  userId: {
    type: ObjectIdSchema,
    ref: 'User',
  },
  matchId: 'string',
  time: 'string',
  state: 'string',
  coefficient: 'string',
  coefficientValue: 'string',
  team1: 'string',
  team2: 'string',
  amount: 'number'
});
schema.index({ userId: 1 });
const Bet = mongoose.model('Bet', schema);

module.exports = Bet;
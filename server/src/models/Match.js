const mongoose = require('mongoose');
const ObjectIdSchema = mongoose.SchemaTypes.ObjectId;

const schema = new mongoose.Schema({ 
  team1: {
    type: ObjectIdSchema,
    ref: 'Team',
  },
  team2: {
    type: ObjectIdSchema,
    ref: 'Team',
  },
  date: 'string',
  winner: 'string',
  coefficients: {
    '1': 'number',
    '2': 'number',
    '1x': 'number',
    '2x': 'number',
    'x': 'number',
    '12': 'number'
  },
  mathPredicts: {
    '1': 'number',
    '2': 'number',
    '1x': 'number',
    '2x': 'number',
    'x': 'number',
    '12': 'number'
  },
  neuralPredicts: {
    '1': 'string',
    '2': 'string',
    '1x': 'string',
    '2x': 'string',
    'x': 'string',
    '12': 'string'
  },
  goalsTeam1: 'number',
  goalsTeam2: 'number'
});
const Match = mongoose.model('Match', schema);

module.exports = Match;
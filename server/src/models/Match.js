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
  time: 'string',
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
    '1': 'number',
    '2': 'number',
    '1x': 'number',
    '2x': 'number',
    'x': 'number',
    '12': 'number'
  },
  goalsTeam1: 'number',
  goalsTeam2: 'number'
});
const Match = mongoose.model('Match', schema);

module.exports = Match;
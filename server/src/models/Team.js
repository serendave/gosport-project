const mongoose = require('mongoose');
const ObjectIdSchema = mongoose.SchemaTypes.ObjectId;

const schema = new mongoose.Schema({ 
  teamName: 'string',
  playedMatches: [
    {
      type: ObjectIdSchema,
      ref: 'Match',
    },
  ],
  wins: 'number',
  loses: 'number',
  draws: 'number'
});
schema.index({ teamName: 1 });
const Team = mongoose.model('Team', schema);

module.exports = Team;
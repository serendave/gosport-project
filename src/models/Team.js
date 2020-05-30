const mongoose = require('mongoose');

const schema = new mongoose.Schema({ 
  teamName: 'string',
  playedMatches: [
    {
      type: ObjectIdSchema,
      ref: 'Match',
    },
  ],
});
const Team = mongoose.model('Team', schema);

module.exports = Team;
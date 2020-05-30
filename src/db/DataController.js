// The DataController module implements API to interact with database.

const logger = require('../utils/Logger');
try {
  const mongoose = require('mongoose');

  const cfg = require('../../config/default');

  const Bet = require('../models/Bet');
  const User = require('../models/User');
  const Match = require('../models/User');
  const Team = require('../models/User');
  const { v4: generateToken } = require('uuid');


  mongoose.connect(cfg.mongodb.connectionURI, {useNewUrlParser: true}).then(
    () => { logger.info('Connected to mongoDB successfully') },
    err => { logger.error('Failed to connect to mongoDB: ', err) }
  );

  // Accepts two string arguments, returns a string token.
  async function register(email, password) {
    try {
      if(!email || !password) throw new Error('Email and password are required.');
      
      const alreadyRegisteredUser = await User.findOne({ email });
      if(alreadyRegisteredUser) {
        throw new Error('User with that email is registered already.');
      }

      const token = generateToken();
      await User.create({ email, password, tokens: [token] });

      return token;
    } catch(err) {
      logger.error('Unexpected error at ' + __filename + ' while registering user: ', err);
    }
  }


  module.exports = {
    register,
  }
} catch (e) {
  logger.error('Unexpected error at ' + __filename + ': ', e);
}

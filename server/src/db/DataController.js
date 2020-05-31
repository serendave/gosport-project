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

  async function register(user) {
    try {
      if(!(user && user.email && user.password)) throw new Error('Email and password are required.');
      
      const loadedUser = await User.findOne({ email });
      if(!(loadedUser && password === user.password)) {
        throw new Error('Wrong email or password.');
      }

      const token = generateToken();
      loadedUser.tokens.push(token);
      await loadedUser.save();

      return token;
    } catch(err) {
      logger.error('Unexpected error at ' + __filename + ' while registering user: ', err);
    }
  }

  async function login(email, password) {
    try {
      if(!email || !password) throw new Error('Email and password are required.');
      
      const alreadyRegisteredUser = await User.findOne({ email });
      if(alreadyRegisteredUser) {
        throw new Error('User with that email is registered already.');
      }

      const token = generateToken();
      await User.create({ user, tokens: [token] });

      return token;
    } catch(err) {
      logger.error('Unexpected error at ' + __filename + ' while registering user: ', err);
    }
  }

  async function updateUser(token, updatedUser) {
    try {
      if(!user || !token) throw new Error('Token and user object are required.');
      
      const user = await User.findOne({ tokens: token });
      if (!user) {
        throw new Error('Incorrect token.');
      }

      for(let [key, value] in Object.entries(updatedUser)) {
        user[key] = value;
      }
      await user.save();

      return true;
    } catch(err) {
      logger.error('Unexpected error at ' + __filename + ' while registering user: ', err);
    }
  }

  async function getCurrentMatches() {
    try {
      const result = await Match.find({ winner: { $exists: false } })
        .select('team1 team2 teamName coefficients.1 coefficients.2')
        .populate("team1")
        .populate("team2")
        .lean();
      return result;
    } catch(err) {
      logger.error('Unexpected error at ' + __filename + ' while registering user: ', err);
    }
  }

  async function getMatchDetails(token, matchId) {
    try {
      if(!token || !matchId) throw new Error('Token and matchId are required.');
      
      const user = await User.findOne({ tokens: token }).lean();
      if (!user) {
        throw new Error('Incorrect token.');
      }

      const mask = {};
      if (!user.isPremium) {
        mask.neuralPredicts = false;
      }

      const match = await Match.findById({ _id: matchId }, mask).lean();
      if(!match) {
        throw new Error('Wrong match id.');
      }
      return match;
    } catch(err) {
      logger.error('Unexpected error at ' + __filename + ' while registering user: ', err);
    }
  }

  async function getTeamStats(token, teamId) {
    try {
      if(!token || !matchId) throw new Error('Token and matchId are required.');
      
      const user = await User.findOne({ tokens: token }, { _id: true, isPremium: true }).lean();
      if (!user) {
        throw new Error('Incorrect token.');
      }

      const mask = {};
      if (!user.isPremium) {
        mask.neuralPredicts = false;
      }

      const matches = await Match.find({ $or: [ { team1: teamId }, { team2: teamId } ] }, mask)
        .populate("team1").populate("team2").lean();
      if(!matches) {
        throw new Error('Wrong team id.');
      }
      return matches;
    } catch(err) {
      logger.error('Unexpected error at ' + __filename + ' while registering user: ', err);
    }
  }

  async function makeBet(token, matchId, coefficient) {
    try {
      if(!token || !matchId || !coefficient) throw new Error('Token, matchId and coefficient are required.');
      
      const user = await User.findOne({ tokens: token }, { _id: true }).lean();
      if (!user) {
        throw new Error('Incorrect token.');
      }

      const match = await Match.findbyId({ _id: matchId }, { coefficients: true }).lean();
      if(!match) {
        throw new Error('Wrong match id.');
      }
      const coefficientValue = match.coefficients[coefficient];
      if(!coefficientValue) {
        throw new Error('Wrong coefficient value.');
      }

      await Bet.create({ 
        userId: user._id,
        matchId: match._id,
        coefficient,
        coefficientValue,
        time: new Date().toISOString(),
      });

      return true;
    } catch(err) {
      logger.error('Unexpected error at ' + __filename + ' while registering user: ', err);
    }
  }

  async function getUserInfo(token) {
    try {
      if(!token) throw new Error('Token is required.');
      
      const user = await User.findOne({ tokens: token }).lean();
      if (!user) {
        throw new Error('Incorrect token.');
      }

      return user;
    } catch(err) {
      logger.error('Unexpected error at ' + __filename + ' while registering user: ', err);
    }
  }

  module.exports = {
    register,
    login,
    updateUser,
    getCurrentMatches,
    getMatchDetails,
    getTeamStats,
    makeBet,
    getUserInfo
  }
} catch (e) {
  logger.error('Unexpected error at ' + __filename + ': ', e);
}

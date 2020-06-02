// The DataController module implements API to interact with database.

const logger = require('../utils/Logger');
try {
  const mongoose = require('mongoose');

  const cfg = require('../../config/default');

  const Bet = require('../models/Bet');
  const User = require('../models/User');
  const Match = require('../models/Match');
  const Team = require('../models/Team');
  const { v4: generateToken } = require('uuid');


  mongoose.connect(cfg.mongodb.connectionURI, {useNewUrlParser: true}).then(
    async () => { logger.info('Connected to mongoDB successfully'); },
    err => { logger.error('Failed to connect to mongoDB: ', err) }
  );

  async function login(user) {
    try {
      if(!(user && user.email && user.password)) throw new Error('Email and password are required.');
      
      const loadedUser = await User.findOne({ email: user.email });
      if(!(loadedUser && user.password === loadedUser.password)) {
        throw new Error('Wrong email or password.');
      }

      const token = generateToken();
      loadedUser.tokens.push(token);
      await loadedUser.save();

      return token;
    } catch(err) {
      logger.error('Unexpected error at ' + __filename + ' while logging in user: ', err);
    }
  }

  async function register(user) {
    try {
      const { email, password } = user;
      if(!email || !password) throw new Error('Email and password are required.');
      logger.info("The email I have: " + email);
      const alreadyRegisteredUser = await User.findOne({ email });
      if(alreadyRegisteredUser) {
        throw new Error('User with that email is registered already.');
      }

      const token = generateToken();
      await User.create({ ...user, tokens: [token] });

      return token;
    } catch(err) {
      logger.error('Unexpected error at ' + __filename + ' while registering user: ', err);
    }
  }

  async function calculatePredicts() {
    const matches = await Match.find().populate("team1").populate("team2");
    for(let match of matches) {
      await calculatePredictsForMatch(match);
      logger.info("Saved coefficients: " + match.coefficients);
    }
  }

  async function calculatePredictsForMatch(match) {
    let countWinsTeam1 = match.team1.wins;
    let countLoseTeam1 = match.team1.loses;
    let countDrawTeam1 = match.team1.draws;
    let countWinsTeam2 = match.team2.wins;
    let countLoseTeam2 = match.team2.loses;
    let countDrawTeam2 = match.team2.draws;

    let countMatches = 7;
    let winRateTeam1 = (countWinsTeam1 * 100) / countMatches;
    let loseRateTeam1 = countLoseTeam1 * 100 / countMatches;
    let drawRateTeam1 = (countDrawTeam1 * 100) / countMatches;
    let winRateTeam2 = (countWinsTeam2 * 100) / countMatches;
    let loseRateTeam2 = countLoseTeam2 * 100 / countMatches;
    let drawRateTeam2 = (countDrawTeam2 * 100) / countMatches;
    let marzha = 10;
    let totalPercent = winRateTeam1 + winRateTeam2 + drawRateTeam1 + drawRateTeam2;
    let totalDrawPercent = drawRateTeam1 + drawRateTeam2;
    let totalDrawRecountPercent = (totalDrawPercent * 100) / totalPercent;
    let koefx = 100 / (totalDrawRecountPercent);
    let marzhax = ((koefx - 1) * marzha) / 100;
    match.coefficients['x'] = koefx-marzhax;
    
    let totalWinTeam1RecountPercent = (winRateTeam1 * 100) / totalPercent;
    let koef1 = 100 / totalWinTeam1RecountPercent;
    let marzha1 = ((koef1 - 1) * marzha) / 100;
    match.coefficients['1'] = koef1 - marzha1;
    
    let totalWinTeam2RecountPercent = 100 - totalDrawRecountPercent - totalWinTeam1RecountPercent;
    let koef2 = 100 / totalWinTeam2RecountPercent;
    let marzha2 = ((koef2 - 1) * marzha) / 100;
    match.coefficients['2'] = koef2 - marzha2;
    
    let koef1x = 100 / (totalDrawRecountPercent + totalWinTeam1RecountPercent);
    let marzha1x = ((koef1x - 1) * marzha) / 100;
    match.coefficients['1x'] = koef1x - marzha1x;
    
    let koef2x = 100 / (totalDrawRecountPercent + totalWinTeam2RecountPercent);
    let marzha2x = ((koef2x - 1) * marzha) / 100;
    match.coefficients['2x'] = koef2x - marzha2x;
    
    let koef12 = 100 / (totalWinTeam2RecountPercent + totalWinTeam1RecountPercent);
    let marzha12 = ((koef12 - 1) * marzha) / 100;
    match.coefficients['12'] = koef12 - marzha12;
    
    match.mathPredicts['1'] = totalWinTeam1RecountPercent;
    match.mathPredicts['2'] = totalWinTeam2RecountPercent;
    match.mathPredicts['x'] = totalDrawRecountPercent;
    match.mathPredicts['1x'] = totalWinTeam1RecountPercent + totalDrawRecountPercent;
    match.mathPredicts['2x'] = totalWinTeam2RecountPercent + totalDrawRecountPercent;
    match.mathPredicts['12'] = totalWinTeam2RecountPercent + totalWinTeam1RecountPercent;
    return await match.save();
  }

  async function calculateTeamStats() {
    const teams = await Team.find();
    logger.info("Starting to calculate wins for " + teams.length + " teams.");
    for(let team of teams) {
      const wonMatches = await Match.find({ winner: team._id.toString() });
      const draw = await Match.find({ winner: "nobody", $or: [{ team1: team._id} , { team2: team._id }] });
      const teamMatches = await Match.find({ $or: [{ team1: team._id }, { team2: team._id }]});
      let loses = 0;
      for(let match of teamMatches) {
        if(match.winner && match.winner !== "" && match.winner !== "nobody" && match.winner !== team._id.toString()) {
          loses++;
        }
      }
      team.wins = wonMatches.length;
      team.draws = draw.length;
      team.loses = loses;
      logger.info('Saving ' + team.loses + ' loses for ' + team._id, ' team');
      await team.save();
    }
    logger.info("FInished successfully.");
  }

  async function loadDataset() {
    const data = require('../../data');
    logger.info("Starting to upload " + data.length + " samples");
    let createdTeams = 0;
    let foundTeams = 0;
    for(let match of data) {
      const { team1, team2 } = match;
      const team1Query = { teamName: team1 };
      const team2Query = { teamName: team2 };
      let team1Doc = await Team.findOne(team1Query);
      let team2Doc = await Team.findOne(team2Query);
      if (!team1Doc) {
        team1Doc = await Team.create(team1Query);
        createdTeams++;
      } else foundTeams++;
      if(!team2Doc) {
        team2Doc = await Team.create(team2Query);
        createdTeams++;
      } else foundTeams++;
      const team1Id = team1Doc._id;
      const team2Id = team2Doc._id;
      match.team1 = team1Id;
      match.team2 = team2Id;
      if(team1 === match.winner) {
        match.winner = team1Id;
      } else if (team2 === match.winner) {
        match.winner = team2Id;
      }
      const matchDoc = await Match.create(match);
      team1Doc.playedMatches.push(matchDoc._id);
      team2Doc.playedMatches.push(matchDoc._id);
      await team1Doc.save();
      await team2Doc.save();
    }
    logger.info("Successfully uploaded. CreatedTeams: " + createdTeams + " foundTeams: " + foundTeams);
  }

  async function updateUser(token, updatedUser) {
    try {
      if(!updatedUser || !token) throw new Error('Token and user object are required.');
      
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
      logger.error('Unexpected error at ' + __filename + ' while updating user: ', err);
    }
  }

  async function getCurrentMatches() {
    try {
      const result = await Match.find({ winner: "" })
        .select('team1 team2 date goalsTeam1 goalsTeam2 coefficients.1 coefficients.2 coefficients.x')
        .populate("team1")
        .populate("team2")
        .lean();
      logger.info("Sending current matches: " + result);
      return result;
    } catch(err) {
      logger.error('Unexpected error at ' + __filename + ' while getting current matches: ', err);
    }
  }

  async function getMatchDetails(token, matchId) {
    try {
      if(!token || !matchId) throw new Error('Token and matchId are required.');
      
      const user = await User.findOne({ tokens: token }).lean();
      if (!user) {
        throw new Error('Incorrect token.');
      }

      const match = await Match.findById({ _id: matchId })
        .populate('team1').populate('team2').lean();
      if(!match) {
        throw new Error('Wrong match id.');
      }
      return match;
    } catch(err) {
      logger.error('Unexpected error at ' + __filename + ' while getting match details: ', err);
    }
  }

  async function getTeamStats(token, teamId) {
    try {
      if(!token || !teamId) throw new Error('Token and matchId are required.');
      
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
      logger.error('Unexpected error at ' + __filename + ' while getting team stats: ', err);
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

// Main file.

// Init logger.
const logger = require('./utils/Logger');
try {  
  const express = require('express');
  const bodyParser = require('body-parser');
  const cors = require('cors');

  const dataController = require('./db/DataController');

  const app = express();
  app.use(cors());
  app.use(bodyParser.json());

  app.use(function (err, req, res, next) {
    logger.error(err.stack);
    res.status(500).send({ error: err.message });
  });
  
  const port = 3000;
  
  app.post('/api/register', async (req, res) => {
    const user = req.body;
    const token = await dataController.register(user);
    return res.json({ token });
  });

  app.post('/api/login', async (req, res) => {
    const user = req.body;
    const token = await dataController.login(user);
    return res.json({ token });
  });

  app.post('/api/update-user', async (req, res) => {
    const { token, ...user } = req.body;
    await dataController.updateUser(token, user);
    return res.send();
  });

  app.get('/api/get-current-matches', async (req, res) => {
    const result = await dataController.getCurrentMatches();
    return res.json({ matches: result });
  });

  app.get('/api/match/get-details', async (req, res) => {
    const { token, matchId } = req.query;
    const result = await dataController.getMatchDetails(token, matchId);
    return res.json({ match: result });
  });

  app.get('/api/team/getStats', async (req, res) => {
    const { token, teamId } = req.query;
    const result = await dataController.getTeamStats(token, teamId);
    return res.json({ matches: result });
  });

  app.post('/api/make-bet', async (req, res) => {
    const { token, matchId, coefficient } = req.body;
    await dataController.makeBet(token, matchId, coefficient);
    return res.send();
  });

  app.get('/api/user-info', async (req, res) => {
    const { token } = req.query;
    const result = await dataController.getUserInfo(token);
    return res.json({ user: result });
  });
  
  app.listen(port, () => logger.info(`Аpp listening on port ${port}!`));
} catch (err) {
  logger.error('Unexpected error at ' + __filename + ': ', err);
}
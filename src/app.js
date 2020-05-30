// Main file.

// Init logger.
const logger = require('./utils/Logger');
try {  
  const express = require('express');
  const bodyParser = require('body-parser');
  const cors = require('cors')

  const app = express();
  app.use(cors());
  app.use(bodyParser.json());
  
  const port = 3000;
  
  app.post('/search', (req, res) => {
    
  });
  
  app.listen(port, () => logger.info(`Аpp listening on port ${port}!`));
} catch (err) {
  logger.error('Unexpected error at ' + __filename + ': ', err);
}
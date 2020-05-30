// The Logger module initializes winston and exports ready-to-use logger

try {
  const winston = require('winston');
  const fs = require('fs');
  
  // Ensure logs directory ensists
  const logDirPath = `${__dirname}/../logs`;
  if (!fs.existsSync(logDirPath)) {
    fs.mkdirSync(logDirPath);
  }
  
  const logger = winston.createLogger({
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    transports: [
      new winston.transports.File({ filename: `${logDirPath}/error.log`, level: 'error' }),
      new winston.transports.File({ filename: `${logDirPath}/combined.log` }),
    ]
  });
  
  if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
      format: winston.format.simple()    
    }));
  }
  
  logger.info('Logger initialized');
  logger.verbose("verber");
  
  module.exports = logger;
} catch(err) {
  console.error('Fatal error. Unable to initialize logger: ', JSON.stringify(err, null, 2));
}

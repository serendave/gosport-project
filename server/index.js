// Entry point file.
try {
  require('./src/app.js');
} catch(e) {
  console.error('Fatal error. Unable to start app.js: ', JSON.stringify(e));
}

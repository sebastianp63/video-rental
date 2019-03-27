const http = require('http');
const app = require('./app')


const port = process.env.PORT || 3000;
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);
server.listen(port);
server.on('listening', () => console.log(`Listening on port ${port}...`));
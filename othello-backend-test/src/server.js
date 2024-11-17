const app = require('./app');
const http = require('http');
const setupSocket = require('./socket');

const port = process.env.PORT || 9000;
const server = http.createServer(app);
const io = setupSocket(server);

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

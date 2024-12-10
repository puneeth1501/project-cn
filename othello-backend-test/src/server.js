const app = require('./app');
const http = require('http');
const setupSocket = require('./socket');

const port = process.env.PORT || 9000;
const server = http.createServer(app);
const io = setupSocket(server);

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// const app = require('./app');
// const http = require('http');
// const setupSocket = require('./socket');
// const os = require('os');
// const cors = require('cors');

// // Enable CORS for all routes with specific options
// app.use(cors({
//     origin: '*',
//     methods: ['GET', 'POST', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//     credentials: true,
//     optionsSuccessStatus: 200
// }));

// function getLocalIP() {
//     try {
//         const interfaces = os.networkInterfaces();
//         for (const name of Object.keys(interfaces)) {
//             for (const interface of interfaces[name]) {
//                 if (!interface.internal && interface.family === 'IPv4') {
//                     return interface.address;
//                 }
//             }
//         }
//         return 'localhost';
//     } catch (error) {
//         console.error('Error getting local IP:', error);
//         return 'localhost';
//     }
// }

// const port = process.env.PORT || 9000;
// const server = http.createServer(app);
// const io = setupSocket(server);
// const localIP = getLocalIP();

// // Add headers to all responses
// app.use((req, res, next) => {
//     res.setHeader('X-Content-Type-Options', 'nosniff');
//     res.setHeader('X-Frame-Options', 'DENY');
//     res.setHeader('X-XSS-Protection', '1; mode=block');
//     next();
// });

// server.on('error', (error) => {
//     console.error('Server error:', error);
//     if (error.code === 'EADDRINUSE') {
//         console.error(`Port ${port} is already in use. Please try another port or kill the process using this port.`);
//     }
// });

// process.on('uncaughtException', (error) => {
//     console.error('Uncaught Exception:', error);
// });

// process.on('unhandledRejection', (error) => {
//     console.error('Unhandled Rejection:', error);
// });

// app.get('/health', (req, res) => {
//     res.json({
//         status: 'ok',
//         timestamp: new Date().toISOString(),
//         ip: localIP,
//         port: port
//     });
// });

// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).json({
//         error: 'Internal Server Error',
//         message: err.message
//     });
// });

// const startServer = () => {
//     server.listen(port, '0.0.0.0', () => {
//         const serverUrl = `http://${localIP}:${port}`;
        
//         console.log('\n=== Game Server Running ===');
//         console.log(`Local IP: ${localIP}`);
//         console.log(`Port: ${port}`);
//         console.log('\nAccess URLs:');
//         console.log(`- Local Machine: http://localhost:${port}`);
//         console.log(`- Network: ${serverUrl}`);
        
//         console.log('\nTo test connection:');
//         console.log(`1. ping ${localIP}`);
//         console.log(`2. curl ${serverUrl}`);
//         console.log(`3. curl ${serverUrl}/health`);
        
//         console.log('\nImportant Notes:');
//         console.log('- Make sure both machines are on the same network');
//         console.log('- Keep this terminal window open');
//         console.log('- If connection fails:');
//         console.log('  * Check firewall settings');
//         console.log('  * Verify both machines are on same network');
//         console.log('  * Try restarting the server');
//         console.log('\nPress Ctrl+C to stop the server');
//     });
// };

// const shutdownServer = (signal) => {
//     console.log(`\nReceived ${signal}. Performing graceful shutdown...`);
//     server.close(() => {
//         console.log('Server closed. Exiting process.');
//         process.exit(0);
//     });

//     // Force exit if graceful shutdown fails
//     setTimeout(() => {
//         console.error('Could not close connections in time, forcefully shutting down');
//         process.exit(1);
//     }, 10000);
// };

// process.on('SIGTERM', () => shutdownServer('SIGTERM'));
// process.on('SIGINT', () => shutdownServer('SIGINT'));

// startServer();

// module.exports = server;
// // 192.168.1.255
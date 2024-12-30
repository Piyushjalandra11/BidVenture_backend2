import express from 'express';
import { config } from './config/index';
import { registerMiddlewares, registerRoutes } from './middlewares/middlewares';
import { logger } from './helpers';
import sequelize from './db';
import './modules/v1/associations';
import cors from 'cors';
import { startAuctionCronJob } from './helpers/cron';
import http from 'http';  // Import HTTP server for Socket.io
import { Server } from 'socket.io';  // Correct import for Socket.io SServer
import { handleSocket } from './helpers/socket';

Promise.all([]).then(bootstrapServer).catch(handleServerInitError);

function bootstrapServer() {
  const app = express();

  const server = http.createServer(app);  // Create HTTP server using Express app
  const io = new Server(server);  // Initialize Socket.io server correctly

  const PORT = config.PORT;

  app.use(cors({
    origin: '*',
  }));

  registerMiddlewares(app);
  registerRoutes(app);

  startAuctionCronJob();
  
  sequelize.sync({ alter: true })
    .then(() => {
      console.log('Database connected successfully');
    })
    .catch((error: Error) => {
      console.error('Error syncing database:', error);
    });

    handleSocket(io)

  server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

function handleServerInitError(e: unknown) {
  logger.error('Error initializing server:', e);
}

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
});

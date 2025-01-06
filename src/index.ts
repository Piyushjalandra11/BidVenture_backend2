import express from 'express';
import { config } from './config/index';
import { registerMiddlewares, registerRoutes } from './middlewares/middlewares';
import { logger } from './helpers';
import sequelize from './db';
import './modules/v1/associations';
import cors from 'cors';
import { startAuctionCronJob } from './helpers/cron';
import http from 'http';
import { Server } from 'socket.io';
import { handleSocket } from './helpers/socket';
import associateModels from './modules/v1/associations';

Promise.all([]).then(bootstrapServer).catch(handleServerInitError);

function bootstrapServer() {
  const app = express();

  const server = http.createServer(app);
  const io = new Server(server);

  const PORT = config.PORT;

  app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
  }));

  registerMiddlewares(app);
  registerRoutes(app);

  startAuctionCronJob();
  associateModels();

  sequelize.sync({ alter: true })    // force: true to reacreate bd
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
 
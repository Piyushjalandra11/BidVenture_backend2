import './config/index';

import express from 'express';
import { config } from './config/index';
import { registerMiddlewares, registerRoutes } from './middlewares/middlewares';
import { logger } from './helpers';
import sequelize from './db';


Promise.all([]).then(bootstrapServer).catch(handleServerInitError);

function bootstrapServer() {
  const app = express();

  const PORT = config.PORT;

  registerMiddlewares(app);
  registerRoutes(app);

  sequelize.sync({ alter: true })  // Set force: true during development if you want to drop and recreate tables
    .then(() => {
        console.log('Database connected successfully');
    })
    .catch((error: Error) => {
        console.error('Error syncing database:', error);
    });


app.listen(PORT, () => {
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

import { Sequelize } from 'sequelize';
import { config } from '../config';

const sequelize = new Sequelize(
    config.DB_NAME as string, // Database name
    config.DB_USER as string, // Database username
    config.DB_PASSWORD as string, // Database password
    {
      host: config.DB_HOST, // Database host
      port: parseInt(config.DB_PORT as string, 10) || 5432, // Database port (default is 5432 for PostgreSQL)
      dialect: 'postgres',
      logging: false, // Disable logging in the console
    }
  );

export default sequelize;

import { Sequelize } from 'sequelize';
import { config } from '../config';

const sequelize = new Sequelize(
    config.DB_NAME as string, 
    config.DB_USER as string, 
    config.DB_PASSWORD as string, 
    {
      host: config.DB_HOST, 
      port: parseInt(config.DB_PORT as string, 10) || 5432, 
      dialect: 'postgres',
      logging: false, 
    }
  );

export default sequelize;

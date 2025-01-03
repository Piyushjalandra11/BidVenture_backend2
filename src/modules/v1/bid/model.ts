import { Model, DataTypes } from 'sequelize';
import sequelize from '../../../db';

export class Bid extends Model {
  public id!: number;
  public auction_id!: string;
  public user_id!: string;
  public amount!: number;
}

Bid.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'bids',
  }
);


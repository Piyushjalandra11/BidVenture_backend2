import { Model, DataTypes } from 'sequelize';
import sequelize from '../../../db';  // sequelize instance

export class Bid extends Model {
  public bid_id!: string;
  public auction_id!: string;
  public user_id!: string;
  public amount!: number;
  public created_at!: Date;
}

Bid.init(
  {
    bid_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    auction_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'bids',
  }
);

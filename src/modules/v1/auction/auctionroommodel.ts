import { Model, DataTypes } from 'sequelize';
import sequelize from '../../../db';
import Auction from './model';

export default class AuctionRoom extends Model {
  public id!: number;
  public auctionId!: number;
  public timeRemaining!: number;
  public currentBid!: number;
  public leaderboard!: string;  // Store leaderboard in JSON or any format
}

AuctionRoom.init(
  {
    auctionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Auction,
        key: 'id',
      },
    },
    timeRemaining: {
      type: DataTypes.INTEGER, // Time in seconds
      allowNull: false,
    },
    currentBid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    leaderboard: {
      type: DataTypes.JSONB,  // Store leaderboard as JSON
      allowNull: false,
      defaultValue: [],
    },
  },
  {
    sequelize,
    modelName: 'AuctionRoom',
    tableName: 'auction_rooms',
    timestamps: true,
  }
);


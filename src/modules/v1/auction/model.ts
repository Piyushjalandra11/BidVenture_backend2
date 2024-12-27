import { Model, DataTypes } from 'sequelize';
import sequelize from '../../../db';

export class Auction extends Model {
  public auction_id!: string;
  public product_id!: string;
  public start_time!: Date;
  public end_time!: Date;
  public current_highest_bid!: number;
  public highest_bidder!: string;
  public status!: 'active' | 'closed';
}

Auction.init(
  {
    auction_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    product_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    start_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    current_highest_bid: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    highest_bidder: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    status: {
      type: DataTypes.ENUM('active', 'closed'),
      defaultValue: 'active',
    },
  },
  {
    sequelize,
    tableName: 'auctions',
  }
);


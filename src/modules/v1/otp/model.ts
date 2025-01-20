import { DataTypes, Model } from 'sequelize';
import sequelize from '../../../db';

class OTP extends Model {
  public id!: number;
  public email!: string;
  public otp!: string;
  public expiresAt!: Date;
}

OTP.init(
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    otp: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    isUsed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  },
  {
    sequelize,
    modelName: 'otp',
  }
);

export default OTP;

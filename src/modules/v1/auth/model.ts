import { DataTypes, Model } from 'sequelize';
import sequelize from '../../../db';

class User extends Model {
  public id!: number;
  public email!: string;
  public name!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
  public isVerified!: boolean; 
}

User.init(
  {
    email: {
      type: DataTypes.STRING, 
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isVerified:{
      type: DataTypes.BOOLEAN,  
      allowNull: false,
      defaultValue: false, 
    }
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
  }
);

export default User;

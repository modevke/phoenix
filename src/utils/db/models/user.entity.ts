import {
  CreationOptional,
  Model,
  Optional,
  Sequelize,
  DataTypes,
} from "sequelize";

import config from 'config';
import { OperationalOptions } from "../../../global";

const { maxLogInAttempts } = config.get<OperationalOptions>('serverConfigs.operational');


export type UserAttributes = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  active: boolean;
  searchable: string;
  tags: string;
  loginAttempts: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
};

type UserCreationAttributes = Optional<UserAttributes, "id">;

export class User extends Model<UserAttributes, UserCreationAttributes> {
  declare id: CreationOptional<number>;
  declare firstName: string;
  declare lastName: string | null;
  declare email: string;
  declare phone: string;
  declare active: boolean;
  declare searchable: string | null;
  declare tags: string | null;
  declare loginAttempts: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: Date | null;

}

export function UserEntity(sequelize: Sequelize) {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      firstName: {
        type: new DataTypes.STRING(128),
        allowNull: false,
      },
      email: {
        type: new DataTypes.STRING(128),
        allowNull: false,
      },
      phone: {
        type: new DataTypes.STRING(128),
        allowNull: false,
      },
      active: {
        type: new DataTypes.BOOLEAN(),
        defaultValue: true,
        allowNull: false,
      },
      lastName: {
        type: new DataTypes.STRING(128),
        allowNull: true,
      },
      searchable: {
        type: new DataTypes.STRING(128),
        allowNull: true,
      },
      tags: {
        type: new DataTypes.STRING(128),
        allowNull: true,
      },
      loginAttempts: {
        type: new DataTypes.INTEGER(),
        allowNull: true,
      },
      createdAt: {
        field: "created_at",
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        field: "updated_at",
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      deletedAt: {
        field: "deleted_at",
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "user",
      sequelize,
      timestamps: true,
      paranoid: true,
      hooks: {
        beforeUpdate: (record, options) => {
         
          if(record.changed("loginAttempts")){
            if(record.loginAttempts === maxLogInAttempts){
              record.active = false
            }
          }
          if(record.changed("active")){
            if(record.active == true){
              record.loginAttempts = 0
            }
          }
        }
      }
    }
  );

  return User
}

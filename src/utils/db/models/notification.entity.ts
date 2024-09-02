import {
  CreationOptional,
  Model,
  Optional,
  Sequelize,
  DataTypes,
  ForeignKey,
  NonAttribute,
} from "sequelize";
import { User } from "./user.entity";

export type NotificationAttributes = {
  id: number;
  message: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
};

type NotificationCreationAttributes = Optional<NotificationAttributes, "id">;

class Notification extends Model<
  NotificationAttributes,
  NotificationCreationAttributes
> {
  declare id: CreationOptional<number>;
  declare message: string;
  declare status: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: Date | null;

  declare userId?: ForeignKey<User["id"]>;

  declare user?: NonAttribute<User>;
}

export function NotificationEntity(sequelize: Sequelize) {
  Notification.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      message: {
        type: new DataTypes.TEXT(),
        allowNull: false,
      },
      status: {
        type: new DataTypes.STRING(128),
        allowNull: false,
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
      tableName: "notification",
      sequelize,
      timestamps: true,
      paranoid: true,
    }
  );

  return Notification;
}

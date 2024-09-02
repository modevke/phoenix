import {
    CreationOptional,
    Model,
    Optional,
    Sequelize,
    DataTypes,
  } from "sequelize";

export type RoleAttributes = {
    id: number;
    name: string;
    description: string;
    administrative: boolean;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
};

type RoleCreationAttributes = Optional<RoleAttributes, "id">;

export class Role extends Model<RoleAttributes, RoleCreationAttributes> {
    declare id: CreationOptional<number>;
    declare name: string;
    declare description: string;
    declare administrative: boolean;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    declare deletedAt: Date | null;
    declare expiresAt: Date | null;
}


export function RoleEntity(sequelize: Sequelize) {
    Role.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: new DataTypes.STRING(128),
          allowNull: false,
        },
        description: {
          type: new DataTypes.STRING(128),
          allowNull: false,
        },
        administrative: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        expiresAt: {
          field: "expires_at",
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
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
        tableName: "role",
        sequelize,
        timestamps: true,
        paranoid: true
      }
    );
  
    return Role
  }
  
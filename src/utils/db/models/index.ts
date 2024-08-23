import { Sequelize } from "sequelize";
import { UserEntity } from "./user.entity";

export default function(sequelize: Sequelize){

    const user =  UserEntity(sequelize)

    return {
        user
    }

}
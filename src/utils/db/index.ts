import { Sequelize, Options } from "sequelize";
import config from 'config';
import models from './models'

const dbOptions = config.get<Options>('serverConfigs.db');
const sequelize: Sequelize = new Sequelize(dbOptions)

const initModels = models(sequelize)

export default {
    sequelize,
    User: initModels.user
}

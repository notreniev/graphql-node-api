import * as Sequelize from "sequelize";
import { ModelsInterface } from './ModelsInsterface';

export interface DBConnection extends ModelsInterface{
    sequelize: Sequelize.Sequelize
}
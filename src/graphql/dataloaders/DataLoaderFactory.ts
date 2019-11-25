import * as DataLoader from 'dataloader';
import { DataLoaderParam } from '../../interfaces/DataLoaderParamInterface';
import { DataLoaders } from "../../interfaces/DataLoadersInterface";
import { DBConnection } from '../../interfaces/DbConnectionInterface';
import { PostInstance } from '../../models/PostModel';
import { UserInstance } from '../../models/UserModel';
import { RequestedFields } from '../ast/RequestedFields';
import { PostLoader } from './PostLoader';
import { UserLoader } from './UserLoader';


export class DataLoaderFactory {

    constructor(
        private db: DBConnection,
        private requestedFields: RequestedFields
    ) {}

    getLoaders(): DataLoaders {
        return {
            userLoader: new DataLoader<DataLoaderParam<number>, UserInstance>(
                (params: DataLoaderParam<number>[]) => UserLoader.batchUsers(this.db.User, params, this.requestedFields),
                { cacheKeyFn: (param: DataLoaderParam<number[]>) => param.key }
            ),
            postLoader: new DataLoader<DataLoaderParam<number>, PostInstance>(
                (params: DataLoaderParam<number>[]) => PostLoader.batchPosts(this.db.Post, params, this.requestedFields),
                { cacheKeyFn: (param: DataLoaderParam<number[]>) => param.key }
            )
        };
    }

}
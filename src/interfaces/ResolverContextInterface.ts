import { RequestedFields } from './../graphql/ast/RequestedFields';
import { AuthUser } from './AuthUserInterface';
import { DataLoaders } from './DataLoadersInterface';
import { DBConnection } from './DbConnectionInterface';

export interface ResolverContext {
    db?: DBConnection
    authorization?: string
    authUser?: AuthUser
    dataloaders?: DataLoaders
    requestedFields?: RequestedFields
}
import { DBConnection } from './DbConnectionInterface'
import { AuthUser } from './AuthUserInterface';

export interface ResolverContext {
    db?: DBConnection
    authorization?: string
    user?: AuthUser
}
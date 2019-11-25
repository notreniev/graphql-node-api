import { makeExecutableSchema } from 'graphql-tools';
import { merge } from 'lodash';
import { Mutation } from './mutation';
import { Query } from './Query';
import { commentResolvers } from './resources/comment/comment.resolver';
import { commentTypes } from './resources/comment/comment.schema';
import { postResolvers } from './resources/post/post.resolver';
import { postTypes } from './resources/post/post.schema';
import { userResolvers } from './resources/user/user.resolver';
import { userTypes } from './resources/user/user.schema';
import { tokenTypes } from './resources/token/token.schema';
import { tokenResolvers } from '../graphql/resources/token/token.resolver'

const resolvers = merge(
    commentResolvers,
    postResolvers,
    tokenResolvers,
    userResolvers
)

const SchemaDefinition = `
    type Schema {
        query: Query
        mutation: Mutation
    }
`

export default makeExecutableSchema({
    typeDefs: [
        SchemaDefinition,
        Query,
        Mutation,
        commentTypes,
        postTypes,
        tokenTypes,
        userTypes
    ],
    resolvers
})
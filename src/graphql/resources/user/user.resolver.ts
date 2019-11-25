import { GraphQLResolveInfo } from "graphql";
import { Transaction } from 'sequelize';
import { handleError } from "../../../utils/utils";
import { RequestedFields } from '../../ast/RequestedFields';
import { compose } from "../../composable/composable.resolver";
import { DBConnection } from './../../../interfaces/DbConnectionInterface';
import { ResolverContext } from './../../../interfaces/ResolverContextInterface';
import { UserInstance } from './../../../models/UserModel';
import { throwError } from './../../../utils/utils';
import { authResolvers } from './../../composable/auth.resolver';

export const userResolvers = {

    User: {
        posts: (user: UserInstance, { first = 10, offset = 0 }, { db, requestedFields }: { db: DBConnection, requestedFields: RequestedFields}, info: GraphQLResolveInfo) => {
            return db.Post
                .findAll({
                    where: { author: user.get('id') },
                    limit: first,
                    offset: offset, 
                    attributes: requestedFields.getFields(info, {keep: ['id'], exclude: ['comments']})
                })
                .catch(handleError)
        }
    },
    Query: {

        users: (parent, { first = 10, offset = 0 }, context: ResolverContext, info: GraphQLResolveInfo) => {
            return context.db.User
                .findAll({
                    limit: first,
                    offset: offset,
                    attributes: context.requestedFields.getFields(info, {keep: ['id'], exclude: ['posts']})
                }).catch(handleError);
        }, 

        user: (parent, { id }, context: ResolverContext, info: GraphQLResolveInfo) => {
            id = parseInt(id)
            return context.db.User
                .findById(id,{
                    attributes: context.requestedFields.getFields(info, {keep: ['id'], exclude: ['posts']})
                })
                .then((user: UserInstance) => {
                    if (!user) throw new Error(`User with id ${id} not found!`)
                    return user
                })
                .catch(handleError)
        }, 
        currentUser: compose(...authResolvers)((parent, args, context: ResolverContext, info: GraphQLResolveInfo) => {
            return context.db.User
                .findById(context.authUser.id, {
                    attributes: context.requestedFields.getFields(info, {keep: ['id'], exclude: ['posts']})
                })
                .then((user: UserInstance) => {
                    throwError(!user, `User with id ${context.authUser.id} not found!`);
                    return user;
                }).catch(handleError);
        })

    },
    Mutation: {
        createUser: (parent, { input }, { db }: { db: DBConnection }, info: GraphQLResolveInfo) => {
            return db.sequelize.transaction((t: Transaction) => {
                return db.User.create(input, { transaction: t })
            }).catch(handleError)
        },
        updateUser: (parent, { id, input }, { db }: { db: DBConnection }, info: GraphQLResolveInfo) => {
            id = parseInt(id)
            return db.sequelize.transaction((t: Transaction) => {
                return db.User.findById(id)
                    .then((user: UserInstance) => {
                        if (!user) throw new Error(`User with id ${id} not found!`)
                        return user.update(input, { transaction: t })
                    })
            }).catch(handleError)
        },
        updateUserPassword: (parent, { id, input }, { db }: { db: DBConnection }, info: GraphQLResolveInfo) => {
            id = parseInt(id)
            return db.sequelize.transaction((t: Transaction) => {
                return db.User.findById(id)
                    .then((user: UserInstance) => {
                        if (!user) throw new Error(`User with id ${id} not found!`)
                        return user.update(input, { transaction: t })
                            .then((user: UserInstance) => !!user)
                    })
            }).catch(handleError)
        },
        deleteUser: (parent, { id }, { db }: { db: DBConnection }, info: GraphQLResolveInfo) => {
            id = parseInt(id)
            return db.sequelize.transaction((t: Transaction) => {
                return db.User
                    .findById(id)
                    .then((user: UserInstance) => {
                        if (!user) throw new Error(`User with id ${id} not found!`)
                        return user.destroy({ transaction: t })
                            .then(user => {
                                return !!<any>user;
                            })
                    })
            }).catch(handleError)
        }


    }
}
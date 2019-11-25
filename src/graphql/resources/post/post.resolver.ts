import { GraphQLResolveInfo } from 'graphql';
import { Transaction } from 'sequelize';
import { DBConnection } from '../../../interfaces/DbConnectionInterface';
import { PostInstance } from '../../../models/PostAttributes';
import { handleError } from '../../../utils/utils';
import { DataLoaders } from './../../../interfaces/DataLoadersInterface';
import { ResolverContext } from './../../../interfaces/ResolverContextInterface';

export const postResolvers = {
    Post: {
        author: (post, args, { db, dataloaders: { userLoader } }: { db: DBConnection, dataloaders: DataLoaders }, info: GraphQLResolveInfo) => {
            return userLoader
                .load({key: post.get('author'), info})
                .catch(handleError)
        },
        comments: (post, { first = 10, offset = 0 }, context: ResolverContext, info: GraphQLResolveInfo) => {
            return context.db.Comment
                .findAll({
                    where: { post: post.get('id') },
                    limit: first,
                    offset: offset,
                    attributes: context.requestedFields.getFields(info)
                })
                .catch(handleError)
        }
    },

    Query: {
        posts: (parent, { first = 10, offset = 0 }, context: ResolverContext, info: GraphQLResolveInfo) => {
            return context.db.Post
                .findAll({
                    limit: first,
                    offset: offset,
                    attributes: context.requestedFields.getFields(info, { keep: ['id'], exclude: ['posts'] })
                })
                .catch(handleError)
        },

        post: (parent, { id }, context: ResolverContext, info: GraphQLResolveInfo) => {
            id = parseInt(id)
            return context.db.Post
                .findById(id, {
                    attributes: context.requestedFields.getFields(info, { keep: ['id'], exclude: ['posts'] })
                })
                .then((post: PostInstance) => {
                    if (!post) throw new Error(`Post with ID ${id} not found!`)
                    return post
                })
                .catch(handleError)
        }
    },

    Mutation: {
        createPost: (parent, { input }, { db }: { db: DBConnection }, info: GraphQLResolveInfo) => {
            return db.sequelize.transaction((t: Transaction) => {
                return db.Post
                    .create(input, { transaction: t })
            }).catch(handleError)
        },
        updatePost: (parent, { id, input }, { db }: { db: DBConnection }, info: GraphQLResolveInfo) => {
            id = parseInt(id)
            return db.sequelize.transaction((t: Transaction) => {
                return db.Post
                    .findById(id)
                    .then((post: PostInstance) => {
                        if (!post) throw new Error(`Post with id ${id} not found!`)
                        return post.update(input, { transaction: t })
                    })
            }).catch(handleError)
        },
        deletePost: (parent, { id, input }, { db }: { db: DBConnection }, info: GraphQLResolveInfo) => {
            id = parseInt(id)
            return db.sequelize.transaction((t: Transaction) => {
                return db.Post
                    .findById(id)
                    .then((post: PostInstance) => {
                        if (!post) throw new Error(`Post with id ${id} not found!`)
                        return post.destroy({ transaction: t })
                            .then(post => !!<any>post)
                    })
            }).catch(handleError)
        }

    }
}
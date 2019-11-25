import { GraphQLResolveInfo } from "graphql";
import { Transaction } from "sequelize";
import { DBConnection } from "../../../interfaces/DbConnectionInterface";
import { CommentInstance } from "../../../models/CommentModel";
import { RequestedFields } from '../../ast/RequestedFields';
import { DataLoaders } from './../../../interfaces/DataLoadersInterface';
import { handleError } from './../../../utils/utils';

export const commentResolvers = {

    Comment: {
        user: (comment, args, { db, dataLoaders: { userLoader } }: { db: DBConnection, dataLoaders: DataLoaders }, info: GraphQLResolveInfo) => {
            return userLoader
                .load({ key: comment.get('user'), info })
                .catch(handleError)
        },

        post: (comment, args, { db, dataLoaders: { postLoader } }: { db: DBConnection, dataLoaders: DataLoaders }, info: GraphQLResolveInfo) => {
            return postLoader
                .load({ key: comment.get('post'), info })
                .catch(handleError)
        }
    },

    Query: {
        commentsByPost: (parent, { postId, first = 10, offset = 0 }, { db, requestedFields }: { db: DBConnection, requestedFields: RequestedFields }, info: GraphQLResolveInfo) => {
            postId = parseInt(postId)
            return db.Comment
                .findAll({
                    where: { post: postId },
                    limit: first,
                    offset: offset,
                    attributes: requestedFields.getFields(info)
                })
                .catch(handleError)
        }
    },

    Mutation: {
        createComment: (parent, { input }, { db }: { db: DBConnection }, info: GraphQLResolveInfo) => {
            return db.sequelize.transaction((t: Transaction) => {
                return db.Comment
                    .create(input, { transaction: t })
            }).catch(handleError)
        },
        updateComment: (parent, { id, input }, { db }: { db: DBConnection }, info: GraphQLResolveInfo) => {
            id = parseInt(id)
            return db.sequelize.transaction((t: Transaction) => {
                return db.Comment
                    .findById(id)
                    .then((comment: CommentInstance) => {
                        if (!comment) throw new Error(`Comment with ${id} not found`)
                        return comment.update(input, { transaction: t })
                    })
            }).catch(handleError)
        },
        deleteComment: (parent, { id }, { db }: { db: DBConnection }, info: GraphQLResolveInfo) => {
            id = parseInt(id)
            return db.sequelize.transaction((t: Transaction) => {
                return db.Comment
                    .findById(id)
                    .then((comment: CommentInstance) => {
                        if (!comment) throw new Error(`Comment with ${id} not found`)
                        return comment.destroy({ transaction: t })
                            .then(comment => !!<any>comment)
                    })
            }).catch(handleError)
        }


    }
}
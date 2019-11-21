import { CommentModel } from './../models/CommentModel';
import { PostModel } from './../models/PostAttributes';
import { UserModel } from './../models/UserModel';

export interface ModelsInterface {
    User: UserModel
    Post: PostModel
    Comment: CommentModel
}
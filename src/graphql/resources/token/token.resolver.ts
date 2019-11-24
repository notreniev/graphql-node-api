import { DBConnection } from '../../../interfaces/DbConnectionInterface'
import { UserInstance } from '../../../models/UserModel'
import * as jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../../../utils/utils'

export const tokenResolvers = {

    Mutation: {
        createToken: (parent, { email, password }, { db }: { db: DBConnection }) => {
            return db.User.findOne({
                where: { email: email },
                attributes: ['id', 'password']
            }).then((user: UserInstance) => {

                let errorMessage: string = "Unauthorazed, wrong email or password"
                if (!user || !user.isPassword(user.get('password'), password)) { throw new Error(errorMessage) }

                const payLoad = { sub: user.get('id') }

                return {
                    token: jwt.sign(payLoad, JWT_SECRET)
                }
            })
        }
    }
}
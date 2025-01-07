import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import User from '../modules/v1/auth/model'
import { IUser } from '../@types'
import { config } from '../config'

export interface CustomRequest extends Request {
    user?: IUser
    token?: string
}

interface DecodedToken {
    id: string
}

const secret = config.JWT_SECRET || ""

const auth = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '')
        console.log(token);

        if (!token) {
            throw new Error('Authentication failed. Token missing.')
        }
        console.log(token)

        const decoded = jwt.verify(token, secret) as DecodedToken
        console.log(decoded);
        const user = await User.findByPk(decoded.id);

        if (!user) {
            throw new Error('Authentication failed. User not found.')
        }

        req.user = user
        req.token = token
        next()
    } catch (error) {
        res.status(401).send({ error: 'Authentication failed.' })
    }
}

export default auth

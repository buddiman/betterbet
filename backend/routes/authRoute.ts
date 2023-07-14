import express, { Request, Response } from 'express';
import { createUser, getUserById, getUserByUsername, updateUser } from '../database/dto/user'
import { hash, compare } from "bcrypt";
import { sign } from "jsonwebtoken";

export const authRoute = express.Router()

const saltRounds = 10
const secretKey = 'super_secret_key_1234'

authRoute.post('/auth/register', async (req: Request, res: Response): Promise<void> => {
    const user = req.body.user

    user.password = await hash(user.password, saltRounds)

    try {
        const newUser = await createUser(user)
        res.json({
            success: true,
            message: 'new user with id ' + newUser.id + ' inserted'
        })
    } catch (e: any) {
        res.json({
            success: false,
            message: "ERROR while inserting a user\n" + user
        })
    }
})

authRoute.post('/auth/login', async (req: Request, res: Response): Promise<void> => {
    const username = req.body.username
    const password = req.body.password

    const user = await getUserByUsername(username)

    try {
        const result = await compare(password, user.password)
        if(result) {
            const jwt = sign({userId: user.id}, secretKey, {expiresIn: '1h'})
            res.json({
                id: user.id,
                name: user.username,
                isAdmin: user.isAdmin,
                jwt,
                success: true,
                message: 'authenticated: ' + result
            })
        } else {
            res.json({
                success: false,
                message: 'Authentication failed: Invalid username or password'
            });
        }
    } catch (e: any) {
        res.json({
            success: false,
            message: "ERROR while inserting a user\n" + username
        })
    }
})



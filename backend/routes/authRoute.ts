import express, { Request, Response } from 'express';
import {
    changeUserPasswordHash,
    createUser,
    getAllUsernamesAndIds,
    getUserById,
    getUserByUsername
} from '../database/dto/user'
import { compare, hash } from "bcrypt";
import { sign } from "jsonwebtoken";
import { betRoute } from "./betRoute";

export const authRoute = express.Router()

const saltRounds = 10
const secretKey = 'super_secret_key_1234'

authRoute.post('/auth/register', async (req: Request, res: Response): Promise<void> => {
    const user = req.body.user
    user.username.toLowerCase()

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

authRoute.post('/auth/changePassword', async (req: Request, res: Response): Promise<void> => {
    const request = req.body

    try {
        const existingUser = await getUserById(request.id)

        if(await compare(request.oldPassword, existingUser.password) === false) {
            res.json({
                success: false,
                message: "Password hashs differ! abort"
            })
            return
        }

        request.newPassword = await hash(request.newPassword, saltRounds)
        const result = await changeUserPasswordHash(request.id, request.newPassword)

        res.json({
            success: true,
            message: 'password updated for ' + existingUser.username
        })
    } catch (e: any) {
        res.json({
            success: false,
            message: "ERROR while updating password"
        })
    }
})

authRoute.post('/auth/resetPassword', async (req: Request, res: Response): Promise<void> => {
    const request = req.body

    try {
        request.newPassword = await hash(request.newPassword, saltRounds)
        const result = await changeUserPasswordHash(request.id, request.newPassword)

        res.json({
            success: true,
            message: 'password updated for ' + request.id
        })
    } catch (e: any) {
        res.json({
            success: false,
            message: "ERROR while updating password"
        })
    }
})

authRoute.post('/auth/login', async (req: Request, res: Response): Promise<void> => {
    const username = req.body.username.toLowerCase()
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

betRoute.get('/users', async (req:Request, res: Response): Promise<void> => {
    try {
        const users = await getAllUsernamesAndIds()
        res.json({
            users
        })
    } catch (e: any) {
        res.json({
            success: false,
            message: "ERROR while fetching all users including their ids"
        })
    }
})


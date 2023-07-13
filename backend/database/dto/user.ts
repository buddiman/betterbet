import { User } from "shared/models/user"
import prisma from "../dbConfig";

export async function createUser(user: User): Promise<User> {
    return prisma.user.create({
        data: user
    });
}

export async function updateUser(user: User): Promise<User> {
    return prisma.user.update({
        where: {
            id: user.id,
        },
        data: user
    })
}

export function getUserById(userId: number): Promise<User> {
    return prisma.user.findUnique({
        where: {
            id: userId
        }
    })
}

export function getUserByUsername(username: string): Promise<User> {
    return prisma.user.findUnique({
        where: {
            username: username
        }
    })
}
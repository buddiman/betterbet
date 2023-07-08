import express from 'express'
import { defaultRoute } from './defaultRoute'
import { betRoute } from "./betRoute";

export const routes = express.Router()

routes.use(defaultRoute)
routes.use(betRoute)
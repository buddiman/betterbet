import express from 'express'
import { defaultRoute } from './defaultRoute'
import { betRoute } from "./betRoute";
import { leagueRoute } from "./leagueRoute";
import { eventRoute } from "./eventRoute";

export const routes = express.Router()

routes.use(defaultRoute)
routes.use(betRoute)
routes.use(leagueRoute)
routes.use(eventRoute)
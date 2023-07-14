import express from 'express'
import { defaultRoute } from './defaultRoute'
import { betRoute } from "./betRoute";
import { leagueRoute } from "./leagueRoute";
import { eventRoute } from "./eventRoute";
import { authRoute } from "./authRoute";
import { scrapeRoute } from "./scrapeRoute";

export const routes = express.Router()

routes.use(defaultRoute)
routes.use(betRoute)
routes.use(leagueRoute)
routes.use(eventRoute)
routes.use(authRoute)
routes.use(scrapeRoute)
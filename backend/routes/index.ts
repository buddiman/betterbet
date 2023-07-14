import express from 'express'
import { defaultRoute } from './defaultRoute'
import { betRoute } from "./betRoute";
import { leagueRoute } from "./leagueRoute";
import { eventRoute } from "./eventRoute";
import { authRoute } from "./authRoute";
import { scrapeRoute } from "./scrapeRoute";
import { betInstanceRoute } from "./betInstanceRoute";

export const routes = express.Router()

routes.use(defaultRoute)
routes.use(betRoute)
routes.use(leagueRoute)
routes.use(eventRoute)
routes.use(authRoute)
routes.use(scrapeRoute)
routes.use(betInstanceRoute)
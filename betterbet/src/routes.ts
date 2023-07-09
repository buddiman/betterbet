import Home from "./pages/Home";
import Bets from "./pages/Bets";
import Login from "./pages/Login";

import {FC} from "react";

interface Route {
    key: string,
    title: string,
    path: string,
    enabled: boolean,
    component: FC<{}>
}

export const routes: Array<Route> = [
    {
        key: 'home-route',
        title: 'Home',
        path: '/',
        enabled: true,
        component: Home
    },
    {
        key: 'bets-route',
        title: 'Bets',
        path: '/bets',
        enabled: true,
        component: Bets
    },
    {
        key: 'login-route',
        title: 'Login',
        path: '/login',
        enabled: true,
        component: Login
    }
]
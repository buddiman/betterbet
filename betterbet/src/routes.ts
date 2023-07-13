import Home from "./pages/Home";
import Bets from "./pages/Bets";
import Login from "./pages/Login";
import Manage from "./pages/Manage";

import {FC} from "react";
import Register from "./pages/Register";

interface Route {
    key: string,
    title: string,
    path: string,
    enabled: boolean,
    component: FC<{}> | FC<any>
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
    },
    {
        key: 'register-route',
        title: 'Register',
        path: '/register',
        enabled: true,
        component: Register
    },
    {
        key: 'manage-route',
        title: 'Manage',
        path: '/manage',
        enabled: true,
        component: Manage
    }
]
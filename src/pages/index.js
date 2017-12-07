import asyncRoute from '../lib/asyncRoute';

const Login = asyncRoute(() => import('./Login'));
const Join = asyncRoute(() => import('./Join'));

export {
    Login,
    Join,
};
